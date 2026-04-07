import "dotenv/config";
import { connectDB } from "./db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
