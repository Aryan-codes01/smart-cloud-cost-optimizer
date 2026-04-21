import mongoose from "mongoose";

let databaseReady = false;

export async function connectDatabase(mongoUri) {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    databaseReady = true;
    console.log("MongoDB connected");
  } catch (error) {
    databaseReady = false;
    console.warn(
      "MongoDB unavailable. Falling back to in-memory demo store:",
      error.message
    );
  }
}

export function isDatabaseReady() {
  return databaseReady && mongoose.connection.readyState === 1;
}
