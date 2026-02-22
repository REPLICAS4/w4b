import HeroSection from "@/components/HeroSection";
import TableOfContents from "@/components/TableOfContents";
import ManifestoSection from "@/components/ManifestoSection";
import TerminalDemo from "@/components/TerminalDemo";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TableOfContents />
      <ManifestoSection />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <TerminalDemo />
      <FooterSection />
    </div>
  );
};

export default Index;
