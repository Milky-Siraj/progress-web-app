import connectDB from "@/config/database";

import { getSessionUser } from "@/utils/getSessionUser";
import Task from "@/models/Task";

// GET /api/task/:id
export const GET = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser; // Assuming the sessionUser contains the user ID

    const tasks = await Task.find({ owner: userId });

    if (!tasks) {
      return new Response("No tasks found for this user", { status: 404 });
    }

    return new Response(JSON.stringify(tasks), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
