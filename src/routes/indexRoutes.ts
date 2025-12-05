import { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  uploadImage,
  createProduct,
  allProducts,
  deleteProduct,
} from "../controllers/admin.controller";
const router = Router();

router.post("/upload", upload.single("image"), uploadImage);
router.post("/products", createProduct);
router.get("/products", allProducts);
router.delete("/products/:id", deleteProduct);

export default router;
