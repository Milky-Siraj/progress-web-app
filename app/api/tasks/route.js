import connectDB from "@/config/database";

import { getSessionUser } from "@/utils/getSessionUser";
import Task from "@/models/Task";

// GET /api/task
// export const GET = async (request) => {
//   try {
//     await connectDB();
//     const tasks = await Task.find({});
//     return new Response(JSON.stringify(tasks), {
//       status: 200,
//     });
//   } catch (error) {
//     console.log(error);
//     return new Response("something went wrong", { status: 500 });
//   }
// };
export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;
    const formData = await request.formData();

    const tasksData = {
      title: formData.get("title"),

      completed: false,
      owner: userId,
    };
    const newTask = new Task(tasksData);
    await newTask.save();
    console.log(tasksData);
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/pages/hometasks/${userId}`
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to add data" }), {
      status: 500,
    });
  }
};
// DELETE /api/task/:id

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
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      owner: userId,
    });

    if (!deletedTask) {
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
// PUT /api/tasks
export const PUT = async (request) => {
  try {
    await connectDB();
    const { taskId, isCompleted } = await request.json(); // Retrieve taskId and isCompleted from the request body

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return new Response("Task does not exist", { status: 404 });
    }
    if (existingTask.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Prepare task data with the updated 'completed' field
    const tasksData = {
      completed: isCompleted, // Dynamically set the 'completed' field based on the request
    };

    // Update the task in the database
    await Task.findByIdAndUpdate(taskId, tasksData);

    return new Response(
      JSON.stringify({ message: "Task updated successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to update task" }), {
      status: 500,
    });
  }
};
