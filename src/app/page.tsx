import { HeroSection } from "@/components/home/hero-section";
import { Features } from "@/components/home/features";
import { ProductShowcase } from "@/components/home/product-showcase";
import { AboutSummary } from "@/components/home/about-summary";
import { BlogSection } from "@/components/home/blog-section"; 

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductShowcase />
      <AboutSummary />
      <BlogSection /> 
      <Features />
    </>
  );
}