import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import verificationRoutes from "./routes/verificationRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("Hanas API Working 14/03/22 Soy Leb");
});

app.use("/api/auth", verificationRoutes);
app.use("/api/worker", workerRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${port}`)
);
