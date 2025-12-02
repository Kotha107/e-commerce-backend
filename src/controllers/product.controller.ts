import { Request, response, Response } from "express";
import { db } from "../config/firebase";
import { sendResponse } from "../utils/response.util";
import { StatusCodes } from "http-status-codes";

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, category, description, imageUrl } = req.body;
    if (!name || !price || !imageUrl) {
      const msg = "name, price, and imageUrl are required";
      return sendResponse(res, msg, false, StatusCodes.BAD_REQUEST);
    }

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

export async function listProducts(req: Request, res: Response) {
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
