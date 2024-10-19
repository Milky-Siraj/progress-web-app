import React from "react";
import { useState, useEffect } from "react";

import TaskListCard from "@/components/TaskListCard";
import { fetchFromGroupTasks, fetchTasks } from "@/utils/request";
import { useParams } from "next/navigation";

const FromGroupTask = ({ isSelected }) => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      const fetchedTasks = await fetchFromGroupTasks();
      const parsedTasks = fetchedTasks.map((task) => ({
        ...task,
        createdAt: new Date(task.timestamp),
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
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
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
                  isSelected={isSelected}
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
                  isSelected={isSelected}
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
                  isSelected={isSelected}
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
                  isSelected={isSelected}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FromGroupTask;
