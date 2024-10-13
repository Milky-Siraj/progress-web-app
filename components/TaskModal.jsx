"use client";
import { useState } from "react";

const TaskModal = ({ isOpen, onClose, addTask }) => {
  const [task, setTask] = useState({
    title: "",
    createdAt: new Date().toISOString().split("T")[0], // current date
    completed: false,
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setTask((prevTasks) => ({
      ...prevTasks,
      title: value,
      createdAt: new Date().toISOString(), // current date
      completed: false,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <form action="/api/tasks" method="POST">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Task Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 bg-gray-800 rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
