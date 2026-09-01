import {
  Activity,
  AirVent,
  Brain,
  Cable,
  ClipboardCheck,
  Cpu,
  Droplets,
  FileJson,
  Filter,
  Gauge,
  GraduationCap,
  HeartPulse,
  Layers,
  Microscope,
  Moon,
  Ruler,
  ScanFace,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  Truck,
  Waves,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * نگاشت نام آیکون به کامپوننت.
 * داده‌ها آیکون را به‌صورت رشته نگه می‌دارند تا بتوان آن‌ها را آزادانه بین
 * سرور و کلاینت جابه‌جا کرد (کامپوننت‌ها قابل سریالایز نیستند).
 */
export const iconMap = {
  activity: Activity,
  airVent: AirVent,
  brain: Brain,
  cable: Cable,
  clipboardCheck: ClipboardCheck,
  cpu: Cpu,
  droplets: Droplets,
  fileJson: FileJson,
  filter: Filter,
  gauge: Gauge,
  graduationCap: GraduationCap,
  heartPulse: HeartPulse,
  layers: Layers,
  microscope: Microscope,
  moon: Moon,
  ruler: Ruler,
  scanFace: ScanFace,
  shieldCheck: ShieldCheck,
  stethoscope: Stethoscope,
  thermometer: Thermometer,
  truck: Truck,
  waves: Waves,
  wind: Wind,
  wrench: Wrench,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export function getIcon(name: IconName | string | undefined): LucideIcon {
  return iconMap[name as IconName] ?? Activity;
}
