import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { NextFunction, Request, Response } from "express";

import { AppError } from "@errors/AppError";

const userPoolId = process.env.COGNITO_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: "access",
  clientId,
});

export async function ensureAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não fornecido", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Formato do token invalido", 401);
  }
  try {
    const payload = await verifier.verify(token);

    req.customer = {
      id: payload.sub,
      userName: payload.username,
    };
  } catch (error) {
    throw new AppError("Token invalido ou expirado", 401);
  }
  next();
}
