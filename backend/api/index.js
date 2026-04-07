import "dotenv/config";
import { connectDB } from "../src/db.js";
import app from "../src/app.js";

export default async function handler(req, res) {
  await connectDB(process.env.MONGO_URI);
  app(req, res);
}
