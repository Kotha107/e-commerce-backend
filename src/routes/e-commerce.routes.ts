import { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  uploadImage,
  createProduct,
  allProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/admin.controller";
import {
  allCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller";
import {
  createOrGetCustomer,
  searchCustomer,
} from "../controllers/customer.controller";
import { createSale } from "../controllers/sale.controller";
const router = Router();

router.post("/upload", upload.single("image"), uploadImage);
router.post("/products", createProduct);
router.get("/products", allProducts);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);

//category
router.post("/categories", createCategory);
router.get("/categories", allCategories);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id", updateCategory);
router.get("/customer/search", searchCustomer);

//customer
router.post("/customer", createOrGetCustomer);

//sales
router.post("/sale", createSale);

export default router;
