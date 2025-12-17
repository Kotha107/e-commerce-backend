import { Request, Response } from "express";
import { db } from "../config/firebase";
import { sendResponse } from "../utils/response.util";
import { StatusCodes } from "http-status-codes";
import { SaleModel } from "../models/sale.model";
import { FieldValue } from "firebase-admin/firestore";

export async function createSale(req: Request, res: Response) {
  try {
    const { customerId, items, totalAmount, paymentMethod } = req.body;

    if (!customerId || !items?.length || !totalAmount) {
      return sendResponse(
        res,
        "Invalid sale data",
        false,
        StatusCodes.BAD_REQUEST
      );
    }

    const sale: SaleModel = {
      customerId,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "cash",
      createdAt: new Date(),
    };

    const saleRef = await db.collection("sales").add(sale);

    await db
      .collection("customers")
      .doc(customerId)
      .update({
        totalSpent: FieldValue.increment(totalAmount),
        totalOrders: FieldValue.increment(1),
      });

    return sendResponse(res, "Sale completed", true, StatusCodes.OK, {
      id: saleRef.id,
      ...sale,
    });
  } catch (err) {
    return sendResponse(
      res,
      "Sale creation failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}
