import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WaitlistModal from "../WaitlistModal";

const PredictionCTA = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  return (
    <>
    <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="py-20 max-w-3xl mx-auto px-6 text-center"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-4">
        Deploy Your Prediction Agent
      </h2>
      <p className="text-muted-foreground text-sm mb-10 max-w-xl mx-auto">
        Fork the agent, configure your strategy parameters, and let it trade BTC predictions autonomously on PancakeSwap.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => setWaitlistOpen(true)}
          className="font-mono text-sm tracking-wider px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-glow"
        >
          TRY NOW YOUR REPLICAS →
        </button>
        <a
          href="https://github.com/Conway-Research/automaton"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm tracking-wider px-8 py-3 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
        >
          CONNECT WALLET
        </a>
      </div>
    </motion.section>
    </>
  );
};

export default PredictionCTA;
