import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";

const DegenHero = () => {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-8 h-8 text-primary" />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary/20"
              />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              DEGEN SCANNER
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <span className="font-mono text-xs text-primary">LIVE</span>
            </div>
          </div>
          <p className="font-mono text-sm text-muted-foreground max-w-xl mx-auto">
            Real-time BSC meme token scanner powered by AI analysis. Auto-fetch trending tokens,
            get degen scores, risk analysis & trade signals.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Activity className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">BSC CHAIN</span>
            </div>
            <span className="text-border">|</span>
            <span className="font-mono text-xs text-muted-foreground">DEXSCREENER DATA</span>
            <span className="text-border">|</span>
            <span className="font-mono text-xs text-muted-foreground">AI ANALYSIS</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DegenHero;
