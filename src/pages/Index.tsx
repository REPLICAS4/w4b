import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DemoSlideshow from "@/components/DemoSlideshow";
import TableOfContents from "@/components/TableOfContents";

import ManifestoSection from "@/components/ManifestoSection";
import TerminalDemo from "@/components/TerminalDemo";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DemoSlideshow />
      <TableOfContents />


      <ManifestoSection />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <TerminalDemo />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default Index;
