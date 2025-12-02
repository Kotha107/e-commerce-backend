import { Router } from "express";
import { createProduct, listProducts } from "../controllers/product.controller";

const router = Router();

router.post("/products", createProduct);
router.get("/products", listProducts);

export default router;
