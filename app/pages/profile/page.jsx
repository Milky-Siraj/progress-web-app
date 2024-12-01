"use client";
import Image from "next/image";
import { FaEdit, FaFire, FaTrash } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import profileDefault from "@/assets/profile.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchCProject, fetchCProjectCreated } from "@/utils/request";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profilePicture = session?.user?.image;
  const name = session?.user?.name;
  const email = session?.user?.email;
  const router = useRouter();
  const userStreak = 5; // Example streak count
  const [projectName, setProjectName] = useState([]);
  const [projectsNameCreated, setProjectsNameCreated] = useState([]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const getProjectNames = async () => {
      try {
        const fetchedProjectNames = await fetchCProject();
        setProjectName(fetchedProjectNames);

        const fetchedProjectNamesCreated = await fetchCProjectCreated();
        setProjectsNameCreated(fetchedProjectNamesCreated);
      } catch (error) {
        console.error("Failed to fetch project names", error);
      }
    };

    getProjectNames();
  }, []);

  const handleProjectDelete = async (pId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this project? Notice all the tasks are going to be lost"
      );
      if (!confirm) return;

      const responseDelete = await fetch("/api/create-project", {
        method: "DELETE",
        body: JSON.stringify({ pId }),
      });

      if (responseDelete.status === 200) {
        toast.success("Project deleted successfully");
        const updatedProjectNames = projectsNameCreated.filter(
          (project) => project._id !== pId
        );
        setProjectsNameCreated(updatedProjectNames);
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col items-center p-20 bg-gray-800 text-white min-h-screen">
      {/* Profile Info */}
      <div className="flex flex-col items-center w-full md:flex-row md:items-start md:justify-center mb-10 overflow-hidden">
        <div className=" relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg ">
          <Image
            src={profilePicture || profileDefault}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col items-center md:items-start md:ml-8 mt-6 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-semibold">{name}</h1>
          <p className="text-lg md:text-xl text-gray-300">{email}</p>

          {/* Streak Counter */}
          <div className="flex items-center gap-2 mt-4 text-yellow-400">
            <FaFire className="text-2xl" />
            <span className="text-lg font-bold">{userStreak} Day Streak</span>
          </div>

          {/* Edit & Sign Out Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg transition duration-150">
              <FaEdit />
              Edit Profile
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg transition duration-150"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Teams Information */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Projects you are in */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Projects you are in
          </h2>
          <ul className="space-y-2 text-gray-300">
            {projectName.length === 0 ? (
              <div className="text-gray-300 ml-4">No projects found</div>
            ) : (
              projectName.map((pname) => (
                <Link key={pname._id} href={`/pages/team/${pname._id}`}>
                  <div className="flex items-center gap-2 ml-4 mt-3 text-sm text-gray-300 hover:bg-gray-800 rounded-lg px-3 py-2 transition duration-150">
                    <span className="text-blue-500">•</span> {pname.name}
                  </div>
                </Link>
              ))
            )}
          </ul>
        </div>

        {/* Projects you created */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Projects you created
          </h2>
          <ul className="space-y-2 text-gray-300">
            {projectsNameCreated.length === 0 ? (
              <div className="text-gray-300 ml-4">No projects found</div>
            ) : (
              projectsNameCreated.map((pname) => (
                <div
                  key={pname._id}
                  className="flex justify-between items-center ml-4 mt-3 text-sm hover:bg-gray-800 rounded-lg px-3 py-2 transition duration-150"
                >
                  <Link href={`/pages/team/${pname._id}`}>
                    <div className="cursor-pointer text-gray-300">
                      <span className="text-blue-500 pr-1">•</span> {pname.name}
                    </div>
                  </Link>
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleProjectDelete(pname._id)}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
