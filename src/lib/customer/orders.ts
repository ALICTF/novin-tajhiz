import "server-only";

import { prisma } from "@/lib/db/client";
import { isOrderStatus, type OrderStatus } from "@/lib/db/types";

/**
 * سفارش‌های مشتری — همیشه با فیلتر شماره موبایلِ نشست.
 *
 * هیچ تابعی اینجا سفارش را فقط با کد پیگیری برنمی‌گرداند: اگر برمی‌گرداند،
 * کسی که کد را حدس بزند می‌توانست نشانی و شماره دیگران را ببیند.
 */

export type CustomerOrder = {
  reference: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  province: string;
  city: string;
  address: string;
  itemCount: number;
  items: {
    id: number;
    name: string;
    brand: string;
    image: string;
    unitPrice: number | null;
    quantity: number;
  }[];
};

function toCustomerOrder(row: {
  reference: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  province: string;
  city: string;
  address: string;
  items: {
    id: number;
    name: string;
    brand: string;
    image: string;
    unitPrice: number | null;
    quantity: number;
  }[];
}): CustomerOrder {
  return {
    reference: row.reference,
    status: isOrderStatus(row.status) ? row.status : "pending",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    subtotal: row.subtotal,
    shippingCost: row.shippingCost,
    total: row.total,
    shippingMethod: row.shippingMethod,
    paymentMethod: row.paymentMethod,
    province: row.province,
    city: row.city,
    address: row.address,
    itemCount: row.items.reduce((sum, i) => sum + i.quantity, 0),
    items: row.items,
  };
}

const ITEM_SELECT = {
  id: true,
  name: true,
  brand: true,
  image: true,
  unitPrice: true,
  quantity: true,
} as const;

export async function listCustomerOrders(phone: string): Promise<CustomerOrder[]> {
  const rows = await prisma.order.findMany({
    where: { phone },
    orderBy: { createdAt: "desc" },
    include: { items: { select: ITEM_SELECT } },
  });
  return rows.map(toCustomerOrder);
}

export async function getCustomerOrder(
  phone: string,
  reference: string,
): Promise<CustomerOrder | null> {
  const row = await prisma.order.findFirst({
    where: { phone, reference },
    include: { items: { select: ITEM_SELECT } },
  });
  return row ? toCustomerOrder(row) : null;
}
