import mongoose from "mongoose";
import { MONGODB_URI } from "../secrets.js";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
