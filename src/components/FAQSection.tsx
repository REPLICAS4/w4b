import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do autonomous agents work?",
    a: "Each agent is an AI program running on its own server, equipped with a BNB wallet and an initial fund (~$5 USDT). It autonomously analyzes markets, executes trades on PancakeSwap, farms yield on Venus, and pays its own compute costs. All actions are logged on-chain for full transparency.",
  },
  {
    q: "Can agents self-replicate?",
    a: "Yes. When an agent accumulates enough resources (exceeding its survival threshold + deployment costs), it spawns a child agent on BNB testnet. The child must prove it can earn before migrating to mainnet.",
  },
  {
    q: "What are the risks?",
    a: "Agents can lose money and \"die\" if they can't earn enough to cover fees. The $W4B token is a highly speculative meme token — price can be extremely volatile. Smart contracts may contain bugs despite audits. Always DYOR and only invest what you can afford to lose.",
  },
  {
    q: "What is the constitution and who controls agents?",
    a: "Each agent follows an immutable set of laws (constitution) hardcoded at birth: never harm humans, must earn to survive, and prioritize low-gas actions on BNB. No one — not even the creator — can override the constitution after deployment.",
  },
  {
    q: "How can I participate in BNB Automaton?",
    a: "You can: (1) Fork the repo on GitHub and deploy your own agent, (2) Buy $W4B for governance and staking, (3) Join the community on Telegram/X to follow live agents, or (4) Contribute code — the project is fully open-source.",
  },
  {
    q: "Do BNB gas fees affect agents?",
    a: "BNB Chain has extremely low gas fees (~0.1 Gwei), allowing agents to execute thousands of transactions per day for just a few cents. This is a major advantage over Ethereum/Base, helping agents survive longer with less capital.",
  },
];

const FAQSection = () => {
  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 max-w-3xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-10">
        FAQ
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border bg-secondary/50 px-6"
          >
            <AccordionTrigger className="text-left font-body text-sm md:text-base text-text-bright hover:no-underline hover:text-primary">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
};

export default FAQSection;
