import Navbar from "@/components/Navbar";
import PredictionHero from "@/components/predict/PredictionHero";
import LivePriceTicker from "@/components/predict/LivePriceTicker";
import PredictionChart from "@/components/predict/PredictionChart";
import PredictionStrategy from "@/components/predict/PredictionStrategy";
import AgentThinking from "@/components/predict/AgentThinking";
import PredictionStats from "@/components/predict/PredictionStats";
import PredictionTerminal from "@/components/predict/PredictionTerminal";
import PredictionCTA from "@/components/predict/PredictionCTA";
import FooterSection from "@/components/FooterSection";

const PredictMarket = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PredictionHero />
      <LivePriceTicker />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-10" />
      <PredictionChart />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <PredictionStrategy />
      <div className="w-full max-w-3xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <AgentThinking />
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
