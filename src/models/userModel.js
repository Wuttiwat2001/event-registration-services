import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
