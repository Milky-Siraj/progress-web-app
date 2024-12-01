"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const LogBugModal = ({ closeModal }) => {
  const { data: session } = useSession();
  const name = session?.user?.name;
  const { id } = useParams();
  const [bug, setBug] = useState({
    projectId: id,
    description: "",
    logType: "",
    loggedBy: name,
    loggedDate: new Date().toISOString().split("T")[0],
    status: "open",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBug((prevBugs) => ({
      ...prevBugs,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-700 p-6 rounded-lg w-full max-w-lg mx-4 sm:mx-6 md:w-2/3 lg:w-1/3">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Log Bug
        </h2>
        <form action="/api/bug" method="POST">
          {/* Hidden Project ID */}
          <input type="hidden" name="projectId" value={bug.projectId} />

          <div className="mb-4">
            <label className="block text-white">Description</label>
            <input
              type="text"
              name="description"
              value={bug.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              placeholder="Enter bug description"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white">Log Type</label>
            <input
              type="text"
              name="logType"
              value={bug.logType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
              placeholder="Enter log type"
            />
          </div>

          {/* Hidden Logged By */}
          <input type="hidden" name="loggedBy" value={bug.loggedBy} />

          <div className="mb-4">
            <label className="block text-white">Status</label>
            <select
              name="status"
              value={bug.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
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

          <div className="mb-4">
            <label className="block text-white">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={bug.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>

          {/* Hidden Logged Date */}
          <input type="hidden" name="loggedDate" value={bug.loggedDate} />

          <div className="flex justify-end space-x-2">
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
              Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogBugModal;
