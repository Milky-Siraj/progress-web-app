import connectDB from "@/config/database";

import { getSessionUser } from "@/utils/getSessionUser";
import Project from "@/models/Project";

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
    const projectData = {
      assignTo: formData.get("assignTo"),
      task: formData.get("task"),
      assignedBy: formData.get("assignedBy"),
      status: formData.get("status"),
      dueDate: formData.get("dueDate"),
      projectId: projectId,
      owner: userId,
    };
    const newProject = new Project(projectData);
    await newProject.save();
    console.log(projectData);
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/pages/team/${projectId}`
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to add data" }), {
      status: 500,
    });
  }
};
// DELETE /api/projects

export const DELETE = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;

    // Parse the request body to get the taskId
    const { taskId } = await request.json(); // Assuming taskId is passed in the body

    // Find and delete the task
    const deletedProject = await Project.findOneAndDelete({
      _id: taskId,
      owner: userId,
    });

    if (!deletedProject) {
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
