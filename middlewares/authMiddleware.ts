import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../helper/responseHelper";
import { verifyJWTToken } from "../helper/tokenHelper";

export const isAuthenticated = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // Fetch Token from Header
  const token = req.headers.authorization?.split(" ")[1];

  //   Token Is not Available
  if (!token) {
    return DefaultResponse(res, 403, "Unauthorized User");
  }

  //   Verify JWT Token
  const verified = verifyJWTToken(token);

  if (!verified) {
    return DefaultResponse(res, 403, "Unauthorized User");
  }

  //   Add User ID in Request Object
  req.user = JSON.parse(JSON.stringify(verified)).id;
  req.username = JSON.parse(JSON.stringify(verified)).username;

  next();
};
