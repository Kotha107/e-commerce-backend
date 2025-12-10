import axios from "axios";
import FormData from "form-data";
import { db } from "../config/firebase";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/response.util";
import { ProductDetailsModel } from "../models/product.model";
export async function uploadImage(req: Request, res: Response) {
  const { categoryId } = req?.body;
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
    const response = await axios.post(url, form);

    const data = response?.data;
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

    const imageUrl = data?.data?.url;
    const deleteUrl = data?.data?.deleteUrl;
    const msg = "Image uploaded successfully";
    return sendResponse(res, msg, true, StatusCodes.OK, {
      categoryId,
      deleteUrl,
      imageUrl,
    });
  } catch (err) {
    return sendResponse(
      res,
      "Upload failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, categoryName, description, imageUrl } = req.body;
    if (!name || !price || !imageUrl) {
      const msg = "name, price, and imageUrl are required";
      return sendResponse(res, msg, false, StatusCodes.BAD_REQUEST);
    }

    const categorySnap = await db
      .collection("categories")
      .where("name", "==", categoryName)
      .limit(1)
      .get();
    console.log(
      "Category snapshot:",
      categorySnap.empty ? "No category found" : "Category exists"
    );

    let categoryId = "";

    if (!categorySnap.empty) {
      categoryId = categorySnap.docs[0].id;
    } else {
      const newCategoryRef = await db.collection("categories").add({
        name: categoryName,
      });
      categoryId = newCategoryRef?.id;
    }

    const product: ProductDetailsModel = {
      name,
      price,
      categoryId: categoryId,
      description: description || "",
      imageUrl: imageUrl || "",
      createdAt: new Date(),
    };

    const docRef = await db.collection("products").add(product);
    const savedSnap = await docRef.get();
    const savedData = savedSnap.exists ? savedSnap.data() : null;

    const responsePayload = {
      id: docRef?.id,
      ...(savedData || {}),
    };

    return sendResponse(
      res,
      "Product created successfully",
      true,
      StatusCodes.OK,
      responsePayload
    );
  } catch (err) {
    return sendResponse(
      res,
      "Product creation failed",
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
    const products = snap.docs.map((d) => {
      const data = d?.data();
      let createdAt: any = data?.createdAt ?? null;

      // Convert Firestore Timestamp (or Date) to ISO string for safe JSON transport
      if (createdAt && typeof (createdAt as any).toDate === "function") {
        createdAt = (createdAt as any).toDate().toISOString();
      } else if (createdAt instanceof Date) {
        createdAt = createdAt.toISOString();
      }

      return { id: d.id, ...data, createdAt };
    });

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

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req?.params;
    if (!id) {
      const msg = "Product Id is required";
      return sendResponse(res, msg, false, StatusCodes.BAD_REQUEST);
    }
    await db.collection("products").doc(id).delete();
    return sendResponse(
      res,
      "Product deleted Successfully",
      true,
      StatusCodes.OK
    );
  } catch (err) {
    return sendResponse(
      res,
      "Something went wrong",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
