import connectDB from "@/config/database";
import Cproject from "@/models/Cproject";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;

    const project = await Cproject.findById(id);

    return new Response(JSON.stringify(project), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "failed to fetch data" }), {
      status: 500,
    });
  }
};
