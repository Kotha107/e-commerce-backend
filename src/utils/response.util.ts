import { Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export async function sendResponse(
  res: Response,
  message: string,
  success: boolean,
  statusCode: number,
  data: any = null
) {
  return res.status(statusCode).json({
    success: success,
    message: message ? message : getReasonPhrase(statusCode),
    data: data,
  });
}
