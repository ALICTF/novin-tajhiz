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
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "online",
    title: "پرداخت اینترنتی",
    description: "انتقال به درگاه بانکی امن و پرداخت با کارت‌های عضو شتاب.",
  },
  {
    id: "transfer",
    title: "کارت به کارت / انتقال بانکی",
    description: "شماره حساب پس از ثبت سفارش برای شما ارسال می‌شود.",
  },
  {
    id: "onDelivery",
    title: "پرداخت در محل",
    description: "فقط برای سفارش‌های داخل مشهد با تحویل توسط پیک اختصاصی.",
  },
];

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
  { id: 3, title: "پرداخت", description: "انتخاب روش پرداخت" },
  { id: 4, title: "تأیید نهایی", description: "ثبت سفارش" },
];
