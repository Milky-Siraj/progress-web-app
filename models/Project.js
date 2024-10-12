import mongoose, { Schema, model, models } from "mongoose";

const projectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: String,
      ref: "Cproject",
    },
    assignTo: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    assignedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "inProgress", "closed"],
      default: "open",
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = models.Project || mongoose.model("Project", projectSchema);

export default Project;
