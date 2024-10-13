"use client";
import { useState, useEffect } from "react";
import TaskModal from "@/components/TaskModal";
import TaskListCard from "@/components/TaskListCard";
import { fetchTasks } from "@/utils/request";
import { useParams } from "next/navigation";

const HomeTasks = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      const fetchedTasks = await fetchTasks(id);
      const parsedTasks = fetchedTasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));

      setTasks(parsedTasks);
      setIsLoading(false);
    };

    getTasks();
  }, [id]);

  const addTask = (newTask) => {
    const taskWithDate = {
      ...newTask,
      createdAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, taskWithDate]);
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  // Helper function to format dates
  const formatDate = (date) => date.toLocaleDateString();

  // Helper function to group tasks by date
  const groupTasks = () => {
    const todayTasks = [];
    const previous7DaysTasks = [];
    const previous30DaysTasks = [];
    const olderTasks = {};

    tasks.forEach((task) => {
      const taskDate = new Date(task.createdAt);

      if (isToday(taskDate)) {
        todayTasks.push(task);
      } else if (isWithinDays(taskDate, 7)) {
        previous7DaysTasks.push(task);
      } else if (isWithinDays(taskDate, 30)) {
        previous30DaysTasks.push(task);
      } else {
        const monthYear = taskDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        if (!olderTasks[monthYear]) {
          olderTasks[monthYear] = [];
        }
        olderTasks[monthYear].push(task);
      }
    });

    return { todayTasks, previous7DaysTasks, previous30DaysTasks, olderTasks };
  };

  // Helper functions to check date ranges
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isWithinDays = (date, days) => {
    const today = new Date();
    return (today - date) / (1000 * 3600 * 24) <= days; // Compare in days
  };

  const { todayTasks, previous7DaysTasks, previous30DaysTasks, olderTasks } =
    groupTasks();

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

      {isLoading ? (
        <h1>Loading tasks...</h1>
      ) : tasks.length === 0 ? (
        <h1>No tasks, please add tasks.</h1>
      ) : (
        <div>
          {/* Today Tasks */}
          {todayTasks.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Today</h2>
              {todayTasks.map((task) => (
                <TaskListCard
                  key={task._id}
                  task={{ ...task, createdAt: formatDate(task.createdAt) }}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}

          {/* Previous 7 Days Tasks */}
          {previous7DaysTasks.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">
                Previous 7 Days
              </h2>
              {previous7DaysTasks.map((task) => (
                <TaskListCard
                  key={task._id}
                  task={{ ...task, createdAt: formatDate(task.createdAt) }}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}

          {/* Previous 30 Days Tasks */}
          {previous30DaysTasks.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">
                Previous 30 Days
              </h2>
              {previous30DaysTasks.map((task) => (
                <TaskListCard
                  key={task._id}
                  task={{ ...task, createdAt: formatDate(task.createdAt) }}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}

          {/* Older Tasks grouped by month */}
          {Object.keys(olderTasks).map((monthYear) => (
            <div key={monthYear}>
              <h2 className="text-xl font-semibold mt-6 mb-2">{monthYear}</h2>
              {olderTasks[monthYear].map((task) => (
                <TaskListCard
                  key={task._id}
                  task={{ ...task, createdAt: formatDate(task.createdAt) }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTask={addTask}
      />
    </div>
  );
};

export default HomeTasks;
