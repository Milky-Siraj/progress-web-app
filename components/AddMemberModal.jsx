"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { fetchSingleCproject } from "@/utils/request";

const AddMemberModal = ({ closeModal, projectId, addMember, projectName }) => {
  const searchParams = useSearchParams();

  const [teamMembers, setTeamMembers] = useState([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const searchEmail = searchParams.get("searchTerm");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `/api/create-project/search?searchTerm=${searchEmail}`
        );
        if (response.status === 200) {
          const data = await response.json();
          const filteredData = data.filter(
            (newMember) =>
              !teamMembers.some((member) => member._id === newMember._id)
          );
          setTeamMembers((prevMembers) => [...prevMembers, ...filteredData]);
        } else {
          setTeamMembers([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (searchEmail) fetchSearchResults(); // Only fetch if searchEmail is not null
  }, [searchEmail]);

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm === "") {
      router.push("/create-team");
    } else {
      const query = `?searchTerm=${searchTerm}`;
      router.push(`/pages/team/${projectId}${query}`);
    }
  };

  const handleDelete = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamMemberEmails = teamMembers.map((member) => member.email);

    const fetchedProjectMembers = await fetchSingleCproject(projectId);
    const fetchedMembers = fetchedProjectMembers?.members || [];

    const newMembers = teamMemberEmails.filter(
      (email) => !fetchedMembers.includes(email)
    ); // Get emails not already in the project

    if (newMembers.length > 0) {
      const notifications = newMembers.map(async (member) => {
        const notification = {
          message: `${userEmail} added you to ${projectName} project`,
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
            toast.success(`Notification sent to ${member}`);
            console.log(`Notification sent to ${member}`);
          } else {
            toast.error(`Failed to send notification to ${member}`);
            console.log(`Failed to send notification to ${member}`);
          }
        } catch (error) {
          toast.error(`Failed to send notification to ${member} catch`);
          console.log(error);
        }
      });
      await Promise.all(notifications); // Ensure all notifications are sent
    } else {
      toast.error("Already a Member");
    }
    // Extract only emails for submission
    //const teamMemberEmails = teamMembers.map((member) => member.email);
    // try {
    // const fetchedProjectMembers = await fetchSingleCproject(projectId);
    // const fetchedMembers = fetchedProjectMembers?.members || [];

    // const newMembers = teamMemberEmails.filter(
    //   (email) => !fetchedMembers.includes(email)
    // ); // Get emails not already in the project

    // if (newMembers.length > 0) {
    //     // Proceed if there are new members to add
    //     const res = await fetch(`/api/add-members/${projectId}`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ members: newMembers }), // Send only new emails
    //     });

    //     if (res.ok) {
    //       const data = await res.json();
    //       addMember(newMembers);
    //       console.log("Members added successfully:", data);
    //       toast.success("Added successfully");
    //     } else {
    //       console.log("Failed to add members");
    //       toast.error("Failed to add members");
    //     }
    // } else {
    //   toast.error("Already a Member");
    // }
    // } catch (error) {
    //   console.error("Error adding members:", error);
    //   toast.error("An error occurred while adding members");
    // }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md mx-4 sm:w-2/3 lg:w-1/3">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <input
              type="text"
              name="searchTerm"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white"
              placeholder="Search for a member"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-400 shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSearch} // Don't trigger the form submission
              type="button"
            >
              <FaSearch />
            </button>
          </div>

          <ul className="w-2/3 mt-4">
            {teamMembers.map((member, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 bg-gray-800 px-4 py-2 rounded-lg"
              >
                <span>{member.username}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(index)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
