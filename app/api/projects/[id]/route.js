import connectDB from "@/config/database";

import { getSessionUser } from "@/utils/getSessionUser";
import Project from "@/models/Project";
import Cproject from "@/models/Cproject";

// GET /api/projects/id
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = params;

    const user = await getSessionUser(); // Fetch the logged-in user's info
    if (!user) {
      return new Response("Unauthorized", { status: 401 }); // Return unauthorized if no user is found
    }

    // Fetch the project by its ID to check the owner
    const project = await Cproject.findById(id); // Fetch the project by its ID
    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    let tasks;

    if (project.owner.toString() === user.userId || project.showTasks) {
      tasks = await Project.find({ projectId: id });
    } else {
      tasks = await Project.find({
        projectId: id,
        assignTo: user.email,
      });
    }

    if (!tasks || tasks.length === 0) {
      return new Response("No tasks found", { status: 404 });
    }

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
