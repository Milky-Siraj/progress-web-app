"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import EnterTeamNameModal from "@/components/EnterTeamNameModal"; // Import the modal component

const CreateTeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([
    "Member 1",
    "Member 2",
    "Member 3",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleDelete = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  const handleDone = () => {
    setIsModalOpen(true); // Open the modal when "Done" is clicked
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-3xl pb-10 font-bold">Create Team</h1>
      <div className="flex flex-row justify-center items-center mb-8 gap-4 w-2/3">
        <input
          type="text"
          placeholder="Search team members..."
          className="px-4 py-3 rounded-lg bg-gray-700 text-white w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-400 shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaSearch />
          Search
        </button>
      </div>

      <ul className="w-2/3 mt-4">
        {teamMembers
          .filter((member) =>
            member.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((member, index) => (
            <li
              key={index}
              className="flex justify-between items-center mb-2 bg-gray-700 px-4 py-2 rounded-lg"
            >
              <span>{member}</span>
              <button
                className="text-red-500"
                onClick={() => handleDelete(index)}
              >
                X
              </button>
            </li>
          ))}
      </ul>

      <button
        onClick={handleDone}
        className="mt-8 px-5 py-3 rounded-lg bg-green-500 text-white hover:bg-green-400 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Done
      </button>

      {isModalOpen && (
        <EnterTeamNameModal closeModal={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default CreateTeamPage;
