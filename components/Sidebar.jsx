import { useState, useEffect, useRef } from "react";
import { FaTasks, FaPlus, FaBell, FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import profileDefault from "@/assets/profile.png";
import { useSession } from "next-auth/react";
import { fetchCProject, fetchNotifications } from "@/utils/request";
import { usePathname } from "next/navigation";
import EnterTeamNameModal from "@/components/EnterTeamNameModal";

const Sidebar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const userId = session?.user?.id;

  const pathname = usePathname();

  const [projectName, setProjectName] = useState([]);
  const [notification, setNotification] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEnterNameModalOpen, setIsEnterNameModalOpen] = useState(false);

  const sidebarRef = useRef(null); // Ref for the sidebar element

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

    getNotificationCount();

    const intervalId = setInterval(getNotificationCount, 10000);

    return () => clearInterval(intervalId);
  }, []);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const addProjectName = (newProjectName) => {
    setProjectName((prevProjectName) => [...prevProjectName, newProjectName]);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-white text-3xl p-2 bg-gray-800 rounded-lg shadow-lg focus:outline-none hover:bg-gray-700 transition-all duration-200 ease-in-out"
        >
          <FaBars />
        </button>
      </div>

      <div
        ref={sidebarRef} // Attach ref to the sidebar
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white flex flex-col justify-between transform z-40 ${
          isSidebarOpen ? "translate-x-0 pt-20" : "-translate-x-full pt-6"
        } transition-transform duration-300 ease-in-out shadow-lg md:relative md:translate-x-0 md:w-64`}
      >
        {/* Sidebar content */}
        <div className="pr-6 pl-6">
          {/* My Tasks */}
          <ul>
            <li className="mb-4">
              <Link
                href={`/pages/hometasks/${userId}`}
                onClick={closeSidebar} // Close sidebar on link click
              >
                <div className="flex items-center gap-3 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer">
                  <FaTasks className="text-lg" />
                  <span className="text-sm font-medium">My Tasks</span>
                </div>
              </Link>
            </li>
          </ul>

          {/* Projects */}
          <div className="flex justify-between mt-6 mb-4">
            <span className="text-gray-400 text-xl font-semibold">
              Projects
            </span>
            <button
              onClick={() => setIsEnterNameModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-200 hover:bg-gray-500 transition-colors duration-200 ease-in-out cursor-pointer shadow-lg"
            >
              <FaPlus className="text-lg" />
            </button>
          </div>

          {/* Project List */}
          {projectName.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-300 ml-4">
              <span>No projects found</span>
            </div>
          ) : (
            projectName.map((pname) => (
              <Link
                key={pname._id}
                href={`/pages/team/${pname._id}`}
                onClick={closeSidebar} // Close sidebar on link click
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
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Profile and Notifications */}
        <div className="pr-6 pl-6">
          <ul>
            <li className="mb-4">
              <Link href="/pages/profile" onClick={closeSidebar}>
                <div className="flex items-center gap-3 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer">
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
            <Link href="/pages/notification" onClick={closeSidebar}>
              <li className="mb-4">
                <div className="flex items-center gap-3 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer">
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

      {/* Enter Team Name Modal */}
      {isEnterNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <EnterTeamNameModal
            addProjectName={addProjectName}
            closeModal={() => setIsEnterNameModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
