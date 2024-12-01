"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { fetchSingleCproject } from "@/utils/request";

const AssignTaskModal = ({ closeModal, projectId, members }) => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const getProjectName = async () => {
      try {
        const fetchedProjectName = await fetchSingleCproject(projectId);
        setProjectName(fetchedProjectName?.name || "Unknown Project");
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };
    getProjectName();
  }, [projectId]);

  const [fields, setFields] = useState({
    assignTo: "",
    task: "",
    assignedBy: userEmail,
    status: "open",
    projectId,
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const resTask = await fetch(`/api/projects`, {
        method: "POST",
        body: formData,
      });
      resTask.status === 200
        ? toast.success("Task assigned successfully")
        : toast.error("Failed to assign task");

      // Notification logic
      const notification = {
        message: `${userEmail} assigned ${fields.task} to you.`,
        recipientEmail: fields.assignTo,
        senderEmail: userEmail,
        projectId,
      };
      await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });

      closeModal();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto z-50">
      <div className="bg-gray-700 p-6 sm:p-8 rounded-lg w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Assign Task
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Assign To</label>
            <select
              id="assignTo"
              name="assignTo"
              className="w-full border rounded-lg bg-gray-600 text-white py-2 px-3"
              value={fields.assignTo}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a member
              </option>
              {members.map((member) => (
                <option key={member._id} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Task</label>
            <input
              type="text"
              name="task"
              value={fields.task}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              placeholder="Enter task"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Status</label>
            <select
              name="status"
              value={fields.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            >
              <option value="open">Open</option>
              <option value="inProgress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={fields.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
