import connectDB from "@/config/database";

import { getSessionUser } from "@/utils/getSessionUser";
import Bug from "@/models/Bug";

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;
    const formData = await request.formData();
    const projectId = formData.get("projectId");
    const bugData = {
      description: formData.get("description"),
      logType: formData.get("logType"),
      loggedBy: formData.get("loggedBy"),
      status: formData.get("status"),
      dueDate: formData.get("dueDate"),
      loggedDate: formData.get("loggedDate"),
      projectId: projectId,
      owner: userId,
    };
    const newBug = new Bug(bugData);
    await newBug.save();
    console.log(bugData);
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/pages/bug/${projectId}`
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to add data" }), {
      status: 500,
    });
  }
};
//DELETE api/bug
export const DELETE = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;

    // Parse the request body to get the taskId
    const { bugId } = await request.json(); // Assuming taskId is passed in the body

    // Find and delete the bug
    const deletedBug = await Bug.findOneAndDelete({
      _id: bugId,
      owner: userId,
    });

    if (!deletedBug) {
      return new Response(
        "Task not found or you are not authorized to delete this task",
        { status: 404 }
      );
    }

    return new Response("Task deleted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
