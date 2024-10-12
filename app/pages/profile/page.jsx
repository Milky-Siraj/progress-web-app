"use client";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react"; // Import signOut function from next-auth
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import profileDefault from "@/assets/profile.png";
const ProfilePage = () => {
  const { data: session } = useSession();
  const profilePicture = session?.user?.image; // Replace with actual image path
  const name = session?.user?.name;
  const email = session?.user?.email;
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSignOut = async () => {
    // Pass the callbackUrl option to redirect the user after signout
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-start p-6 bg-gray-800 text-white min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-32 h-32">
          <Image
            src={profilePicture || profileDefault}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full border-4 border-blue-500"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-lg mb-4">{email}</p>

          {/* Buttons for Edit and Sign Out */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
              <FaEdit />
              Edit
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Columns with Teams Information */}
      <div className="flex gap-12">
        {/* Teams you are in */}
        <div>
          <h2 className="text-xl font-bold mb-4">Teams you are in</h2>
          <ul className="list-disc list-inside">
            <li>Group 1</li>
            <li>Group 2</li>
          </ul>
        </div>

        {/* Teams you created */}
        <div>
          <h2 className="text-xl font-bold mb-4">Teams you created</h2>
          <ul className="list-disc list-inside">
            <li>Group 1</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
