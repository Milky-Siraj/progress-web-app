// TeamPage.jsx
"use client";
import { useState } from "react";

import AssignTaskModal from "@/components/AssignTaskModal";
import Link from "next/link";

const TeamPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers = [
    { id: 1, name: "Member 1" },
    { id: 2, name: "Member 2" },
    { id: 3, name: "Member 3" },
  ];

  const tasks = [
    {
      id: 1,
      assignTo: "Member 1",
      task: "Task 1",
      assignedBy: "Admin",
      status: "Pending",
      dueDate: "2024-09-10",
    },
    {
      id: 2,
      assignTo: "Member 2",
      task: "Task 2",
      assignedBy: "Admin",
      status: "Completed",
      dueDate: "2024-09-12",
    },
    // Add more tasks here
  ];

  return (
    <div>
      <div className="flex-1 p-6 bg-gray-800 text-white min-h-screen">
        <div className="flex justify-end mb-4">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setIsModalOpen(true)}
          >
            Assign Task
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-4">Team Members</h1>
        <div className="flex gap-4 mb-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-700 p-4 rounded-lg flex-1 text-center"
            >
              <p>{member.name}</p>
            </div>
          ))}
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
                <tr key={task.id}>
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
                    <select
                      defaultValue={task.status}
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
                  </td>
                  <td className="py-2 px-4 border border-gray-600">
                    {task.dueDate}
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
      </div>
      {isModalOpen && (
        <AssignTaskModal closeModal={() => setIsModalOpen(false)} />
      )}
      <Link href="/pages/bug">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 absolute bottom-4 right-4"
          onClick={() => console.log("Log Bugs clicked")}
        >
          Log Bugs
        </button>
      </Link>
    </div>
  );
};

export default TeamPage;
