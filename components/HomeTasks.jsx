"use client";
import { useState, useEffect } from "react";
import TaskModal from "@/components/TaskModal";
import TaskListCard from "@/components/TaskListCard";
import { fetchTasks } from "@/utils/request";
import { useParams } from "next/navigation";
import FromGroupTask from "@/components/FromGroupTask";

const HomeTasks = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSelected, setIsSelected] = useState(true); // My Tasks = true, From Projects = false

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
    <div className="bg-gray-800 min-h-screen p-6 pt-20 text-white ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold tracking-wide">Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition-all duration-200 ease-in-out"
        >
          Add Task
        </button>
      </div>

      <div>
        <hr className="border-gray-700 my-6" />
        <div className="flex items-center justify-center bg-gray-900 rounded-lg shadow-lg divide-x divide-gray-700">
          <p
            onClick={() => setIsSelected(true)} // My Tasks view
            className={`p-4 w-1/2 text-center cursor-pointer transition-all duration-200 ease-in-out ${
              isSelected
                ? "bg-blue-600 text-white font-bold shadow-lg rounded-l-lg"
                : "bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            My Tasks
          </p>
          <p
            onClick={() => setIsSelected(false)} // From Projects view
            className={`p-4 w-1/2 text-center cursor-pointer transition-all duration-200 ease-in-out ${
              !isSelected
                ? "bg-blue-600 text-white font-bold shadow-lg rounded-r-lg"
                : "bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            From Projects
          </p>
        </div>
      </div>

      <div className="mt-6">
        {isSelected ? (
          isLoading ? (
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
                  <h2 className="text-xl font-semibold mt-6 mb-2">
                    {monthYear}
                  </h2>
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
          )
        ) : (
          // Display when 'From Projects' is selected
          <div>
            <FromGroupTask isSelected={isSelected} />
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTask={addTask}
      />
    </div>
  );
};

export default HomeTasks;
