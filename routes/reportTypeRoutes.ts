import express from "express";
import reportController from "../controllers/reportTypeController";
const router = express.Router();

router.get("/", reportController.getAllReports);
// router.get("/:id", reportController.getReportDetails);
router.post("/", reportController.addReport);
// router.put("/:id", reportController.updateReport);
// router.delete("/:id", reportController.deleteReport);

export default router;
