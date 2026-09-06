import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { storeUpload } from "@/lib/storage";

/** آپلود تصویر محصول از پنل. فقط برای ادمین واردشده. */
export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "فایلی ارسال نشده" }, { status: 400 });
  }

  const result = await storeUpload(file, "products");
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
