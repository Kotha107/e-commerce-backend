import { Router  } from "express";
import { upload } from "../middlewares/multer";
import { uploadImage } from "../controllers/uploadController";

const router = Router();

router.post("/upload",upload.single("image"), uploadImage);

export default router;

