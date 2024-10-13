import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
const TaskListCard = ({ task, onDelete }) => {
  //const router = useRouter();

  const taskId = task._id;

  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleCheckboxChange = async (e) => {
    e.preventDefault();

    // Get the new completion state based on checkbox status
    const newCompletionState = e.target.checked;

    try {
      const res = await fetch(`/api/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId, // The ID of the task you're updating
          isCompleted: newCompletionState, // Pass the updated completion state
        }),
      });

      if (res.status === 200) {
        //toast.success("Task updated successfully");

        // Update local completion state
        setIsCompleted(newCompletionState);
      } else if (res.status === 401 || res.status === 403) {
        console.error("Permission denied");
      } else {
        console.error("Something went wrong");
      }
    } catch (error) {
      console.error("Something went wrong");
      console.error(error);
    }
  };

  // fetch task data from the form
  // const fetchTaskData =async()=>{
  // try{
  //   const TaskData=await fetchTasks(taskId)
  // }
  // }

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Task?"
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/tasks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }), // Passing taskId in the body
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        onDelete(taskId);
        toast.success("Task deleted");
      } else {
        toast.error("Failed to delete the task");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete the task");
    }
  };

  return (
    <div
      className={`rounded-lg p-4 mb-4 transition-colors duration-300 ${
        isCompleted ? "bg-gray-600" : "bg-gray-900 bg-opacity-50"
      }`}
    >
      <div className="flex items-center justify-between">
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
        <div>
          <button
            onClick={() => handleDeleteTask(task._id)}
            className="text-red-500 hover:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskListCard;
