import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";
import producRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", producRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
