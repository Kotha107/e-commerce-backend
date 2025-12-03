import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import indexRoutes from "./routes/indexRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", indexRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
