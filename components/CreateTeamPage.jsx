"use client";
import { useState, useEffect, Suspense } from "react";
import { FaSearch } from "react-icons/fa";
import EnterTeamNameModal from "@/components/EnterTeamNameModal";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const CreateProjectPage = () => {
  const searchParams = useSearchParams();
  const [teamMembers, setTeamMembers] = useState([]);
  const searchEmail = searchParams.get("searchTerm");
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `/api/create-project/search?searchTerm=${searchEmail}`
        );
        if (res.status === 200) {
          const data = await res.json();
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
    fetchSearchResults();
  }, [searchEmail]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm === "") {
      router.push("/create-team");
    } else {
      const query = `?searchTerm=${searchTerm}`;
      router.push(`/create-team${query}`);
    }
  };
  const handleDelete = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };
  const handleDone = () => {
    setIsModalOpen(true); // Open the modal when "Done" is clicked
  };
  const teamMemberEmails = teamMembers.map((member) => member.email);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
        <h1 className="text-3xl pb-10 font-bold">Add Members</h1>
        <div className="flex flex-row justify-center items-center mb-8 gap-4 w-2/3">
          <form
            onSubmit={handleSearch}
            className="flex gap-4 items-center w-full"
          >
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members by email"
              className="p-2 rounded-md"
            />
            <button
              type="submit"
              className="flex items-center bg-blue-500 p-2 rounded-md"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        <div className="w-2/3 bg-gray-700 p-4 rounded-md">
          {teamMembers.length > 0 ? (
            <ul>
              {teamMembers.map((member, index) => (
                <li key={member._id} className="flex justify-between mb-2">
                  <span>{member.email}</span>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No members found</p>
          )}
        </div>
        <button
          onClick={handleDone}
          className="mt-6 bg-green-500 p-2 rounded-md"
        >
          Done
        </button>
      </div>
      {isModalOpen && <EnterTeamNameModal />}
    </Suspense>
  );
};

export default CreateProjectPage;
