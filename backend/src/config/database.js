import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8"]);

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}