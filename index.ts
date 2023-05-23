import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { customError, notFound } from "./helper/errorHandler";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import reportRoutes from "./routes/reportTypeRoutes";
import templateRoutes from "./routes/templateRoutes";
import { isAuthenticated } from "./middlewares/authMiddleware";

app.use("/api/auth", authRoutes);
app.use("/api/companies", isAuthenticated, companyRoutes);
app.use("/api/reports", isAuthenticated, reportRoutes);
app.use("/api/templates", isAuthenticated, templateRoutes);

// Error Handlers
app.use(notFound);
app.use(customError);

const PORT = process.env.PORT || 5000;

// Server configuration
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
