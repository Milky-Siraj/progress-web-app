"use client";
import { useState, useEffect } from "react";
import { FaTasks, FaPlus, FaBell, FaTrash, FaBars } from "react-icons/fa";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for toggling sidebar

  // Poll for unread notifications every 10 seconds
  useEffect(() => {
    const getNotificationCount = async () => {
      try {
        const notificationCount = await fetchNotifications();
        const unreadNotifications = notificationCount.filter(
          (notification) => !notification.isRead
        );
        setNotification(unreadNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications immediately when the component mounts
    getNotificationCount();

    // Set up polling to fetch notifications every 10 seconds
    const intervalId = setInterval(getNotificationCount, 10000); // 10 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Fetch project names when the component mounts
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
  }, []);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const handleProjectDelete = async (pId) => {
  //   try {
  //     const confirm = window.confirm(
  //       "Are you sure you want to delete this project? Notice all the tasks are going to be lost"
  //     );
  //     if (!confirm) return;

  //     const responseDelete = await fetch("/api/create-project", {
  //       method: "DELETE",
  //       body: JSON.stringify({ pId }),
  //     });

  //     if (responseDelete.status == 200) {
  //       toast.success("project deleted successfully");
  //       const updatedProjectNames = projectName.filter(
  //         (project) => project._id !== pId
  //       );
  //       setProjectName(updatedProjectNames);
  //     } else {
  //       toast.error("failed to delete project");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("failed to delete project");
  //   }
  // };
  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        {/* Hamburger Button to toggle sidebar */}
        <button
          onClick={toggleSidebar}
          className="text-white text-3xl p-2 bg-gray-800 rounded-lg shadow-lg focus:outline-none hover:bg-gray-700 transition-all duration-200 ease-in-out"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar - Hidden on small screens, visible as a normal block on medium/large screens */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white flex flex-col justify-between transform z-40 ${
          isSidebarOpen ? "translate-x-0  pt-20" : "-translate-x-full pt-6"
        } transition-transform duration-300 ease-in-out shadow-lg md:relative md:translate-x-0 md:w-64`}
      >
        <div className="pr-6 pl-6">
          <ul>
            <li className="mb-4">
              <Link href={`/pages/hometasks/${userId}`} onClick={toggleSidebar}>
                <div className="flex items-center gap-3  rounded-lg  transition-colors duration-200 ease-in-out cursor-pointer">
                  <FaTasks className="text-lg" />
                  <span className="text-sm font-medium">My Tasks</span>
                </div>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="/create-team" onClick={toggleSidebar}>
                <div className="flex items-center gap-3 rounded-lg  transition-colors duration-200 ease-in-out cursor-pointer">
                  <FaPlus className="text-lg" />
                  <span className="text-sm font-medium">Create Project</span>
                </div>
              </Link>
            </li>
          </ul>

          <div className="mt-6 mb-4">
            <span className="text-gray-400 text-xl font-semibold">
              Projects
            </span>
          </div>

          {/* Display project names */}
          {projectName.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-300 ml-4">
              <span>No projects found</span>
            </div>
          ) : (
            projectName.map((pname) => (
              <Link
                key={pname._id}
                href={`/pages/team/${pname._id}`}
                onClick={toggleSidebar}
              >
                <div
                  className={`${
                    pathname === `/pages/team/${pname._id}` ||
                    pathname === `/pages/bug/${pname._id}`
                      ? "bg-gray-800"
                      : ""
                  } flex justify-between gap-2 cursor-pointer ml-4 mt-3 text-sm text-gray-300 hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200 ease-in-out`}
                >
                  <span>{pname.name}</span>
                  {/* <button
                    className=" text-gray-500 hover:text-red-500"
                    onClick={() => handleProjectDelete(pname._id)}
                  >
                    <FaTrash size={14} />
                  </button> */}
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="pr-6 pl-6">
          <ul>
            <li className="mb-4">
              <Link href="/pages/profile" onClick={toggleSidebar}>
                <div className="flex items-center gap-3 rounded-lg  transition-colors duration-200 ease-in-out cursor-pointer">
                  <Image
                    className="h-6 w-6 rounded-full"
                    src={profileImage || profileDefault}
                    alt="Profile Image"
                    width={32}
                    height={32}
                  />
                  <span className="text-sm font-medium">Profile</span>
                </div>
              </Link>
            </li>
            <Link href="/pages/notification" onClick={toggleSidebar}>
              <li className="mb-4">
                <div className="flex items-center gap-3 rounded-lg  transition-colors duration-200 ease-in-out cursor-pointer">
                  <div className="relative flex items-center">
                    <FaBell className="text-xl text-gray-300" />
                    {notification.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full border-2 border-gray-800 shadow-md">
                        {notification.length}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    Notifications
                  </span>
                </div>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
