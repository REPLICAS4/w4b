import HeroSection from "@/components/HeroSection";
import TableOfContents from "@/components/TableOfContents";
import ManifestoSection from "@/components/ManifestoSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TableOfContents />
      <ManifestoSection />
      <FooterSection />
    </div>
  );
};

export default Index;
