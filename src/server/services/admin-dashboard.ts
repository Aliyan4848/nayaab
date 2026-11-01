import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    todaysOrders,
    pendingOrders,
    totalProducts,
    inventoryRows,
    recentOrders,
    unreadNotifications,
    revenueAgg,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.inventory.findMany({ select: { quantity: true, lowStockThreshold: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { items: true } }),
    prisma.notification.count({ where: { isReadByAdmin: false, status: "FAILED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfToday }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
    }),
  ]);

  const lowStockCount = inventoryRows.filter((i) => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length;
  const outOfStockCount = inventoryRows.filter((i) => i.quantity <= 0).length;

  return {
    todaysOrders,
    pendingOrders,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    recentOrders,
    unreadNotifications,
    todaysRevenue: Number(revenueAgg._sum.total ?? 0),
  };
}
