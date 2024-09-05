import { useState } from "react";

const TaskListCard = ({ task }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleCheckboxChange = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div
      className={`rounded-lg p-4 mb-4 transition-colors duration-300 ${
        isCompleted ? "bg-gray-600" : "bg-gray-900 bg-opacity-50"
      }`}
    >
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={isCompleted}
            onChange={handleCheckboxChange}
          />
          <span
            className={`w-5 h-5 inline-block border border-gray-600 rounded-full ${
              isCompleted ? "bg-gray-600" : "bg-transparent"
            }`}
          ></span>
        </label>
        <div className="ml-3">
          <h3
            className={`text-lg font-bold text-white transition-colors duration-300 ${
              isCompleted ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </h3>
          <p className="text-gray-500">Created on: {task.createdAt}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskListCard;
