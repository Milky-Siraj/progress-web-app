"use client";
import { useState } from "react";

const TaskModal = ({ isOpen, onClose, addTask }) => {
  const [task, setTask] = useState({
    title: "",
    createdAt: new Date().toISOString().split("T")[0],
    completed: false,
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setTask((prevTasks) => ({
      ...prevTasks,
      title: value,
      createdAt: new Date().toISOString(),
      completed: false,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Task</h2>
        <form action="/api/tasks" method="POST">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-300 mb-2">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
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
