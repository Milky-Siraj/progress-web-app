import connectDB from "@/config/database";

import Bug from "@/models/Bug";

export const dynamic = "force-dynamic";
// GET /api/projects/id
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = params;

    const bugs = await Bug.find({ projectId: id });
    return new Response(JSON.stringify(bugs), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
