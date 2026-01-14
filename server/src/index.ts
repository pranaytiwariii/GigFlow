import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/connect.js";
import authRouter from "./routes/authRoutes.js";
import gigRouter from "./routes/gigRoutes.js";
import bidRouter from "./routes/bidRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:8080"],
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/bids", bidRouter);

app.get("/api", (_req, res) => {
  res.json({ message: "Hello from TypeScript backend!" });
});

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    await connectDB(mongoUri);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

