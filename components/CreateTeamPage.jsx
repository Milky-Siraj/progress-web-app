"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import EnterTeamNameModal from "@/components/EnterTeamNameModal";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const CreateProjectPage = () => {
  // const searchParams = useSearchParams();

  const [teamMembers, setTeamMembers] = useState([]);

  // const searchEmail = searchParams.get("searchTerm");

  // useEffect(() => {
  //   const fetchSearchResults = async () => {
  //     try {
  //       const res = await fetch(
  //         `/api/create-project/search?searchTerm=${searchEmail}`
  //       );
  //       if (res.status === 200) {
  //         const data = await res.json();
  //         const filteredData = data.filter(
  //           (newMember) =>
  //             !teamMembers.some((member) => member._id === newMember._id)
  //         );
  //         setTeamMembers((prevMembers) => [...prevMembers, ...filteredData]);
  //       } else {
  //         setTeamMembers([]);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchSearchResults();
  // }, [searchEmail]);

  // const [searchTerm, setSearchTerm] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const router = useRouter();

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchTerm === "") {
  //     router.push("/create-team");
  //   } else {
  //     const query = `?searchTerm=${searchTerm}`;
  //     router.push(`/create-team${query}`);
  //   }
  // };

  // const handleDelete = (index) => {
  //   const updatedMembers = [...teamMembers];
  //   updatedMembers.splice(index, 1);
  //   setTeamMembers(updatedMembers);
  // };

  // const handleDone = () => {
  //   setIsModalOpen(true); // Open the modal when "Done" is clicked
  // };

  const teamMemberEmails = teamMembers.map((member) => member.email);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-3xl pb-10 font-bold">Add Members</h1>
      <div className="flex flex-row justify-center items-center mb-8 gap-4 w-2/3">
        <form
          //onSubmit={handleSearch}
          className="flex gap-4 items-center w-full"
        >
          <input
            type="text"
            id="searchTerm"
            placeholder="Search for a member by email address..."
            className="px-4 py-3 rounded-lg bg-gray-700 text-white w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            //value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            // onClick={handleSearch}
            className="px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-400 shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaSearch />
            Search
          </button>
        </form>
      </div>

      <ul className="w-2/3 mt-4">
        {teamMembers.map((member, index) => (
          <li
            key={index}
            className="flex justify-between items-center mb-2 bg-gray-700 px-4 py-2 rounded-lg"
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

      <button
        // onClick={handleDone}
        className="mt-8 px-5 py-3 rounded-lg bg-green-500 text-white hover:bg-green-400 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Create Project
      </button>

      {/* {isModalOpen && (
        <EnterTeamNameModal
          closeModal={() => setIsModalOpen(false)}
          teamMembers={teamMemberEmails}
        />
      )} */}
    </div>
  );
};

export default CreateProjectPage;
