"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { checkoutShippingSchema } from "@/lib/validation";
import { shippingMethods, FREE_SHIPPING_THRESHOLD } from "@/lib/data/checkout";
import { generateReference } from "@/lib/submit";
import { isOwnUploadUrl } from "@/lib/storage";

/**
 * ثبت سفارش واقعی.
 *
 * تا پیش از این، تسویه‌حساب فقط یک تأخیر ۹۰۰ میلی‌ثانیه‌ای بود و هیچ سفارشی
 * جایی ذخیره نمی‌شد. حالا سفارش در دیتابیس ثبت می‌شود و بلافاصله در پنل
 * مدیریت دیده می‌شود.
 *
 * نکته امنیتی: قیمت‌ها *هرگز* از سمت کلاینت خوانده نمی‌شوند. کلاینت فقط
 * شناسه محصول و تعداد را می‌فرستد و مبلغ اینجا از روی دیتابیس محاسبه می‌شود،
 * وگرنه هر کسی می‌توانست با دستکاری درخواست، قیمت را صفر کند.
 */

export type CheckoutLineInput = { productId: number; quantity: number };

export type PlaceOrderResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

const MAX_QTY_PER_LINE = 20;

export async function placeOrderAction(
  values: unknown,
  lines: CheckoutLineInput[],
  receiptUrl?: string,
): Promise<PlaceOrderResult> {
  const parsed = checkoutShippingSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "اطلاعات فرم کامل یا معتبر نیست." };
  }
  const form = parsed.data;

  const wanted = lines
    .filter(
      (l) =>
        Number.isInteger(l.productId) &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0,
    )
    .slice(0, 50);

  if (wanted.length === 0) {
    return { ok: false, error: "سبد خرید خالی است." };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: wanted.map((l) => l.productId) }, published: true },
  });

  if (products.length === 0) {
    return { ok: false, error: "هیچ‌کدام از محصولات سبد دیگر در دسترس نیستند." };
  }

  const items = wanted.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) return [];

    const quantity = Math.min(MAX_QTY_PER_LINE, line.quantity);
    let image = "";
    try {
      const parsedImages = JSON.parse(product.images);
      if (Array.isArray(parsedImages)) image = parsedImages[0] ?? "";
    } catch {
      // تصویر خراب نباید جلوی ثبت سفارش را بگیرد.
    }

    return [
      {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        sku: product.sku,
        image,
        unitPrice: product.price,
        quantity,
      },
    ];
  });

  // اقلام «تماس بگیرید» قیمت ندارند و در جمع کل حساب نمی‌شوند؛ کارشناس بعداً
  // با مشتری هماهنگ می‌کند.
  const subtotal = items.reduce(
    (sum, i) => sum + (i.unitPrice ?? 0) * i.quantity,
    0,
  );

  const method = shippingMethods.find((m) => m.id === form.shippingMethod);
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (method?.cost ?? 0);

  const order = await prisma.order.create({
    data: {
      reference: generateReference(),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email ?? "",
      province: form.province,
      city: form.city,
      address: form.address,
      postalCode: form.postalCode,
      note: form.note ?? "",
      shippingMethod: form.shippingMethod,
      paymentMethod: form.paymentMethod,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      status: "pending",
      // آدرس فیش از کلاینت می‌آید، پس فقط وقتی ذخیره می‌شود که واقعاً به
      // فضای آپلود خودمان اشاره کند.
      receiptPath:
        receiptUrl && isOwnUploadUrl(receiptUrl, "receipts") ? receiptUrl : "",
      items: { create: items },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return { ok: true, reference: order.reference };
}
