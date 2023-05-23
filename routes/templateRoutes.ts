import express from "express";
import templateController from "../controllers/templateController";
import { isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/", templateController.getAllTemplates);
router.get("/:id", templateController.getTemplateDetails);
router.post("/", templateController.addTemplate);
router.put("/:id", templateController.updateTemplate);
router.delete("/", templateController.deleteTemplate);

export default router;
