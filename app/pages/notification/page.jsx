"use client";
import { fetchNotifications, fetchSingleCproject } from "@/utils/request";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { data: session } = useSession();
  const email = session?.user?.email;
  useEffect(() => {
    const getNotifications = async () => {
      const notifications = await fetchNotifications();
      setNotifications(notifications);
    };
    getNotifications();
  }, []);
  const handleNotificationClick = async (notificationId) => {
    // Example: Mark notification as read
    try {
      const updateIsRead = await fetch(`/api/notification`, {
        method: "PUT",
        body: JSON.stringify({
          notificationId,
          isRead: true,
        }),
      });
      if (updateIsRead.ok) {
        console.log("read");
      } else {
        console.log("weyyyyy");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = async (projectId, notificationId) => {
    try {
      // Fetch existing project members
      const fetchedProjectMembers = await fetchSingleCproject(projectId);
      const fetchedMembers = fetchedProjectMembers?.members || [];

      // Ensure `email` is an array
      const membersToAdd = Array.isArray(email) ? email : [email];

      // Filter out emails that are already in fetchedMembers
      const newMembers = membersToAdd.filter(
        (email) => !fetchedMembers.includes(email)
      );

      // Check if there are any new members to add
      if (newMembers.length > 0) {
        const res = await fetch(`/api/add-members/${projectId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ members: newMembers }), // Send only new members
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Members added successfully:", data);
          toast.success("Added successfully");
        } else {
          console.log("Failed to add members");
          toast.error("Failed to add members");
        }
      } else {
        toast.error("Already a member");
      }

      const resUpdate = await fetch("/api/notification", {
        method: "PUT",
        body: JSON.stringify({ notificationId, accept: true }),
      });
      if (resUpdate.ok) {
        toast.success("updated accept");
      } else {
        toast.error("failed to update");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("An error occurred while adding members");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      weekday: "short", // e.g., "Tue"
      year: "numeric", // e.g., "2024"
      month: "short", // e.g., "Oct"
      day: "numeric", // e.g., "8"
      hour: "numeric", // e.g., "2 PM"
      minute: "numeric", // e.g., "08:58"
      hour12: true, // 12-hour format
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mt-11 ml-5 mb-4">Notifications</h1>
      {notifications.length > 0 ? (
        <ul className="">
          {notifications.map((notification) => (
            <Link
              key={notification._id} // Moved key to the Link component
              href={
                notification.projectId
                  ? `/pages/team/${notification.projectId}`
                  : `/pages/notification`
              }
              onClick={() => handleNotificationClick(notification._id)}
            >
              <li className=" bg-gray-700 p-4 m-2 rounded-lg shadow-lg">
                <p>{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {formatDate(notification.timestamp)}
                </span>
                {!notification.isRead && (
                  <span className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></span>
                )}
                {notification.requests && !notification.accept && (
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAccept(notification.projectId, notification._id);
                      }}
                    >
                      Accept
                    </button>
                  </div>
                )}
                {notification.accept && (
                  <div className="flex items-center justify-end text-green-600 font-semibold mt-4 space-x-2">
                    <FaCheck className="text-xl" />
                    <p>Accepted</p>
                  </div>
                )}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationPage;
