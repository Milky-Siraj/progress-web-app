import mongoose from "mongoose";

const FromGroupTaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cproject", // Assuming Cproject model exists
  },
});

const FromGroupTask =
  mongoose.models.FromGroupTask ||
  mongoose.model("FromGroupTask", FromGroupTaskSchema);

export default FromGroupTask;
