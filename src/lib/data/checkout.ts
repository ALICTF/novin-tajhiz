/** پیکربندی ارسال و پرداخت — مقادیر نمایشی فروشگاه. */

export const SHIPPING_FLAT_RATE = 450_000;
export const FREE_SHIPPING_THRESHOLD = 20_000_000;

export type ShippingMethod = {
  id: "courier" | "post" | "pickup";
  title: string;
  description: string;
  cost: number | null;
  eta: string;
};

export const shippingMethods: ShippingMethod[] = [
  {
    id: "courier",
    title: "پیک اختصاصی (مشهد)",
    description: "تحویل درب منزل توسط پیک مجموعه، به‌همراه آموزش اولیه راه‌اندازی.",
    cost: 0,
    eta: "همان روز یا روز بعد",
  },
  {
    id: "post",
    title: "پست پیشتاز / تیپاکس",
    description: "ارسال بیمه‌شده به تمام نقاط کشور با کد رهگیری.",
    cost: SHIPPING_FLAT_RATE,
    eta: "۲ تا ۴ روز کاری",
  },
  {
    id: "pickup",
    title: "تحویل حضوری از دفتر",
    description: "مراجعه به دفتر مرکزی در مشهد، بلوار احمدآباد.",
    cost: 0,
    eta: "پس از هماهنگی تلفنی",
  },
];

export type PaymentMethod = {
  id: "online" | "transfer" | "onDelivery";
  title: string;
  description: string;
  /** روش‌های هنوز فعال‌نشده، نمایش داده می‌شوند ولی قابل انتخاب نیستند. */
  disabled?: boolean;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "transfer",
    title: "کارت به کارت",
    description:
      "مبلغ فاکتور را به شماره کارت مجموعه واریز کنید و تصویر فیش را در همین صفحه بارگذاری نمایید.",
  },
  {
    id: "onDelivery",
    title: "پرداخت در محل",
    description: "فقط برای سفارش‌های داخل مشهد با تحویل توسط پیک اختصاصی.",
  },
  {
    id: "online",
    title: "پرداخت اینترنتی",
    description: "به‌زودی — درگاه بانکی این فروشگاه هنوز فعال نشده است.",
    disabled: true,
  },
];

export type BankAccount = {
  bank: string;
  /** ۱۶ رقم با ارقام لاتین و بدون فاصله. */
  cardNumber: string;
  holder: string;
  sheba?: string;
  /**
   * تا وقتی `false` است، به‌جای کارت بانکی یک پیام «برای دریافت شماره کارت
   * تماس بگیرید» به مشتری نشان داده می‌شود.
   */
  configured: boolean;
};

/**
 * حساب بانکی مقصدِ پرداخت کارت‌به‌کارت.
 *
 * ⚠️ هنوز پر نشده است. شماره کارت واقعی عمداً وارد نشده تا هیچ عددِ ساختگی
 * به‌جای شماره واقعی به مشتری نمایش داده نشود.
 *
 * برای فعال‌سازی، سه مقدار زیر را پر کنید و `configured` را `true` بگذارید:
 *   cardNumber → ۱۶ رقم پیوسته با ارقام لاتین، مثلاً "6104337812345678"
 *   holder     → نام دقیق صاحب حساب همان‌طور که در بانک ثبت شده
 *   sheba      → اختیاری؛ ۲۴ رقم بدون پیشوند IR
 *
 * تا زمانی که `configured` برابر `false` باشد، صفحه پرداخت به‌جای کارت،
 * شماره تماس مجموعه را نشان می‌دهد؛ پس سایت قابل استفاده می‌ماند و هیچ
 * مشتری‌ای به حساب اشتباه واریز نمی‌کند.
 */
export const bankAccount: BankAccount = {
  bank: "بانک ملت",
  cardNumber: "",
  holder: "",
  sheba: "",
  configured: false,
};

export const provinces = [
  "خراسان رضوی",
  "تهران",
  "اصفهان",
  "فارس",
  "خراسان شمالی",
  "خراسان جنوبی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "البرز",
  "مازندران",
  "گیلان",
  "کرمان",
  "یزد",
  "سیستان و بلوچستان",
  "گلستان",
  "سمنان",
  "قم",
  "مرکزی",
  "همدان",
  "کرمانشاه",
  "لرستان",
  "خوزستان",
  "بوشهر",
  "هرمزگان",
  "اردبیل",
  "زنجان",
  "قزوین",
  "کردستان",
  "چهارمحال و بختیاری",
  "کهگیلویه و بویراحمد",
  "ایلام",
];

export const checkoutSteps = [
  { id: 1, title: "بازبینی سبد", description: "بررسی اقلام انتخابی" },
  { id: 2, title: "اطلاعات ارسال", description: "نشانی و روش تحویل" },
  { id: 3, title: "روش پرداخت", description: "انتخاب شیوه تسویه" },
  { id: 4, title: "فاکتور و واریز", description: "پرداخت و ارسال فیش" },
];
