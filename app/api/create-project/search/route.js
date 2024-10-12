import connectDB from "@/config/database";
import User from "@/models/User";

//Get /api/create-team/searchUser

export const GET = async (request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm");

    const searchTermPattern = new RegExp(searchTerm, "i");

    let query = {
      $or: [{ name: searchTermPattern, email: searchTermPattern }],
    };
    const user = await User.find(query);
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong ", {
      status: 500,
    });
  }
};
