// LogBugsPage.jsx
"use client";
import { useState, useEffect } from "react";
import { fetchBug } from "@/utils/request";
import LogBugModal from "@/components/LogBugModal";
import { useParams } from "next/navigation";
import EditBugModal from "@/components/EditBugModal";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";

const LogBugsPage = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bugs, setBugs] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const getBug = async () => {
      const fetchedBugs = await fetchBug(id);
      setBugs(fetchedBugs);
    };
    getBug();
  }, []);

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = async (bugId, newStatus) => {
    try {
      const res = await fetch(`/api/bug-project/${bugId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBugs((prevBugs) =>
          prevBugs.map((bug) =>
            bug._id === bugId ? { ...bug, status: newStatus } : bug
          )
        );
        toast.success("Task status updated successfully");
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating Bug status");
    }
  };

  const handleDelete = async (bugId) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;
    try {
      const res = await fetch("/api/bug", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bugId }),
      });
      if (res.status === 200) {
        const updatedBugs = bugs.filter((bug) => bug._id !== bugId);
        setBugs(updatedBugs);
        alert("Bug deleted");
      }
    } catch (error) {
      console.log(error);
      alert("Bug want deleted");
    }
  };

  const addBug = (newBug) => {
    setBugs((prevBugs) => [...prevBugs, newBug]);
  };
  return (
    <div className="flex-1 p-6 bg-gray-800 text-white min-h-screen">
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          onClick={() => setIsModalOpen(true)}
        >
          log
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Log Bugs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Description
              </th>
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Log Type
              </th>
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Logged By
              </th>
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Logged Date
              </th>
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Status
              </th>
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Due Date
              </th>
              {/* <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Estimated Time
              </th> */}
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bugs.map((bug) => (
              <tr
                key={bug.id}
                className={`${
                  bug.status === "closed"
                    ? "text-gray-800 relative"
                    : bug.status === "inProgress"
                    ? "text-green-500"
                    : "text-gray-300"
                }`}
              >
                <td className="py-2 px-4 border border-gray-600">
                  {bug.description}
                </td>
                <td className="py-2 px-4 border border-gray-600">
                  {bug.logType}
                </td>
                <td className="py-2 px-4 border border-gray-600">
                  {bug.loggedBy}
                </td>
                <td className="py-2 px-4 border border-gray-600">
                  {bug.loggedDate.split("T")[0]}
                </td>
                <td className="py-2 px-4 border border-gray-600 ">
                  <div className="relative">
                    <select
                      Value={bug.status}
                      onChange={(e) =>
                        handleStatusChange(bug._id, e.target.value)
                      }
                      className="bg-transparent text-black-100"
                    >
                      <option className="text-gray-900 " value="open">
                        Open
                      </option>
                      <option className="text-gray-900 " value="inProgress">
                        In Progress
                      </option>
                      <option className="text-gray-900" value="closed">
                        Closed
                      </option>
                    </select>
                  </div>
                </td>
                <td className="py-2 px-4 border border-gray-600">
                  {bug.dueDate.split("T")[0]}
                </td>
                {/* <td className="py-2 px-4 border border-gray-600">
                  {bug.estimatedTime}
                </td> */}
                <td className="py-2 px-4 border-b border-gray-600">
                  <button
                    onClick={() => openEditModal(bug)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-gray-400 mb-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(bug._id);
                    }}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-400"
                  >
                    Delete
                  </button>
                  <td className="pl-15">
                    {bug.status === "closed" && (
                      <span className=" bottom-0 right-0 text-xs text-green-500">
                        <FaCheck className="inline mr-1" />
                        Fixed
                      </span>
                    )}
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <LogBugModal closeModal={() => setIsModalOpen(false)} addBug={addBug} />
      )}
      {isEditModalOpen && selectedTask && (
        <EditBugModal
          task={selectedTask}
          closeModal={() => setIsEditModalOpen(false)}
          bugId={selectedTask._id}
        />
      )}
    </div>
  );
};

export default LogBugsPage;
