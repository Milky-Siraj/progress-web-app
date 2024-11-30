// /app/api/task/[id]/route.js
import connectDB from "@/config/database";
import Bug from "@/models/Bug";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";
// to fetch single task from bug page
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = params;

    const task = await Bug.findById(id); // Fetch the task by its ID
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

    const existingTask = await Bug.findById(id);
    if (!existingTask) {
      return new Response("Task does not exist.", { status: 404 });
    }
    if (existingTask.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const bugData = {
      description: formData.get("description"),
      logType: formData.get("logType"),
      status: formData.get("status"),
      dueDate: formData.get("dueDate"),
    };

    const updatedBug = await Bug.findByIdAndUpdate(id, bugData);

    return new Response(JSON.stringify(updatedBug), {
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
  await connectDB();
  const { id } = params;

  try {
    const { status } = await request.json();
    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
      });
    }
    const updatedStatus = await Bug.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedStatus) {
      return new Response(JSON.stringify({ error: "Bug not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Bug updated successfully", updatedStatus }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to update data" }), {
      status: 500,
    });
  }
};
