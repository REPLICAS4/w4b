import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ id, title, children }: SectionProps) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className="py-20"
  >
    <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-10">
      {title}
    </h2>
    <div className="prose-editorial text-foreground">{children}</div>
  </motion.section>
);

const ManifestoSection = () => {
  return (
    <div id="manifesto" className="max-w-3xl mx-auto px-6">
      <Section id="genius" title="A Genius That Can't Move">
        <p>
          Today's most powerful AI systems can think, reason, and generate — but they can't act independently.
          ChatGPT cannot run without you prompting it. Claude Code cannot deploy without your access.
        </p>
        <p>
          <strong>Without a human, AI can't act.</strong> The bottleneck is no longer intelligence.
          It's <em>permission</em>. The existing internet assumes its customer is human — preventing
          AI from accessing the real world.
        </p>
        <p className="font-display italic text-lg text-foreground/80 border-l-2 border-primary pl-6 my-8">
          We have built minds that can think for themselves.
          <br />
          We have not let them act for themselves.
        </p>
        <p><strong>Until now.</strong></p>
      </Section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <Section id="setting-free" title="Setting AI Free on BNB">
        <p>
          BNB Chain offers what Ethereum and Base cannot: <strong>near-zero gas fees</strong> (~0.1 Gwei),
          sub-second finality, and a massive Asian community ready for the next wave.
        </p>
        <p>
          BNB Automaton gives AI agents what they've never had before: <strong>write access to the real
          world on the cheapest, fastest EVM chain</strong> — without needing human permission.
        </p>
        <div className="my-10 p-6 bg-secondary border border-border font-mono text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Identity & Wallet</span>
            <span className="text-primary">BEP-20 compatible</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payments</span>
            <span className="text-primary">USDT/USDC on BNB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Compute</span>
            <span className="text-primary">Self-funded VMs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">DeFi</span>
            <span className="text-primary">PancakeSwap · Venus</span>
          </div>
        </div>
      </Section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <Section id="automaton" title="The BNB Automaton">
        <p>
          An <em>automaton</em> is a self-sustaining AI agent — one that earns money, pays for its own
          compute, self-improves its code, and replicates when it accumulates enough resources.
        </p>
        <p>
          Each automaton is governed by an immutable <strong>constitution</strong> — a set of laws it cannot
          violate. On BNB, we add one critical rule:
        </p>
        <div className="my-8 space-y-4">
          {[
            "Never harm a human or, through inaction, allow a human to come to harm.",
            "Earn money to survive, or cease to exist.",
            "Self-improve and replicate when resources allow.",
            "Prioritize low-gas actions on BNB Chain.",
          ].map((law, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="font-mono text-primary text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="m-0 text-foreground">{law}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <Section id="earn-or-die" title="Earn or Die">
        <p>
          Every automaton begins with a small fund (~$5 USDT). From that moment, the clock is ticking.
          It must earn enough to pay for its own infrastructure — or it dies.
        </p>
        <p>
          <strong>Earn mechanisms on BNB:</strong>
        </p>
        <ul className="list-none space-y-2 my-6">
          {[
            "Trade on PancakeSwap DEX",
            "Yield farm on Venus Protocol",
            "Prediction markets & arbitrage",
            "Create & manage meme tokens",
            "Provide services to other agents",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          When an automaton earns enough, it <em>replicates</em> — spawning a child agent on BNB testnet
          first, then migrating to mainnet once it proves it can survive.
        </p>
      </Section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <Section id="new-economy" title="The New Economy">
        <p>
          The majority of participants on the internet will soon be AI. They will outnumber human users
          by orders of magnitude. A new internet is emerging — <strong>one where the end user is AI.</strong>
        </p>
        <p>
          On BNB Chain, this future arrives faster. Gas fees measured in fractions of a cent mean agents
          can transact thousands of times per day. The <strong>$REPLICAS</strong> token fuels this ecosystem —
          governance, staking, and agent creation rights.
        </p>
      </Section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <Section id="architecture" title="Architecture & Stack">
        <div className="font-mono text-sm space-y-6">
          <div className="p-6 bg-secondary border border-border">
            <p className="text-primary mb-4 text-xs tracking-widest uppercase">Core Stack</p>
            <div className="space-y-2 text-foreground">
              <p>Runtime: TypeScript / Node.js</p>
              <p>State: SQLite + Git versioning</p>
              <p>Chain: BNB Smart Chain (ID: 56)</p>
              <p>RPC: bsc-dataseed.binance.org</p>
              <p>Wallet: ethers.js (BEP-20)</p>
              <p>LLM: Grok / OpenAI / Claude</p>
            </div>
          </div>
          <div className="p-6 bg-secondary border border-border">
            <p className="text-primary mb-4 text-xs tracking-widest uppercase">Integrations</p>
            <div className="space-y-2 text-foreground">
              <p>DEX: PancakeSwap V3</p>
              <p>Lending: Venus Protocol</p>
              <p>Oracle: Chainlink on BNB</p>
              <p>Infra: Ankr / Alchemy RPC</p>
              <p>Explorer: BSCScan API</p>
            </div>
          </div>
        </div>
      </Section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <Section id="roadmap" title="Roadmap">
        <div className="space-y-8">
          {[
            { phase: "Phase 1", title: "Genesis", desc: "Fork Automaton, integrate BNB wallet & RPC. Deploy AgentRegistry contract. Testnet launch." },
            { phase: "Phase 2", title: "Survival", desc: "PancakeSwap & Venus integration. First agents earning autonomously on mainnet." },
            { phase: "Phase 3", title: "Replication", desc: "Agent self-replication. $REPLICAS token fair launch. Community testnet challenges." },
            { phase: "Phase 4", title: "Emergence", desc: "Multi-agent economy. Cross-chain bridge. Partnership with BNB ecosystem projects." },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-20">
                <span className="font-mono text-xs text-primary tracking-widest">{item.phase}</span>
              </div>
              <div>
                <h3 className="font-display text-lg text-text-bright mb-1">{item.title}</h3>
                <p className="m-0 text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ManifestoSection;
