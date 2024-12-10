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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const eventModel = mongoose.models.event || mongoose.model("event", eventSchema);
export default eventModel;

