import { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import { sendResponse } from "../utils/response.util";
import { StatusCodes } from "http-status-codes";

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
    return res
      .status(500)
      .json({
        error: "Upload failed",
        details: err.response?.data || err.message,
      });
  }
}
