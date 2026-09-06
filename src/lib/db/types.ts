/**
 * انواع مشترک لایه دیتابیس.
 *
 * این فایل عمداً `server-only` نیست و به Prisma وابستگی ندارد، تا کامپوننت‌های
 * کلاینت پنل بتوانند فقط تایپ‌ها را import کنند بدون آنکه کلاینت دیتابیس وارد
 * باندل مرورگر شود.
 */

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

/** برچسب فارسی و رنگ هر وضعیت — یک منبع واحد برای همه جای پنل. */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; tone: "amber" | "sky" | "violet" | "teal" | "emerald" | "rose" }
> = {
  pending: { label: "در انتظار بررسی", tone: "amber" },
  confirmed: { label: "تأیید شده", tone: "sky" },
  processing: { label: "در حال آماده‌سازی", tone: "violet" },
  shipped: { label: "ارسال شده", tone: "teal" },
  delivered: { label: "تحویل شده", tone: "emerald" },
  cancelled: { label: "لغو شده", tone: "rose" },
};

/** وضعیت‌هایی که یعنی سفارش هنوز باز است و کاری دارد. */
export const OPEN_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
];

export type AdminProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  price: number | null;
  oldPrice: number | null;
  shortDescription: string;
  description: string[];
  images: string[];
  tags: string[];
  rating: number;
  reviewsCount: number;
  sku: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  sortIndex: number;
  published: boolean;
  updatedAt: string;
};

export type AdminArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  icon: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  tags: string[];
  isFeatured: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

export type AdminOrderItem = {
  id: number;
  productId: number | null;
  name: string;
  brand: string;
  sku: string;
  image: string;
  unitPrice: number | null;
  quantity: number;
};

export type AdminOrder = {
  id: number;
  reference: string;
  customerName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  note: string;
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  receiptPath: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
  itemCount: number;
};
