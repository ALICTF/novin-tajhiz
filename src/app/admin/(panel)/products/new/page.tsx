import { listBrands, listCategories } from "@/lib/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([listCategories(), listBrands()]);

  return (
    <>
      <PageHeader
        title="افزودن محصول"
        description="کالای جدید را ثبت کنید"
      />
      <ProductForm categories={categories} brands={brands} />
    </>
  );
}
