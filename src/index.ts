import dotenv from "dotenv";
import express from "express";
import indexRoutes from "./routes/indexRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", indexRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
