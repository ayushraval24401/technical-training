import { Request, Response, NextFunction } from "express";
import { companyValidator } from "../helper/validator";
import { DefaultResponse } from "../helper/responseHelper";
import { CustomError } from "../types/CustomError";
import reportServices from "../services/reportTypeSerices";

class ReportTypeController {
  async getAllReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { reports } = await reportServices.getAllReportsService();
      return DefaultResponse(res, 200, "Reports fetched successfully", reports);
    } catch (err) {
      next(err);
    }
  }

  async getReportDetails(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }

  async addReport(req: Request, res: Response, next: NextFunction) {
    try {
      // Check validation
      const error = companyValidator.validate(req.body);

      // Validation failed
      if (error.error) {
        const err: CustomError = new CustomError(403, error.error?.message);
        return next(err);
      }

      const { report } = await reportServices.addReportService(req.body.name);

      return DefaultResponse(res, 201, "Company created successfully", report);
    } catch (err) {
      next(err);
    }
  }

  async updateReport(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }

  async deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

export default new ReportTypeController();
