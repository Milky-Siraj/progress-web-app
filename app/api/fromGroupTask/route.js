import connectDB from "@/config/database";
import FromGroupTask from "@/models/FromGroupTask";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async () => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    const { email } = sessionUser;
    // const email = searchParams.get("email");

    const fromGroupTasks = await FromGroupTask.find({ userEmail: email })
      .sort({ timestamp: -1 }) // Latest first
      .exec();

    return new Response(JSON.stringify(fromGroupTasks), { status: 200 });
  } catch (error) {
    console.error("Error fetching fromGroupTasks:", error);
    return new Response("Failed to fetch fromGroupTasks", { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    await connectDB();
    const { title, projectName, userEmail, projectId } = await req.json();

    const newFromGroupTask = new FromGroupTask({
      title,
      projectName,
      userEmail,
      projectId,
    });
    console.log(newFromGroupTask);
    await newFromGroupTask.save();

    return new Response(JSON.stringify(newFromGroupTask), { status: 201 });
  } catch (error) {
    console.error("Error creating fromGroupTask:", error);
    return new Response("Failed to create fromGroupTask", { status: 500 });
  }
};

export const DELETE = async (request) => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { email } = sessionUser;
    const { taskId } = await request.json();

    const deleteFromGroupTask = await FromGroupTask.findOneAndDelete({
      _id: taskId,
      userEmail: email,
    });

    if (!deleteFromGroupTask) {
      return new Response("task not found or not authorized", { status: 404 });
    }
    return new Response("task deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
export const PUT = async (request) => {
  try {
    const sessionUser = await getSessionUser();
    // if (!sessionUser || sessionUser.userId) {
    //   return new Response("userId is required ", { status: 401 });
    // }
    const { taskId, isComplete } = await request.json();
    const update = await FromGroupTask.findOneAndUpdate(
      { _id: taskId }, // Query filter to find the document by taskId
      { $set: { completed: isComplete } }, // The fields to update
      { new: true }
    );

    if (!update) {
      return new Response("failed to update the complete field", {
        status: 404,
      });
    }
    return new Response("updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", {
      status: 500,
    });
  }
};
