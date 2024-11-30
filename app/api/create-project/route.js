import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Cproject from "@/models/Cproject";
import Project from "@/models/Project";
import Bug from "@/models/Bug";

export const dynamic = "force-dynamic";
// GET /api/create-project
export const GET = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId || !sessionUser.email) {
      return new Response("User Id and email are required", { status: 401 });
    }

    const { userId, email } = sessionUser;

    // Use MongoDB's $or operator to check both owner and if email is in members array
    const cprojects = await Cproject.find({
      $or: [
        { owner: userId }, // Match by owner ID
        { members: { $in: [email] } }, // Match if email is in members array
      ],
    });

    return new Response(JSON.stringify(cprojects), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;
    const body = await request.json();
    const { name, showTasks } = body;
    const cprojectData = {
      name: name,

      showTasks: showTasks,
      owner: userId,
    };

    const newCProject = new Cproject(cprojectData);
    await newCProject.save();
    console.log(cprojectData);
    return new Response(
      JSON.stringify({
        message: "Project created successfully",
        project: newCProject,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to add data" }), {
      status: 500,
    });
  }
};
export const DELETE = async (req) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    const { pId } = await req.json();
    const { userId } = sessionUser;

    // Delete the project owned by the user with the specified project ID
    const resDelete = await Cproject.findOneAndDelete({
      _id: pId,
      ownerId: userId,
    });

    // Delete all tasks associated with the project ID
    const resDeleteTask = await Project.deleteMany({
      projectId: pId,
    });

    // Delete all bugs associated with the project ID
    const resDeleteBug = await Bug.deleteMany({
      projectId: pId,
    });

    if (!resDelete) {
      return new Response("project not found or unauthorized", {
        status: 404,
      });
    }

    return new Response(
      "project and associated tasks and bugs deleted successfully",
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", {
      status: 500,
    });
  }
};
