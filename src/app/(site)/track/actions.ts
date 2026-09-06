"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { startCustomerSession, endCustomerSession } from "@/lib/customer/session";
import { toLatinDigits } from "@/lib/format";

/**
 * ورود مشتری به بخش پیگیری سفارش.
 *
 * تطبیق با هر دو مقدار انجام می‌شود: کد پیگیری و شماره موبایل. هیچ‌کدام به
 * تنهایی کافی نیست، وگرنه با حدس زدن کد می‌شد اطلاعات شخصی دیگران را دید.
 */

export type TrackState = { error?: string };

/** ارقام فارسی، فاصله و خط تیره را نرمال می‌کند. */
function normalizePhone(input: string): string {
  return toLatinDigits(input).replace(/[\s-]/g, "");
}

export async function trackOrderAction(
  _prev: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const reference = String(formData.get("reference") ?? "").trim().toUpperCase();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));

  if (!reference) return { error: "کد پیگیری را وارد کنید" };
  if (!phone) return { error: "شماره موبایل را وارد کنید" };

  const order = await prisma.order.findFirst({
    where: { reference },
    select: { phone: true },
  });

  /*
    پیام خطا عمداً یکی است و نمی‌گوید کدام یک اشتباه بوده. اگر می‌گفت «کد
    درست است ولی شماره غلط»، می‌شد با حدس کد فهمید چه سفارش‌هایی وجود دارند.
  */
  if (!order || normalizePhone(order.phone) !== phone) {
    return { error: "کد پیگیری یا شماره موبایل درست نیست" };
  }

  await startCustomerSession(normalizePhone(order.phone));
  redirect("/orders");
}

export async function customerSignOutAction(): Promise<void> {
  await endCustomerSession();
  redirect("/track");
}
