"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchSingleBug } from "@/utils/request";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  useEffect(() => {
    setMounted(true);
    const fetchBugData = async () => {
      try {
        const fetchedData = await fetchSingleBug(bugId);
        const formattedDate = fetchedData.dueDate.split("T")[0]; // Format ISO date
        fetchedData.dueDate = formattedDate;
        setFields(fetchedData);
      } catch (error) {
        console.error("Error fetching bug:", error);
      }
    };
    fetchBugData();
  }, [bugId]);

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
        toast.success("Bug updated successfully!");
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Permission Denied");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    mounted && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-xl mx-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Edit Bug
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white text-sm sm:text-base">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={fields.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm sm:text-base">
                Log Type
              </label>
              <input
                type="text"
                name="logType"
                value={fields.logType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm sm:text-base">
                Status
              </label>
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
              <label className="block text-white text-sm sm:text-base">
                Due Date
              </label>
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
