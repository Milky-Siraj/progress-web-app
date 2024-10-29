import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Cproject from "@/models/Cproject";

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
      owner: userId,
    });

    return new Response(JSON.stringify(cprojects), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
