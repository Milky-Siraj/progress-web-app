"use client";
import { fetchNotifications } from "@/utils/request";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const notifications = await fetchNotifications();
      setNotifications(notifications);
    };
    getNotifications();
  }, []);

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
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <Link
              key={notification._id} // Moved key to the Link component
              href={`/pages/team/${notification.projectId}`}
            >
              <li className="bg-gray-700 p-4 m-2 rounded-lg shadow-lg">
                <p>{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {formatDate(notification.timestamp)}
                </span>
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
