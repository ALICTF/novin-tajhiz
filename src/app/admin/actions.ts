"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { endSession, isPasswordCorrect, startSession } from "@/lib/admin/auth";
import { isOrderStatus } from "@/lib/db/types";
import { requireAdmin } from "@/lib/admin/guard";

/* ------------------------------ احراز هویت ------------------------------ */

export type LoginState = { error?: string };

export async function signInAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) return { error: "رمز عبور را وارد کنید" };

  let ok = false;
  try {
    ok = isPasswordCorrect(password);
  } catch (error) {
    // پیکربندی ناقص است — پیام واقعی به ادمین نشان داده می‌شود چون این صفحه
    // فقط برای خود اوست و بدون دیدن علت، نمی‌داند باید .env را درست کند.
    return { error: (error as Error).message };
  }

  if (!ok) return { error: "رمز عبور درست نیست" };

  await startSession();
  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------ سفارش‌ها ------------------------------ */

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || !isOrderStatus(status)) return;

  await prisma.order.update({ where: { id }, data: { status } });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateOrderNoteAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.order.update({
    where: { id },
    data: { adminNote: String(formData.get("adminNote") ?? "").slice(0, 2000) },
  });

  revalidatePath(`/admin/orders/${id}`);
}

/* ------------------------------ پیام‌ها ------------------------------ */

export async function toggleMessageReadAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const current = await prisma.message.findUnique({
    where: { id },
    select: { read: true },
  });
  if (!current) return;

  await prisma.message.update({
    where: { id },
    data: { read: !current.read },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.message.delete({ where: { id } });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
