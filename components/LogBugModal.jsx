"use client";
import { useState } from "react";

const LogBugModal = ({ closeModal }) => {
  const [description, setDescription] = useState("");
  const [logType, setLogType] = useState("");
  const [loggedBy, setLoggedBy] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here

    // Close the modal after submission
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-700 p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold text-white mb-4">Log</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Log Type</label>
            <input
              type="text"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Logged By</label>
            <input
              type="text"
              value={loggedBy}
              onChange={(e) => setLoggedBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogBugModal;
