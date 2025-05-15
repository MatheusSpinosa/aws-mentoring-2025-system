/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";

import { AppError } from "@errors/AppError";

export async function ensureErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    let message = String(err?.message || "A error occurred");

    if (err?.variables && Object.keys(err?.variables).length > 0) {
      Object.keys(err?.variables).forEach((key) => {
        const fieldName = err?.variables[key];
        const name = String(fieldName);
        message = message.replace(`{${key}}`, name);
      });
    }

    return response.status(err.statusCode).json({
      message,
      errorCode: err.errorCode,
    });
  }

  if (request.body?.queryRunner) {
    delete request.body.queryRunner;
  }
  console.log(JSON.stringify(err, null, 2));
  return response.status(500).json({
    status: "error",
    message: "An error happened during your request. Please try again",
    errorCode: "UDFNX000",
  });
}
