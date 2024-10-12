import connectDB from "@/config/database";

import { getSessionUser } from "@/utils/getSessionUser";
import Cproject from "@/models/Cproject";

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
    const { name, members, showTasks } = body;
    const cprojectData = {
      name: name,
      members: members,
      showTasks: showTasks,
      owner: userId,
    };
    console.log(members);
    const newCProject = new Cproject(cprojectData);
    await newCProject.save();
    console.log(cprojectData);
    return Response.redirect(`${process.env.NEXTAUTH_URL}/create-team`);
    // return new Response(
    //   JSON.stringify({ message: "Project created successfully" }),
    //   {
    //     status: 200,
    //   }
    // );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "failed to add data" }), {
      status: 500,
    });
  }
};
