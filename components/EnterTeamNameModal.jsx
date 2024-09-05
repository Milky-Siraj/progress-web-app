"use client";
import { useState } from "react";

const EnterTeamNameModal = ({ closeModal }) => {
  const [teamName, setTeamName] = useState("");

  const handleSave = () => {
    console.log("Team Name:", teamName);
    closeModal(); // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Team Name</h2>
        <input
          type="text"
          placeholder="Team Name"
          className="px-4 py-2 rounded-lg bg-gray-600 text-white w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterTeamNameModal;
