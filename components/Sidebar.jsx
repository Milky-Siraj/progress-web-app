"use client";
import { useState } from "react";
import { FaTasks, FaUsers, FaPlus, FaUser, FaBell } from "react-icons/fa";
import Link from "next/link";

const Sidebar = () => {
  const [showGroups, setShowGroups] = useState(false);
  const [showGroupItems, setShowGroupItems] = useState(false);

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl font-bold p-10">Logo</h2>
        <ul>
          <li className="mb-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <FaTasks />
                <span>My Tasks</span>
              </div>
            </Link>
          </li>
          <li className="mb-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowGroups(!showGroups)}
            >
              <FaUsers />
              <span>Group Tasks</span>
            </div>
            {showGroups && (
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowGroupItems(!showGroupItems)}
                  >
                    <FaUsers />
                    <span>View Groups</span>
                  </div>
                </li>
                {showGroupItems && (
                  <ul className="ml-4 mt-2">
                    <li className="mb-2">
                      <Link href="/pages/team">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <FaUsers />
                          <span>Group 1</span>
                        </div>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>Group 2</span>
                      </div>
                    </li>
                  </ul>
                )}
              </ul>
            )}
          </li>
          <li className="mb-2">
            <Link href="/create-team">
              <div className="flex items-center gap-2 cursor-pointer">
                <FaPlus />
                <span>Create Team</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <ul>
          <li className="mb-2">
            <Link href="/pages/profile">
              <div className="flex  items-center  gap-2">
                <FaUser />
                <span>Profile</span>
              </div>
            </Link>
          </li>
          <li className="mb-2">
            <div className="flex  items-center  gap-2">
              <FaBell />
              <span>Notifications</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
