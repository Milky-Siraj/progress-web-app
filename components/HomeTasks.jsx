"use client";
import { useState } from "react";
import TaskModal from "@/components/TaskModal";
import TaskListCard from "@/components/TaskListCard";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="bg-gray-800 min-h-screen p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
        >
          Add Task
        </button>
      </div>

      {tasks.map((task) => (
        <TaskListCard key={task.id} task={task} />
      ))}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTask={addTask}
      />
    </div>
  );
};

export default HomePage;
