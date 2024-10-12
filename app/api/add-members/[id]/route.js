import connectDB from "@/config/database";
import Project from "@/models/Project";
import Cproject from "@/models/Cproject";

export const POST = async (req, { params }) => {
  try {
    await connectDB();

    const { id } = params;
    const { members } = await req.json();

    const project = await Cproject.findById(id);
    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    if (members.length > 0) {
      project.members.push(...members); // Append new members
      await project.save(); // Save the updated project
    }

    return new Response(
      JSON.stringify({ message: "Members added successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
