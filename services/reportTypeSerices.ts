import { PrismaClient } from "@prisma/client";
import { CustomError } from "../types/CustomError";

const prisma = new PrismaClient();

class ReportServices {
  async getAllReportsService() {
    const reports = await prisma.reporttype.findMany();
    return { reports };
  }

  async addReportService(name: string) {
    const report = await prisma.reporttype.create({
      data: {
        name: name,
      },
    });
    return { report };
  }
}

export default new ReportServices();
