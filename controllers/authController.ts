import { Request, Response, NextFunction } from "express";
import { loginValidator, registerValidator } from "../helper/validator";
import { DefaultResponse } from "../helper/responseHelper";
import { CustomError } from "../types/CustomError";
import authServices from "../services/authServices";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Check validation
      const error = registerValidator.validate(req.body);

      // Validation failed
      if (error.error) {
        const err: CustomError = new CustomError(403, error.error?.message);
        return next(err);
      }

      var email: string = req.body.email as string;
      const username: string = req.body.username as string;
      const password: string = req.body.password as string;
      const address: {} = req.body.address;

      const { user } = await authServices.registerUserServices(
        email,
        username,
        password,
        address
      );

      return DefaultResponse(res, 201, "User created successfully", user);
    } catch (err) {
      next(err);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      //   Check validation
      const error = loginValidator.validate(req.body);

      //   Validation failed
      if (error.error) {
        const err: CustomError = new CustomError(403, error.error?.message);
        return next(err);
      }

      const { token, username } = await authServices.loginUserServices(
        req.body.email,
        req.body.password
      );

      return DefaultResponse(res, 200, "Login successful", {
        token: token,
        username: username,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
