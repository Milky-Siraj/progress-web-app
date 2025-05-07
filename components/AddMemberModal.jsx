"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { fetchSingleCproject } from "@/utils/request";

const AddMemberModal = ({ closeModal, projectId, addMember, projectName }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for:', searchTerm.trim());
      const response = await fetch(
        `/api/create-project/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`
      );
      
      console.log('Search response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('Search results:', data);

      if (data.length === 0) {
        toast.info("No members found");
        setTeamMembers([]);
      } else {
        setTeamMembers(data);
        toast.success(`${data.length} member(s) found`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching for members");
      setTeamMembers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (index) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teamMembers.length === 0) {
      toast.error("Please add at least one member");
      return;
    }

    try {
      // Get current project members
      const fetchedProjectMembers = await fetchSingleCproject(projectId);
      const existingMembers = fetchedProjectMembers?.members || [];

      // Filter out members that are already in the project
      const newMemberEmails = teamMembers
        .map(member => member.email)
        .filter(email => !existingMembers.includes(email));

      if (newMemberEmails.length === 0) {
        toast.error("Selected members are already in the project");
        return;
      }

      // Add members to the project
      const res = await fetch(`/api/add-members/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ members: newMemberEmails }),
      });

      if (!res.ok) {
        throw new Error('Failed to add members to project');
      }

      // Send notifications
      const notificationPromises = newMemberEmails.map(async (email) => {
        const notification = {
          message: `${userEmail} added you to ${projectName} project`,
          recipientEmail: email,
          senderEmail: userEmail,
          requests: true,
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
          
          if (!resNotification.ok) {
            throw new Error(`Failed to send notification to ${email}`);
          }
        } catch (error) {
          console.error(`Error sending notification to ${email}:`, error);
          throw error;
        }
      });

      await Promise.all(notificationPromises);
      
      // Update parent component
      addMember(newMemberEmails);
      toast.success("Members added successfully");
      closeModal();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "An error occurred while adding members");
    }
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
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-400 shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              onClick={handleSearch}
              disabled={isSearching}
            >
              <FaSearch />
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="mt-4 max-h-60 overflow-y-auto">
            {teamMembers.length > 0 ? (
              <ul className="space-y-2 w-full">
                {teamMembers.map((member, index) => (
                  <li
                    key={member._id || index}
                    className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="text-white">
                        {member.name || member.username || 'Unknown'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {member.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-400 text-xl font-bold"
                      onClick={() => handleDelete(index)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">
                {isSearching ? "Searching..." : "No members selected"}
              </p>
            )}
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              disabled={teamMembers.length === 0}
            >
              Add Members
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
