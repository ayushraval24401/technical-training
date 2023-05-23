import { PrismaClient } from "@prisma/client";
import { CustomError } from "../types/CustomError";

const prisma = new PrismaClient();

class ComapnyServices {
  async getAllCompaniesService() {
    const companies = await prisma.company.findMany();
    return { companies };
  }

  async addCompanyService(name: string) {
    const company = await prisma.company.create({
      data: {
        name: name,
      },
    });
    return { company };
  }
}

export default new ComapnyServices();
