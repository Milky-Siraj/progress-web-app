import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddMemberModal = ({ closeModal, projectId }) => {
  const searchParams = useSearchParams();

  const [teamMembers, setTeamMembers] = useState([]);

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
    // Extract only emails for submission
    const teamMemberEmails = teamMembers.map((member) => member.email);

    try {
      const res = await fetch(`/api/add-members/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ members: teamMemberEmails }), // Send only emails
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Members added successfully:", data);
        toast.success("Added successfully");
      } else {
        console.log("Failed to add members");
        toast.error("Failed to add members");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("An error occurred while adding members");
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-700 p-6 rounded-lg w-1/3">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-4 mb-4">
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
