import { Request, Response, NextFunction } from "express";
import { companyValidator } from "../helper/validator";
import { DefaultResponse } from "../helper/responseHelper";
import { CustomError } from "../types/CustomError";
import companyServices from "../services/companyServices";

class CompanyController {
  async getAllCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const { companies } = await companyServices.getAllCompaniesService();
      return DefaultResponse(
        res,
        200,
        "Companies fetched successfully",
        companies
      );
    } catch (err) {
      next(err);
    }
  }

  async getCompanyDetails(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }

  async addCompany(req: Request, res: Response, next: NextFunction) {
    try {
      // Check validation
      const error = companyValidator.validate(req.body);

      // Validation failed
      if (error.error) {
        const err: CustomError = new CustomError(403, error.error?.message);
        return next(err);
      }

      const { company } = await companyServices.addCompanyService(
        req.body.name
      );

      return DefaultResponse(res, 201, "Company created successfully", company);
    } catch (err) {
      next(err);
    }
  }

  async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }

  async deleteCompany(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

export default new CompanyController();
