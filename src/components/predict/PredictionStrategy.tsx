import { motion } from "framer-motion";
import { BarChart3, Brain, Zap } from "lucide-react";

const steps = [
  {
    icon: BarChart3,
    title: "Analyze",
    description:
      "Scans BTC 5m candles for momentum shifts, volume spikes, and support/resistance patterns using on-chain + off-chain data.",
  },
  {
    icon: Brain,
    title: "Predict",
    description:
      "LLM inference combines technical indicators with sentiment analysis to determine UP or DOWN for the next 5-minute round.",
  },
  {
    icon: Zap,
    title: "Execute",
    description:
      "Places prediction on PancakeSwap within the betting window. Manages position sizing based on confidence score and bankroll.",
  },
];

const PredictionStrategy = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="py-16 max-w-4xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-2">
        Agent Strategy
      </h2>
      <p className="text-muted-foreground text-sm mb-10 font-mono">
        Three-phase autonomous decision loop
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <step.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-display text-xl font-bold text-text-bright mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default PredictionStrategy;
