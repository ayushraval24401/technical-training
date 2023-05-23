import { Request, Response, NextFunction } from "express";
import { templateValidator } from "../helper/validator";
import { DefaultResponse } from "../helper/responseHelper";
import { CustomError } from "../types/CustomError";
import templateServices from "../services/templateServices";

class TemplateController {
  async getAllTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const search: string = req?.query?.search as string;
      const page: number = Number(req.query.page);
      const limit: number = Number(req.query.limit);
      const column: string = req.query.column as string;
      const sortType: string = req.query.sort as string;

      const { templates, count } = await templateServices.getAllTemplates(
        search,
        page,
        limit,
        column,
        sortType
      );
      return DefaultResponse(
        res,
        200,
        "Templates fetched successfully",
        templates,
        count,
        page
      );
    } catch (err) {
      next(err);
    }
  }

  async getTemplateDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const { template } = await templateServices.getTemplateDetails(id);
      return DefaultResponse(
        res,
        200,
        "Templates fetched successfully",
        template
      );
    } catch (err) {
      next(err);
    }
  }

  async addTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const error = templateValidator.validate(req.body);

      // Validation failed
      if (error.error) {
        const err: CustomError = new CustomError(403, error.error?.message);
        return next(err);
      }

      const { name, companies, report } = req.body;

      const request: any = req;

      const template = await templateServices.addTemplate(
        name,
        companies,
        report,
        request.user,
        request.username
      );

      return DefaultResponse(
        res,
        201,
        "Template created successfully",
        template
      );
    } catch (err) {
      next(err);
    }
  }

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const request: any = req;

      const { userId, modified_by, ...data } = req.body;

      const updatedTemplate = await templateServices.updateTemplate(
        id,
        request.username,
        data
      );

      return DefaultResponse(
        res,
        200,
        "Templates updated successfully",
        updatedTemplate
      );
    } catch (err) {
      next(err);
    }
  }

  async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const ids = req.body.templates;

      await templateServices.deleteTemplate(ids);

      return DefaultResponse(res, 200, "Templates deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

export default new TemplateController();
