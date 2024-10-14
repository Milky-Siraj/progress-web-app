import connectDB from "@/config/database";
import FromGroupTask from "@/models/FromGroupTask";
import { getSessionUser } from "@/utils/getSessionUser";

export const POST = async (req) => {
  try {
    await connectDB();
    const { task, projectName, userEmail, projectId } = await req.json();

    const newFromGroupTask = new FromGroupTask({
      task,
      projectName,
      userEmail,
      projectId,
    });

    await newFromGroupTask.save();

    return new Response(JSON.stringify(newFromGroupTask), { status: 201 });
  } catch (error) {
    console.error("Error creating fromGroupTask:", error);
    return new Response("Failed to create fromGroupTask", { status: 500 });
  }
};

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
