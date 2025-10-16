import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  try {
    // Debug: check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      throw new ApiError(500, "MONGODB_URI is not defined in .env");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // dbName option optional because URI already contains database
      // dbName: "ai_resume_builder",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw new ApiError(500, "Database connection failed", [], err.stack);
  }
};

export { connectDB };
