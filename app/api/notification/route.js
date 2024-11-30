import connectDB from "@/config/database";
import Notification from "@/models/Notification"; // Your Notification model
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    const { email } = sessionUser;
    // const email = searchParams.get("email");

    const notifications = await Notification.find({ recipientEmail: email })
      .sort({ timestamp: -1 }) // Latest first
      .exec();

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response("Failed to fetch notifications", { status: 500 });
  }
};
export const POST = async (req) => {
  try {
    await connectDB();
    const { message, recipientEmail, senderEmail, projectId, requests } =
      await req.json();

    const newNotification = new Notification({
      message,
      recipientEmail,
      senderEmail,
      requests,
      projectId,
    });

    await newNotification.save();

    return new Response(JSON.stringify(newNotification), { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return new Response("Failed to create notification", { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    const { notificationId, isRead, accept } = await req.json();
    const updateIsRead = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { $set: { isRead: isRead, accept: accept } },
      { new: true }
    );
    if (!updateIsRead) {
      return new Response("failed to update", { status: 404 });
    }
    return new Response("success", { status: 200 });
  } catch (error) {
    return new Response("something went wrong", { status: 500 });
  }
};
