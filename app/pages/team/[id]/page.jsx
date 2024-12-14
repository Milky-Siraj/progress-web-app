// Project.jsx
"use client";
import { useState, useEffect } from "react";
import AssignTaskModal from "@/components/AssignTaskModal";
import Link from "next/link";
import { fetchProject, fetchSingleCproject } from "@/utils/request";
import { useParams } from "next/navigation";

import EditTaskModal from "@/components/EditTaskModal";
import { FaCheck, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import AddMemberModal from "@/components/AddMemberModal";

const Project = () => {
  const { id } = useParams(); // Get the project ID

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null); // To store task being edited
  const [members, setMembers] = useState([]);

  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const getProjects = async () => {
      const fetchedProjects = await fetchProject(id);
      setTasks(fetchedProjects);
    };

    getProjects();
  }, []);

  useEffect(() => {
    const getProjectMembers = async () => {
      try {
        const fetchedProjectMembers = await fetchSingleCproject(id);

        setMembers(fetchedProjectMembers?.members || []);
        setProjectName(fetchSingleMembers?.name || []);
      } catch (error) {
        console.error("Failed to fetch project members", error);
      }
    };

    getProjectMembers();
  }, [id]);

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirm) return;
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });
      if (res.status === 200) {
        const updatedTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(updatedTasks);

        alert("task deleted");
      }
    } catch (error) {
      alert("task want deleted");
      console.log(error);
    }
  };
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/task-project/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // If the status is successfully updated in the database, update the local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
        toast.success("Task status updated successfully");
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating task status");
    }
  };

  const isPastDue = (dueDate) => {
    const currentDate = new Date();
    return new Date(dueDate) < currentDate;
  };

  const handleDeleteMember = async (memberD) => {
    const confirm = window.confirm(
      `Are you sure you want to remove ${memberD}?`
    );

    if (!confirm) return;

    try {
      const res = await fetch(`/api/add-members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ member: memberD }),
      });

      if (res.ok) {
        const updatedMembers = members.filter((member) => member !== memberD);
        setMembers(updatedMembers);
        toast.success(`Member removed `);
      } else if (res.status === 403) {
        toast.error(`You're not the owner of the project`);
      } else if (res.status === 405) {
        toast.error("You can not remove the owner");
      } else {
        toast.error(`Couldn't remove Member. Please try again! `);
        console.error("delete not working");
      }
    } catch (error) {
      toast.error(`Couldn't remove Member. Please try again!`);
      console.log(error);
    }
  };

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  const addMember = (newMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };
  return (
    <div>
      <div className="flex-1 p-6 bg-gray-800 text-white min-h-screen">
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setIsModalOpen(true)}
          >
            Assign Task
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-4">Team Members</h1>

        <div className="flex  gap-4 mb-6 pb-4 overflow-x-auto whitespace-nowrap scrollbar-custom ">
          {members && members.length > 0 ? (
            members.map((member) => (
              <div
                key={member._id}
                className=" flex justify-between bg-gray-700 p-4 rounded-lg flex-1 text-center"
              >
                <p>
                  {member} {/* Display the name */}
                </p>
                <button
                  className="text-red-600 hover:text-red-500 ml-2 transition-colors duration-200 ease-in-out"
                  onClick={() => handleDeleteMember(member)} // Adjust based on your delete logic
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))
          ) : (
            <p>
              Please Add a Member
            </p> /* Fallback in case there are no members */
          )}
          <div className="text-white text-l px-4 py-0 rounded bg-gray-700 hover:bg-gray-400 flex item-center justify-center">
            <button onClick={() => setIsAddMemberModalOpen(true)}>+</button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                  Assign To
                </th>
                <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                  Task
                </th>
                <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                  Assigned By
                </th>
                <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                  Status
                </th>
                <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                  Due Date
                </th>
                <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className={`${
                    task.status === "closed"
                      ? "text-gray-800 relative"
                      : task.status === "inProgress"
                      ? "text-green-500"
                      : "text-gray-300"
                  }`}
                >
                  <td className="py-2 px-4 border border-gray-600">
                    {task.assignTo}
                  </td>
                  <td className="py-2 px-4 border border-gray-600">
                    {task.task}
                  </td>
                  <td className="py-2 px-4 border border-gray-600">
                    {task.assignedBy}
                  </td>
                  <td className="py-2 px-4 border border-gray-600">
                    <div className="relative">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="bg-transparent"
                      >
                        <option className="text-gray-900" value="open">
                          Open
                        </option>
                        <option className="text-gray-900" value="inProgress">
                          In Progress
                        </option>
                        <option className="text-gray-900" value="closed">
                          Closed
                        </option>
                      </select>
                    </div>
                  </td>
                  <td
                    className={`py-2 px-4 border border-gray-600 ${
                      isPastDue(task.dueDate) && task.status !== "closed"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {task.dueDate.split("T")[0]}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <button
                      onClick={() => openEditModal(task)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-gray-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-400 m-1"
                    >
                      Delete
                    </button>

                    <td className="pl-24">
                      {task.status === "closed" && (
                        <span className=" bottom-0 right-0 text-xs text-green-500">
                          <FaCheck className="inline mr-1" />
                          Complete
                        </span>
                      )}
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <AssignTaskModal
          closeModal={() => setIsModalOpen(false)}
          projectId={id}
          members={members}
          addTask={addTask}
        />
      )}

      <Link href={`/pages/bug/${id}`}>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 absolute bottom-4 right-4">
          Log Bugs
        </button>
      </Link>
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          closeModal={() => setIsEditModalOpen(false)}
          taskId={selectedTask._id}
        />
      )}
      {isAddMemberModalOpen && (
        <AddMemberModal
          closeModal={() => setIsAddMemberModalOpen(false)}
          projectId={id}
          addMember={addMember}
          projectName={projectName}
        />
      )}
    </div>
  );
};

export default Project;
