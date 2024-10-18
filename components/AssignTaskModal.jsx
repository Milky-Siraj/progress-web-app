// AssignTaskModal.jsx
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
        const fetchedProjectName = await fetchSingleCproject(projectId); // Use projectId prop
        const name = fetchedProjectName?.name;
        setProjectName("hi");
        console.log(fetchedProjectName);
        //console.log(name);
      } catch (error) {
        console.log("error fetching project names", error);
      }
    };
    getProjectName();
  }, [projectId]);

  console.log(projectName);

  const [fields, setFields] = useState({
    assignTo: "",
    task: "",
    assignedBy: userEmail,
    status: "open",
    projectId: projectId, // Use the projectId passed as a prop
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
      if (resTask.status === 200) {
        toast.success("task added");
        //window.location.reload();
      } else {
        toast.error("failed to add task");
      }
    } catch (error) {
      console.log(error);
      toast.error("failed to add task");
    }

    // Notification
    const notification = {
      message: `${userEmail} assigned ${fields.task} to you.`,
      recipientEmail: fields.assignTo,
      senderEmail: userEmail,
      projectId,
    };

    try {
      const resNotification = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });
      if (resNotification === 200) {
        console.log("notification added");
      } else {
        console.log("something went wrong");
      }
    } catch (error) {
      console.log(error);
    }

    const fromGroupTask = {
      task: `${fields.task} `,
      projectName: projectName,
      userEmail: userEmail,
      projectId,
    };

    try {
      const resFromGroupTask = await fetch("/api/fromGroupTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromGroupTask),
      });
      if (resFromGroupTask === 201) {
        console.log("fromGroupTask added");
        toast.success("huryyyyyyy");
      } else {
        console.log("something went wrong");

        toast.error("gudddddddd");
      }
    } catch (error) {
      console.log(error);
      toast.error("catch error");
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-700 p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold text-white mb-4">Assign Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Assign To</label>
            <select
              id="assignTo"
              name="assignTo"
              className="border rounded w-full py-2 px-3 bg-gray-600 text-white"
              required
              value={fields.assignTo}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a member
              </option>{" "}
              {/* Placeholder */}
              {members.map((member) => (
                <option key={member._id} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white">Task</label>
            <input
              type="text"
              name="task"
              value={fields.task}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
            />
          </div>
          <div className="hidden mb-4">
            <label className="block text-white">Assigned By</label>
            <input
              type="text"
              name="assignedBy"
              value={fields.assignedBy}
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
          <div className="hidden mb-4">
            <label className="block text-white">project id</label>
            <input
              type="text"
              name="projectId"
              value={fields.projectId}
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
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
