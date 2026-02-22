import PredictionHero from "@/components/predict/PredictionHero";
import PredictionChart from "@/components/predict/PredictionChart";
import PredictionStrategy from "@/components/predict/PredictionStrategy";
import PredictionStats from "@/components/predict/PredictionStats";
import PredictionTerminal from "@/components/predict/PredictionTerminal";
import PredictionCTA from "@/components/predict/PredictionCTA";
import FooterSection from "@/components/FooterSection";

const PredictMarket = () => {
  return (
    <div className="min-h-screen bg-background">
      <PredictionHero />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <PredictionChart />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <PredictionStrategy />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <PredictionStats />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <PredictionTerminal />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <PredictionCTA />
      <FooterSection />
    </div>
  );
};

export default PredictMarket;
