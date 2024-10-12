// EditBugModal.jsx
"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchSingleBug, fetchSingleProject } from "@/utils/request";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const EditBugModal = ({ closeModal, bugId }) => {
  const { id } = useParams();

  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const userName = session?.user?.name;

  const [fields, setFields] = useState({
    description: "",
    logType: "",

    status: "open",
    dueDate: "",
  });

  //const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
    console.log(bugId);
  };
  useEffect(() => {
    setMounted(true);
    const fetchTaskData = async () => {
      try {
        const fetchedData = await fetchSingleBug(bugId);
        const isoDate = fetchedData.dueDate; // Your date in ISO format
        const formattedDate = isoDate.split("T")[0];
        fetchedData.dueDate = formattedDate;
        setFields(fetchedData);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTaskData();
  }, [bugId, userName]);
  console.log("bugId:", bugId);
  console.log("Project id from params:", id);
  console.log("Navigating to:", `/pages/team/${id}`);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      const res = await fetch(`/api/bug-project/${bugId}`, {
        method: "PUT",
        body: formData,
      });
      if (res.status === 200) {
        closeModal();
        window.location.reload();
        toast.success("Updated!");
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Permission Denied");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    mounted && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-700 p-6 rounded-lg w-1/3">
          <h2 className="text-2xl font-bold text-white mb-4">Edit</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">Description</label>
              <input
                type="text"
                name="description"
                value={fields.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white">Log Type</label>
              <input
                type="text"
                name="logType"
                value={fields.logType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              />
            </div>
            <div className="hidden mb-4">
              <label className="block text-white">Logged By</label>
              <input
                type="text"
                name="assignedBy"
                value={fields.loggedBy}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white"> Status </label>
              <select
                name="status"
                value={fields.status}
                onChange={handleChange}
                className="bg-transparent"
              >
                <option className="text-gray-900 " value="open">
                  Open
                </option>
                <option className="text-gray-900 " value="inProgress">
                  In Progress
                </option>
                <option className="text-gray-900 " value="closed">
                  Closed
                </option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={fields.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditBugModal;
