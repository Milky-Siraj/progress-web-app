import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: false,
    },
    image: { type: String },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const User = models.User || model("User", UserSchema);
export default User;
