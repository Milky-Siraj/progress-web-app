import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  senderEmail: {
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
  isRead: {
    type: Boolean,
    default: false,
    required: true,
  },
  accept: {
    type: Boolean,
    default: false,
    required: true,
  },
  requests: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
