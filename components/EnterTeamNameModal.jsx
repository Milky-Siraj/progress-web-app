"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

const EnterTeamNameModal = ({ closeModal, teamMembers, addProjectName }) => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [projectName, setProjectName] = useState({
    name: "",
    members: teamMembers,
  });
  const [showTasks, setShowTasks] = useState(false); // State for checkbox

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectName((prevName) => ({
      ...prevName,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setShowTasks((prev) => !prev); // Toggle checkbox state
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const res = await fetch("/api/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName.name, // Correctly passing project name
          showTasks: showTasks, // Include checkbox state in the request
        }),
      });

      if (res.ok) {
        const createdProject = await res.json(); // Parse the response to get the project details
        const projectId = createdProject.project._id; // Store the project ID

        addProjectName(projectName);

        if (teamMembers) {
          // Send a notification for each team member
          const notifications = projectName.members.map(async (member) => {
            const notification = {
              message: `${userEmail} added you to ${projectName.name} project`,
              recipientEmail: member,
              senderEmail: userEmail,
              requests: true,
              projectId, // Include projectId in the notification
            };

            try {
              const resNotification = await fetch("/api/notification", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(notification),
              });
              if (resNotification.ok) {
                console.log(`Notification sent to ${member}`);
              } else {
                console.log(`Failed to send notification to ${member}`);
              }
            } catch (error) {
              console.log(error);
            }
          });
          await Promise.all(notifications); // Ensure all notifications are sent
        }

        toast.success("Project created successfully");

        console.log(
          "Project created successfully with ID:",
          createdProject.project._id
        );
        closeModal(); // Close modal after successful save
      } else {
        toast.error("Failed to create Project. Please try again!");
        console.error("Failed to create project");
      }
    } catch (error) {
      toast.error("Failed to create Project. Please try again!");
      console.error("Error:", error);
    } finally {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Project Name</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            name="name"
            placeholder="Team Name"
            className="px-4 py-2 rounded-lg bg-gray-600 text-white w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={projectName.name}
            onChange={handleChange}
            required
          />
          <label className="flex items-center cursor-pointer pb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={showTasks}
              onChange={handleCheckboxChange}
            />
            <p className="text-gray-200 text-sm">
              Show All Tasks to Team Members
            </p>
          </label>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterTeamNameModal;
