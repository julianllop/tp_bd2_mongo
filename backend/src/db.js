import mongoose from "mongoose";

// Cache connection across serverless invocations
let cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB(uri) {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
