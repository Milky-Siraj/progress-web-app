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

export const DELETE = async (req, { params }) => {
  try {
    await connectDB();

    const { id } = params; // Get the project ID from params
    const { member } = await req.json(); // Get the member to delete from the request body

    const project = await Cproject.findById(id);
    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    // Remove the member from the members array
    console.log(`this is the member ${member}`);
    project.members = project.members.filter((m) => m !== member);
    await project.save(); // Save the updated project

    return new Response(
      JSON.stringify({ message: "Member removed successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
