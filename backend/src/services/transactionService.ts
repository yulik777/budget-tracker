import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function createTransaction(
  userId: string,
  data: {
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
    date: Date;
  },
) {
  return prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<{
    amount: number;
    type: string;
    category: string;
    description: string;
    date: Date;
  }>,
) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return prisma.transaction.update({
    where: { id: transactionId },
    data,
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return prisma.transaction.delete({
    where: { id: transactionId },
  });
}
