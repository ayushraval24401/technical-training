import express from "express";
import companyController from "../controllers/companyController";
const router = express.Router();

router.get("/", companyController.getAllCompanies);
// router.get("/:id", companyController.getCompanyDetails);
router.post("/", companyController.addCompany);
// router.put("/:id", companyController.updateCompany);
// router.delete("/:id", companyController.deleteCompany);

export default router;
