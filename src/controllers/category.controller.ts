import { Request, Response } from "express";
import { db } from "../config/firebase";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/response.util";

export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return sendResponse(
        res,
        "Category name is required",
        false,
        StatusCodes.BAD_REQUEST
      );
    }

    const nameTrim = name.trim();

    const snap = await db
      .collection("categories")
      .where("name", "==", nameTrim)
      .limit(1)
      .get();
    if (!snap.empty) {
      const existing = snap.docs[0];
      return sendResponse(
        res,
        "Category already exists",
        true,
        StatusCodes.OK,
        { id: existing.id, ...existing.data() }
      );
    }

    const newRef = await db.collection("categories").add({
      name: nameTrim,
      createdAt: new Date(),
    });

    const newSnap = await newRef.get();
    return sendResponse(res, "Category created", true, StatusCodes.CREATED, {
      id: newRef.id,
      ...(newSnap.data() || {}),
    });
  } catch (err) {
    return sendResponse(
      res,
      "Create category failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}

export async function allCategories(req: Request, res: Response) {
  try {
    const snap = await db
      .collection("categories")
      .orderBy("createdAt", "desc")
      .get();
    const categories = snap.docs.map((data) => ({
      id: data.id,
      ...(data.data() || {}),
    }));
    return sendResponse(res, "Success", true, StatusCodes.OK, categories);
  } catch (err) {
    return sendResponse(
      res,
      "List of categories failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id)
      return sendResponse(
        res,
        "Category id required",
        false,
        StatusCodes.BAD_REQUEST
      );

    const productSnap = await db
      .collection("products")
      .where("categoryId", "==", id)
      .limit(1)
      .get();
    if (!productSnap.empty) {
      return sendResponse(
        res,
        "Cannot delete category: products reference it",
        false,
        StatusCodes.CONFLICT
      );
    }

    await db.collection("categories").doc(id).delete();
    return sendResponse(res, "Category deleted", true, StatusCodes.OK);
  } catch (err) {
    return sendResponse(
      res,
      "Delete failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return sendResponse(
        res,
        "Category Id is required",
        false,
        StatusCodes.BAD_REQUEST
      );
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return sendResponse(
        res,
        "Category name is required",
        false,
        StatusCodes.BAD_REQUEST
      );
    }

    const nameTrim = name.trim();

    const snap = await db
      .collection("categories")
      .where("name", "==", nameTrim)
      .get();

    const duplicate = snap.docs.find((doc) => doc.id !== id);
    if (duplicate) {
      return sendResponse(
        res,
        "Category name already exists",
        false,
        StatusCodes.CONFLICT
      );
    }

    await db.collection("categories").doc(id).update({
      name: nameTrim,
      updatedAt: new Date(),
    });

    return sendResponse(
      res,
      "Category updated successfully",
      true,
      StatusCodes.OK
    );
  } catch (err) {
    return sendResponse(
      res,
      "Update category failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}
