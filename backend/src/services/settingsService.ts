import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserSettings(userId: string) {
  let settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        userId,
        currency: "USD",
      },
    });
  }

  return settings;
}

export async function updateUserSettings(
  userId: string,
  data: { currency?: string },
) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}
