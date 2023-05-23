import { PrismaClient } from "@prisma/client";
import { CustomError } from "../types/CustomError";
const prisma = new PrismaClient();

class TemplateService {
  async getAllTemplates(
    search?: string,
    page?: number,
    limit?: number,
    column?: string,
    sortType?: string
  ) {
    let templates;
    let count;
    let queryArgs: {} = {
      select: {
        id: true,
        name: true,
        companyIds: true,
        companies: { select: { name: true } },
        reportId: true,
        report: { select: { name: true } },
        updated_at: true,
        modified_by: true,
      },
    };

    if (column) {
      queryArgs = {
        ...queryArgs,
        where: {
          [column]: {
            mode: "insensitive",
            contains: search,
          },
        },
        orderBy: {
          [column]: sortType ?? "asc",
        },
      };
      count = await prisma.template.count({
        where: {
          [column]: {
            mode: "insensitive",
            contains: search,
          },
        },
      });
    } else {
      count = await prisma.template.count();
    }

    if (!page || !limit) {
      templates = await prisma.template.findMany({
        ...queryArgs,
      });
    } else {
      templates = await prisma.template.findMany({
        ...queryArgs,
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    return { count, templates };
  }

  async getTemplateDetails(id: string) {
    const queryArgs = {
      id: true,
      name: true,
      companyIds: true,
      companies: { select: { id: true, name: true } },
      reportId: true,
      report: {
        select: { id: true, name: true },
      },
    };
    const template = await prisma.template.findUnique({
      where: {
        id: id,
      },
      select: queryArgs,
    });
    return { template };
  }

  async addTemplate(
    name: string,
    companies: [],
    report: string,
    user: string,
    modified: string
  ) {
    const setData = companies.map((company) => {
      return {
        id: company,
      };
    });
    const template = await prisma.template.create({
      data: {
        name: name,
        companyIds: companies,
        companies: {
          connect: setData,
        },
        reportId: report,
        userId: user,
        modified_by: modified,
      },
    });

    return { template };
  }

  async updateTemplate(id: string, user: string, data: any) {
    const setData = data?.companyIds?.map((company: any) => {
      return {
        id: company,
      };
    });

    // let updatedTemplate;
    const finaldata = prisma.template
      .findUnique({
        where: { id: id },
        select: {
          companyIds: true,
        },
      })
      .then((old) => {
        const oldData = old?.companyIds?.map((com) => {
          return {
            id: com,
          };
        });

        return prisma.template.update({
          where: { id: id },
          data: {
            companies: {
              disconnect: oldData,
            },
          },
        });
      })
      .then(async (newData) => {
        return prisma.template.update({
          where: { id: id },
          data: {
            name: data?.name,
            report: data?.report,
            modified_by: user,
            companies: {
              connect: setData,
            },
          },
        });
      })
      .then((updatedTemplate) => {
        return updatedTemplate;
      })
      .catch((err) => {
        console.log(err);
      });

    return finaldata;
  }

  async deleteTemplate(templateIds: []) {
    let promises: any = [];
    let tempId: any;
    templateIds.forEach(async (temp: any) => {
      promises.push(
        prisma.template
          .findUnique({ where: { id: temp } })
          .then((templateData: any) => {
            tempId = templateData.id;
            let setData = templateData.companyIds.map((comp: any) => {
              return {
                id: comp,
              };
            });
            return prisma.template.update({
              where: { id: temp },
              data: {
                companies: { disconnect: setData },
              },
            });
          })
          // .then(async (res) => {
          //   return prisma.template.deleteMany({
          //     where: {
          //       id: {
          //         in: templateIds,
          //       },
          //     },
          //   });
          // })
          .then((res) => {
            return res;
          })
      );
    });

    Promise.all(promises).then((res) => {
      return res;
    });

    return await prisma.template.deleteMany({
      where: {
        id: {
          in: templateIds,
        },
      },
    });
  }
}

export default new TemplateService();
