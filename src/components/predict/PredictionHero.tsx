import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PredictionHero = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK TO HOME
        </Link>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-6"
        >
          REPLICAS · PREDICTION MARKET
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-text-bright text-glow leading-[0.95]"
        >
          Prediction Market
          <span className="block text-primary mt-2">Agent</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 font-mono text-base md:text-lg tracking-wider text-muted-foreground max-w-2xl"
        >
          AI-powered BTC 5-minute predictions on PancakeSwap. Watch the agent analyze, predict, and profit in real-time.
        </motion.p>
      </div>
    </section>
  );
};

export default PredictionHero;
