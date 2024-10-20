"use client";
import { useState, useEffect } from "react";
import { FaTasks, FaPlus, FaBell } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import profileDefault from "@/assets/profile.png";
import { useSession } from "next-auth/react";
import { fetchCProject, fetchNotifications } from "@/utils/request";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const userId = session?.user?.id;

  const pathname = usePathname();

  const [projectName, setProjectName] = useState([]); // Initialize with an empty array
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const getProjectNames = async () => {
      try {
        const fetchedProjectNames = await fetchCProject();
        setProjectName(fetchedProjectNames);
      } catch (error) {
        console.error("Failed to fetch project names", error);
      }
    };

    getProjectNames();
  }, []); // Empty dependency array means this effect runs only once

  useEffect(() => {
    const getNotificationCount = async () => {
      const notificationCount = await fetchNotifications();
      const unreadNotifications = notificationCount.filter(
        (notification) => !notification.isRead
      );
      setNotification(unreadNotifications);
    };
    getNotificationCount();
  }, []);
  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col justify-between">
      <div className="p-4">
        <ul>
          <li className="mb-2">
            {/* Corrected dynamic link interpolation */}
            <Link href={`/pages/hometasks/${userId}`}>
              <div className="flex items-center gap-2">
                <FaTasks />
                <span>My Tasks</span>
              </div>
            </Link>
          </li>

          <li className="mb-2">
            <Link href="/create-team">
              <div className="flex items-center gap-2 cursor-pointer">
                <FaPlus />
                <span className="ml-2">Create project</span>
              </div>
            </Link>
          </li>
        </ul>

        <div className="ml-1 mt-4 mb-3 ">
          <span className="text-white-100 text-xl font-bold">Projects</span>
        </div>

        {/* Display project names */}
        {projectName.length === 0 ? (
          <div className="flex items-center gap-2 cursor-pointer ml-4 text-gray-300">
            <span>No projects found</span>
          </div>
        ) : (
          projectName.map((pname) => (
            <Link key={pname._id} href={`/pages/team/${pname._id}`}>
              <div
                className={`${
                  pathname === `/pages/team/${pname._id}` ||
                  pathname === `/pages/bug/${pname._id}`
                    ? "bg-gray-700"
                    : ""
                } flex items-center gap-2 cursor-pointer ml-4 mt-3 text-sm text-gray-300 hover:bg-gray-700 rounded-md px-3 py-2`}
              >
                <span>{pname.name}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="p-4">
        <ul>
          <li className="mb-2">
            <Link href="/pages/profile">
              <div className="flex items-center gap-2">
                <Image
                  className="h-8 w-8 rounded-full"
                  src={profileImage || profileDefault}
                  alt="Profile Image"
                  width={30}
                  height={30}
                />
                <span>Profile</span>
              </div>
            </Link>
          </li>
          <Link href="/pages/notification">
            <li className="mb-2">
              <div className="flex items-center gap-2">
                <FaBell />
                <span>Notifications</span>
                <span className="bg-red-500 text-white rounded-full px-2 text-sm">
                  {notification.length}
                </span>
              </div>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
