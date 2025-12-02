
import { Router } from "express";
import { upload } from "../middlewares/multer";
import { uploadImage, createProduct,allProducts } from "../controllers/admin.controller";
const router = Router();

router.post("/upload",upload.single("image"),uploadImage);
router.post("/products",createProduct);
router.get("/products",allProducts)

export default router