// ProfilePage.jsx
"use client";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";

const ProfilePage = () => {
  const profilePicture = "/path/to/profile-picture.jpg"; // Replace with actual image path

  return (
    <div className="flex flex-col items-start p-6 bg-gray-800 text-white min-h-screen">
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <Image
            src={profilePicture}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full border-4 border-blue-500"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">John Doe</h1>
          <p className="text-lg mb-4">johndoe@example.com</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
            <FaEdit />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
