"use client";
import { useState } from "react";

const EnterTeamNameModal = ({ closeModal, teamMembers }) => {
  const [projectName, setProjectName] = useState({
    name: "",
    members: teamMembers,
  });
  const [showTasks, setShowTasks] = useState(false); // State for checkbox

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProjectName((prevName) => ({
      ...prevName,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setShowTasks((prev) => !prev); // Toggle checkbox state
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const res = await fetch("/api/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName.name, // Correctly passing project name
        members: projectName.members, // Members array from state
        showTasks: showTasks, // Include checkbox state in the request
      }),
    });

    if (res.ok) {
      console.log("Project created successfully");
      closeModal(); // Close modal after successful save
    } else {
      console.error("Failed to create project");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Project Name</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            name="name"
            placeholder="Team Name"
            className="px-4 py-2 rounded-lg bg-gray-600 text-white w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={projectName.name}
            onChange={handleChange}
            required // Ensure the field is not empty
          />
          <label className="flex items-center cursor-pointer pb-2">
            <input
              type="checkbox"
              className="mr-2" // Optional spacing for the checkbox
              checked={showTasks} // Use the state for checked status
              onChange={handleCheckboxChange} // Update state on change
            />
            <p className="text-gray-200 text-sm">
              Show All Tasks to Team Members
            </p>
          </label>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterTeamNameModal;
