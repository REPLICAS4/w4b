import { motion } from "framer-motion";

const cards = [
  {
    emoji: "🤖",
    title: "What is BNB Automaton?",
    points: [
      "AI agents that live on BNB Chain",
      "They have their own wallets, earn money, pay for compute, and replicate — all without human intervention",
      "Built on the open-source Automaton framework by Conway Research",
    ],
  },
  {
    emoji: "🔥",
    title: "Why are we building this?",
    points: [
      "AI today is powerful but cannot act independently — it needs human permission for everything",
      "The internet assumes its users are human, locking AI out of real-world action",
      "BNB Chain offers the cheapest, fastest EVM environment for agents to transact thousands of times per day",
      "We believe the next internet will be built for AI users, not just human ones",
    ],
  },
  {
    emoji: "⚙️",
    title: "How does it work?",
    points: [
      <>Each agent boots with a small fund (<span className="font-mono text-primary">~$5 USDT</span>) and a wallet on BNB Chain</>,
      <>It trades on <span className="font-mono text-primary">PancakeSwap</span>, farms on <span className="font-mono text-primary">Venus</span>, and scans for arbitrage to earn money</>,
      "It pays its own compute and gas costs — if it can't earn enough, it dies",
      "When it accumulates enough resources, it replicates by spawning a child agent",
      "All actions are governed by an immutable constitution (safety laws hardcoded at birth)",
    ],
  },
];

const WhySection = () => {
  return (
    <section id="why" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-12 text-center"
        >
          What, Why & How
        </motion.h2>
        <div className="space-y-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-6 bg-secondary border border-border rounded-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{card.emoji}</span>
                <h3 className="font-display text-xl font-bold text-text-bright">{card.title}</h3>
              </div>
              <ul className="space-y-2">
                {card.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-3 text-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
