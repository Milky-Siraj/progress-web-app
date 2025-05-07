import connectDB from "@/config/database";
import User from "@/models/User";

export const dynamic = "force-dynamic";

//Get /api/create-team/searchUser

export const GET = async (request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm");

    if (!searchTerm) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const searchTermPattern = new RegExp(searchTerm, "i");

    let query = {
      $or: [
        { email: searchTermPattern },
        { username: searchTermPattern },
        { name: searchTermPattern }
      ]
    };

    const users = await User.find(query).select('name username email');
    console.log('Found users:', users); // Debug log

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
};
