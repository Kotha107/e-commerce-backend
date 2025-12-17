import { Request, Response } from "express";
import { db } from "../config/firebase";
import { sendResponse } from "../utils/response.util";
import { StatusCodes } from "http-status-codes";
import { CustomerModel } from "../models/customer.model";

export async function createOrGetCustomer(req: Request, res: Response) {
  try {
    const { name, email, phone } = req.body;

    if (!phone && !email) {
      return sendResponse(
        res,
        "Phone or email is required",
        false,
        StatusCodes.BAD_REQUEST
      );
    }

  
    let snap;

    if (phone) {
      snap = await db
        .collection("customers")
        .where("phone", "==", phone)
        .limit(1)
        .get();
    } else {
      snap = await db
        .collection("customers")
        .where("email", "==", email)
        .limit(1)
        .get();
    }

    
    if (!snap.empty) {
      const doc = snap.docs[0];
      return sendResponse(res, "Existing customer", true, StatusCodes.OK, {
        id: doc.id,
        ...doc.data(),
      });
    }

   
    const customer: CustomerModel = {
      name,
      email: email || "",
      phone: phone || "",
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date(),
    };

    const docRef = await db.collection("customers").add(customer);

    return sendResponse(res, "Customer created", true, StatusCodes.OK, {
      id: docRef.id,
      ...customer,
    });
  } catch (err) {
    return sendResponse(
      res,
      "Customer processing failed",
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    );
  }
}
