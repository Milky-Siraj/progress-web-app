import { Schema, model, models } from "mongoose";

const CprojectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
      },
    ],
    showTasks: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Cproject = models.Cproject || model("Cproject", CprojectSchema);

export default Cproject;
