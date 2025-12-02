import axios from "axios";
import FormData from "form-data";
import { db } from "../config/firebase";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/response.util";
import { ProductDetails } from "../models/product.model";
export async function uploadImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      const msg = "No file uploaded";
      return sendResponse(res, msg, false, StatusCodes.BAD_REQUEST);
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      const msg = "ImgBB API key not configured";
      return sendResponse(res, msg, false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    const form = new FormData();
    form.append("image", req.file.buffer.toString("base64"));

    const url = process.env.url || "";
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });

    const data = response.data;
    if (!data || !data.success) {
      const msg = "ImgBB upload failed";
      return sendResponse(
        res,
        msg,
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
        data
      );
    }

    // const imageUrl = data.data.url;
    // const deleteUrl = data.data.deleteUrl
    const msg = "Image uploaded successfully";
    return sendResponse(res, msg, true, StatusCodes.OK, data);
  } catch (err: any) {
    console.error(
      "ImgBB upload error:",
      err.response?.data || err.message || err
    );
    return res.status(500).json({
      error: "Upload failed",
      details: err.response?.data || err.message,
    });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, category, description, imageUrl } = req.body;
    if (!name || !price || !imageUrl) {
      const msg = "name, price, and imageUrl are required";
      return sendResponse(res, msg, false, StatusCodes.BAD_REQUEST);
    }

    const Product: ProductDetails = {
      name,
      price,
      category: category || "uncategorized",
      description: description || "",
      imageUrl: imageUrl || "",
      createdAt: new Date(),
    };

    const docRef = await db.collection("products").add({
      name,
      price,
      category: category || "uncategorized",
      description: description || "",
      imageUrl,
      createdAt: new Date(),
    });

    const saved = await docRef.get();
    return sendResponse(
      res,
      "Product created successfully",
      true,
      StatusCodes.OK,
      { id: docRef.id, ...saved.data() }
    );
  } catch (err) {
    return sendResponse(
      res,
      "Create product failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}

export async function allProducts(req: Request, res: Response) {
  try {
    const snap = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return sendResponse(res, "Success", true, StatusCodes.OK, products);
  } catch (err) {
    return sendResponse(
      res,
      "List Failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
