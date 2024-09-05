// LogBugsPage.jsx
"use client";
import { useState } from "react";

import LogBugModal from "@/components/LogBugModal";

const LogBugsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bugs = [
    {
      id: 1,
      description: "Bug 1",
      logType: "UI",
      loggedBy: "User 1",
      loggedDate: "2024-09-05",
      status: "Open",
      dueDate: "2024-09-10",
    },
    // Add more bugs here
  ];

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
              <th className="py-2 px-4 border border-gray-600 bg-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bugs.map((bug) => (
              <tr key={bug.id}>
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
                  {bug.loggedDate}
                </td>
                <td className="py-2 px-4 border border-gray-600 ">
                  <select
                    defaultValue={bug.status}
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
                </td>
                <td className="py-2 px-4 border border-gray-600">
                  {bug.dueDate}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">
                  <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <LogBugModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LogBugsPage;
