// /app/api/task/[id]/route.js
import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getSessionUser } from "@/utils/getSessionUser";

// to fetch single task from project page
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = params;

    const task = await Project.findById(id); // Fetch the task by its ID
    if (!task) {
      return new Response("Task not found", { status: 404 });
    }
    return new Response(JSON.stringify(task), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
export const PUT = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = params;
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;
    const formData = await request.formData();

    const existingTask = await Project.findById(id);
    if (!existingTask) {
      return new Response("Task does not exist.", { status: 404 });
    }
    if (existingTask.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const projectData = {
      assignTo: formData.get("assignTo"),
      task: formData.get("task"),
      status: formData.get("status"),
      dueDate: formData.get("dueDate"),
    };

    const updatedProject = await Project.findByIdAndUpdate(id, projectData);

    return new Response(JSON.stringify(updatedProject), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to add data" }), {
      status: 500,
    });
  }
};

export const PATCH = async (request, { params }) => {
  // Connect to the database
  await connectDB();

  const { id } = params; // Extract the task ID from the URL

  try {
    const { status } = await request.json();

    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
      });
    }

    // Find the task by ID and update the status
    const updatedTask = await Project.findByIdAndUpdate(
      id,
      { status }, // Update the status field
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Task updated successfully", updatedTask }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
