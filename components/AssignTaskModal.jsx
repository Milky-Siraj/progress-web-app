// AssignTaskModal.jsx
"use client";
import { useState } from "react";

const AssignTaskModal = ({ closeModal }) => {
  const [assignTo, setAssignTo] = useState("");
  const [task, setTask] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
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
        <h2 className="text-2xl font-bold text-white mb-4">Assign Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Assign To</label>
            <input
              type="text"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Task</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Assigned By</label>
            <input
              type="text"
              value={assignedBy}
              onChange={(e) => setAssignedBy(e.target.value)}
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

export default AssignTaskModal;
