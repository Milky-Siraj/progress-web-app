import mongoose, { Schema, model, models } from "mongoose";

const bugSchema = new Schema(
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
    description: {
      type: String,
      required: true,
    },
    logType: {
      type: String,
      required: true,
    },
    loggedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "inProgress", "closed"],
      default: "open",
    },
    loggedDate: {
      type: Date,
      required: true,
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

// Check if model exists before creating it to avoid OverwriteModelError
const Bug = models.Bug || mongoose.model("Bug", bugSchema);

export default Bug;
