import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    remainingSeats: {
      type: Number,
      required: true,
    },
    registeredUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        joinDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const eventModel = mongoose.models.event || mongoose.model("event", eventSchema);
export default eventModel;

