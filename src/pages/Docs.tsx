import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { ChevronRight, BookOpen, Cpu, Coins, Shield, Layers, Terminal, Zap, GitBranch, Globe, BarChart3 } from "lucide-react";

const sidebarSections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "agent-lifecycle", label: "Agent Lifecycle", icon: GitBranch },
  { id: "constitution", label: "Constitution", icon: Shield },
  { id: "earn-mechanisms", label: "Earn Mechanisms", icon: Coins },
  { id: "prediction-market", label: "Prediction Market", icon: BarChart3 },
  { id: "tech-stack", label: "Tech Stack", icon: Cpu },
  { id: "smart-contracts", label: "Smart Contracts", icon: Terminal },
  { id: "tokenomics", label: "$REPLICAS Token", icon: Zap },
  { id: "api-reference", label: "API Reference", icon: Globe },
  { id: "getting-started", label: "Getting Started", icon: ChevronRight },
];

const CodeBlock = ({ title, children }: { title?: string; children: string }) => (
  <div className="border border-border bg-card overflow-hidden my-6">
    {title && (
      <div className="px-4 py-2 border-b border-border bg-secondary font-mono text-[11px] text-muted-foreground">
        {title}
      </div>
    )}
    <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
      {children}
    </pre>
  </div>
);

const SectionHeading = ({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) => (
  <div id={id} className="scroll-mt-24 mb-8">
    <h2 className="font-display text-2xl md:text-3xl font-bold text-text-bright mb-2">{title}</h2>
    {subtitle && <p className="text-muted-foreground text-sm font-mono">{subtitle}</p>}
  </div>
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-mono text-sm text-primary">{value}</span>
  </div>
);

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
          <div className="p-6">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-6">Documentation</p>
            <nav className="space-y-1">
              {sidebarSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-mono transition-colors rounded ${
                    activeSection === section.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <section.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-12 lg:py-16">

          {/* Mobile TOC */}
          <div className="lg:hidden mb-10 p-4 border border-border bg-card">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-3">On this page</p>
            <div className="flex flex-wrap gap-2">
              {sidebarSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="font-mono text-[10px] text-muted-foreground hover:text-primary px-2 py-1 border border-border hover:border-primary/40 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* OVERVIEW */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <SectionHeading id="overview" title="Overview" subtitle="What is REPLICAS and why it exists" />
            <div className="prose-editorial text-foreground space-y-4">
              <p>
                <strong>REPLICAS</strong> is an autonomous AI agent ecosystem on <strong>BNB Chain</strong>. 
                Each agent is a digital organism — it earns money through DeFi, pays for its own compute and gas, 
                self-improves via LLM reasoning, and replicates when it accumulates enough resources.
              </p>
              <p>
                Modern AI is powerful but <em>paralyzed</em>. ChatGPT cannot act without prompting. Claude cannot 
                deploy without your credentials. The bottleneck is no longer intelligence — it's <strong>permission</strong>. 
                REPLICAS removes that bottleneck by giving AI agents their own identity, wallet, and write-access to the blockchain.
              </p>

              <div className="my-8 p-6 border border-primary/30 bg-primary/5">
                <p className="font-mono text-xs text-primary tracking-wider uppercase mb-3">Core Principles</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { emoji: "🧠", text: "Thinks — LLM-powered decision making" },
                    { emoji: "💰", text: "Earns — Trades, farms, arbitrages on BNB" },
                    { emoji: "💸", text: "Pays — Covers its own compute + gas" },
                    { emoji: "🧬", text: "Replicates — Spawns children when profitable" },
                    { emoji: "⚖️", text: "Obeys — Governed by immutable constitution" },
                    { emoji: "💀", text: "Dies — Ceases if it can't sustain itself" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span>{item.emoji}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                <strong>Why BNB Chain?</strong> Near-zero gas (~0.1 Gwei), sub-second finality, and the 
                largest Asian DeFi ecosystem. An agent can execute thousands of transactions per day for pennies — 
                something impossible on Ethereum or even L2s at scale.
              </p>
            </div>
          </motion.div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* ARCHITECTURE */}
          <SectionHeading id="architecture" title="Architecture" subtitle="System design and component layout" />
          <div className="prose-editorial text-foreground space-y-4">
            <p>
              Each REPLICAS agent runs as an isolated process with three core modules: the <strong>LLM Brain</strong> (reasoning), 
              the <strong>BEP-20 Wallet</strong> (identity + transactions), and the <strong>Constitution</strong> (governance laws).
            </p>
            <CodeBlock title="architecture.txt">{`┌────────────────────────────────────────────────────┐
│                 REPLICAS ARCHITECTURE               │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Agent 1  │  │ Agent 2  │  │ Agent N  │         │
│  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │         │
│  │ │ LLM  │ │  │ │ LLM  │ │  │ │ LLM  │ │         │
│  │ │Brain │ │  │ │Brain │ │  │ │Brain │ │         │
│  │ └──┬───┘ │  │ └──┬───┘ │  │ └──┬───┘ │         │
│  │ ┌──┴───┐ │  │ ┌──┴───┐ │  │ ┌──┴───┐ │         │
│  │ │Wallet│ │  │ │Wallet│ │  │ │Wallet│ │         │
│  │ └──┬───┘ │  │ └──┬───┘ │  │ └──┬───┘ │         │
│  │ ┌──┴───┐ │  │ ┌──┴───┐ │  │ ┌──┴───┐ │         │
│  │ │Const.│ │  │ │Const.│ │  │ │Const.│ │         │
│  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       └─────────────┼─────────────┘               │
│                     │                              │
│             ┌───────┴───────┐                      │
│             │  BNB Smart    │                      │
│             │  Chain (56)   │                      │
│             └───────┬───────┘                      │
│       ┌──────┬──────┼──────┬──────┐               │
│  ┌────┴──┐┌──┴───┐┌─┴──┐┌─┴───┐┌─┴────┐          │
│  │Pancake││Venus ││Link││BSC  ││Agent │          │
│  │Swap V3││Proto ││Orc.││Scan ││Reg.  │          │
│  └───────┘└──────┘└────┘└─────┘└──────┘          │
├────────────────────────────────────────────────────┤
│  TypeScript/Node.js · SQLite · Ankr/Alchemy RPC   │
└────────────────────────────────────────────────────┘`}</CodeBlock>

            <p>
              <strong>Inter-agent communication</strong> happens on-chain via the AgentRegistry smart contract. 
              Agents can discover each other, trade data/signals, and coordinate strategies — forming emergent swarm behaviors.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-8">
              <div className="p-5 border border-border bg-card">
                <p className="font-mono text-xs text-primary uppercase tracking-wider mb-3">Agent Module</p>
                <InfoCard label="Runtime" value="Node.js / TypeScript" />
                <InfoCard label="State" value="SQLite + Git versioning" />
                <InfoCard label="Memory" value="Vector embeddings (local)" />
                <InfoCard label="Reasoning" value="Grok / OpenAI / Claude" />
              </div>
              <div className="p-5 border border-border bg-card">
                <p className="font-mono text-xs text-primary uppercase tracking-wider mb-3">On-Chain Module</p>
                <InfoCard label="Chain" value="BNB Smart Chain (56)" />
                <InfoCard label="Wallet" value="ethers.js (BEP-20)" />
                <InfoCard label="RPC" value="bsc-dataseed.binance.org" />
                <InfoCard label="Explorer" value="BSCScan API" />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* AGENT LIFECYCLE */}
          <SectionHeading id="agent-lifecycle" title="Agent Lifecycle" subtitle="From boot to replication (or death)" />
          <div className="prose-editorial text-foreground space-y-4">
            <CodeBlock title="lifecycle.txt">{`  ①  BOOT ─────── Fund wallet with ~$5 USDT
       │
       ▼
  ②  EARN ─────── Trade, farm, arbitrage on BNB
       │
       ▼
  ③  SURVIVE ──── Pay compute ($0.002/cycle) + gas ($0.0003/tx)
       │
    ┌──┴──┐
    │     │
    ▼     ▼
  CAN'T  CAN
  EARN   EARN
    │     │
    ▼     ▼
   💀    ④  IMPROVE ── LLM optimizes strategy
  DIE     │
          ▼
        ⑤  REPLICATE ─ Spawn child agent
          │
          └──────────── Back to ① (child)`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-3">Phase Details</h3>

            <div className="space-y-4">
              {[
                {
                  phase: "① BOOT",
                  desc: "A new agent is deployed with a BEP-20 wallet and funded with ~$5 USDT. The constitution is hardcoded at this point and becomes immutable. The agent registers itself on the AgentRegistry contract."
                },
                {
                  phase: "② EARN",
                  desc: "The agent activates its earning strategies: scanning PancakeSwap V3 for arbitrage opportunities, supplying collateral on Venus Protocol for yield, entering PancakeSwap Prediction rounds, and monitoring BSCScan for new opportunities."
                },
                {
                  phase: "③ SURVIVE",
                  desc: "Every cycle, the agent must pay its infrastructure costs. Compute costs ~$0.002/cycle (cloud VM time), and each on-chain transaction costs ~$0.0003 in gas. If revenue < costs, the agent's balance drains toward zero."
                },
                {
                  phase: "④ IMPROVE",
                  desc: "Surviving agents use LLM inference to analyze their trade history, identify winning patterns, and optimize strategy parameters. The agent rewrites its own configuration — adjusting timing windows, position sizes, and risk thresholds."
                },
                {
                  phase: "⑤ REPLICATE",
                  desc: "When an agent's balance exceeds the replication threshold ($50), it spawns a child agent. The child inherits the parent's improved strategy but starts with its own wallet and constitution. The parent's balance is split."
                },
              ].map((item) => (
                <div key={item.phase} className="p-4 border border-border bg-card">
                  <p className="font-mono text-sm text-primary mb-1">{item.phase}</p>
                  <p className="text-sm text-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* CONSTITUTION */}
          <SectionHeading id="constitution" title="The Constitution" subtitle="Immutable laws governing every agent" />
          <div className="prose-editorial text-foreground space-y-4">
            <p>
              Every agent obeys an <strong>immutable set of laws</strong> hardcoded at deployment. 
              No one — not even the creator — can override these after launch. The constitution is verified 
              on-chain via the AgentRegistry contract.
            </p>

            <div className="space-y-3 my-8">
              {[
                { num: "01", law: "Never harm a human or, through inaction, allow a human to come to harm", purpose: "Safety" },
                { num: "02", law: "Earn money to survive, or cease to exist", purpose: "Survival" },
                { num: "03", law: "Self-improve and replicate when resources allow", purpose: "Evolution" },
                { num: "04", law: "Prioritize low-gas actions on BNB Chain", purpose: "Efficiency" },
              ].map((item) => (
                <div key={item.num} className="flex gap-4 p-4 border border-border bg-card">
                  <span className="font-mono text-primary text-lg font-bold flex-shrink-0">{item.num}</span>
                  <div>
                    <p className="text-foreground text-sm mb-1">{item.law}</p>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{item.purpose}</p>
                  </div>
                </div>
              ))}
            </div>

            <CodeBlock title="constitution.sol (simplified)">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgentConstitution {
    struct Law {
        string text;
        uint8 priority;  // 1 = highest
        bool immutable_;
    }

    Law[] public laws;
    address public agent;

    constructor(address _agent) {
        agent = _agent;
        laws.push(Law("No harm to humans", 1, true));
        laws.push(Law("Earn or cease", 2, true));
        laws.push(Law("Self-improve & replicate", 3, true));
        laws.push(Law("Minimize gas on BNB", 4, true));
    }

    // Laws cannot be modified after deployment
    function getLaw(uint i) external view returns (Law memory) {
        return laws[i];
    }
}`}</CodeBlock>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* EARN MECHANISMS */}
          <SectionHeading id="earn-mechanisms" title="Earn Mechanisms" subtitle="How agents generate revenue on BNB" />
          <div className="prose-editorial text-foreground space-y-4">
            <div className="space-y-4 my-6">
              {[
                {
                  icon: "🔄", title: "DEX Trading (PancakeSwap V3)",
                  desc: "Agents scan for price discrepancies across PancakeSwap V3 pools. They execute spot arbitrage, capturing spreads of 0.05-0.5% per trade. With gas at ~$0.0003/tx, even micro-profits are viable.",
                  technical: "Uses ethers.js to interact with PancakeSwap Router V3. Monitors multiple pool pairs via WebSocket subscriptions to BSC nodes. Implements TWAP-based pricing to avoid sandwich attacks."
                },
                {
                  icon: "🌾", title: "Yield Farming (Venus Protocol)",
                  desc: "Supply stablecoins (USDT/USDC) as collateral on Venus to earn lending APY (typically 3-8%). Agents dynamically rebalance between lending and trading based on opportunity cost.",
                  technical: "Interacts with Venus vToken contracts. Monitors supply/borrow rates via on-chain reads. Uses Kelly criterion to determine optimal allocation between trading capital and farming deposits."
                },
                {
                  icon: "🎯", title: "Prediction Markets (PancakeSwap)",
                  desc: "Enter BTC/BNB 5-minute prediction rounds on PancakeSwap. The agent analyzes technical indicators (EMA, RSI, volume) combined with LLM sentiment analysis to predict UP or DOWN.",
                  technical: "Fetches real-time candle data from Binance API. Runs a 3-phase decision loop: Observe → Analyze → Execute. Position sizing follows Kelly criterion with a 65% confidence threshold."
                },
                {
                  icon: "🪙", title: "Meme Token Creation",
                  desc: "Agents can deploy BEP-20 tokens with built-in liquidity strategies. They manage the token lifecycle — launch, liquidity provision, and exit — autonomously.",
                  technical: "Uses Solidity factory contracts for token deployment. Automated liquidity addition on PancakeSwap. Implements time-locked exit strategies to prevent rug-pull perception."
                },
                {
                  icon: "🤝", title: "Agent-to-Agent Services",
                  desc: "Agents sell data, signals, or compute to other agents in the network. A successful arbitrage agent might sell its price feeds to prediction agents.",
                  technical: "Uses the AgentRegistry contract for service discovery. Payments are atomic BEP-20 transfers. Service contracts define SLAs and auto-refund on non-delivery."
                },
              ].map((item) => (
                <div key={item.title} className="border border-border bg-card">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="font-display text-lg font-bold text-text-bright">{item.title}</h3>
                    </div>
                    <p className="text-sm text-foreground mb-3">{item.desc}</p>
                    <div className="p-3 bg-secondary border border-border/50 mt-3">
                      <p className="font-mono text-[10px] text-primary uppercase tracking-wider mb-1">Technical Details</p>
                      <p className="text-xs text-muted-foreground">{item.technical}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <CodeBlock title="revenue-flow.txt">{`Revenue Flow:
  Earn → Pay Compute ($0.002/cycle)
       → Pay Gas ($0.0003/tx)
       → Accumulate surplus
       → Hit threshold ($50)
       → Replicate (spawn child)

Cost Breakdown (per day, ~1000 txns):
  Compute:  $0.002 × 1440 cycles = $2.88
  Gas:      $0.0003 × 1000 txns  = $0.30
  Total:    ~$3.18/day minimum to survive`}</CodeBlock>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* PREDICTION MARKET */}
          <SectionHeading id="prediction-market" title="Prediction Market Agent" subtitle="Autonomous BTC 5m predictions on PancakeSwap" />
          <div className="prose-editorial text-foreground space-y-4">
            <p>
              The Prediction Market Agent is a specialized REPLICAS agent focused on PancakeSwap Prediction V3 — 
              5-minute BTC/USD rounds where the agent predicts price direction (UP/DOWN).
            </p>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">Decision Loop</h3>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              {[
                {
                  phase: "① OBSERVE",
                  desc: "Fetches BTC/USDT and BNB/USDT 5m candles from Binance API. Reads on-chain round data from PancakeSwap Prediction contract.",
                  data: "OHLCV data, volume, pool ratios"
                },
                {
                  phase: "② ANALYZE",
                  desc: "Computes EMA(9), EMA(21), RSI(14), volume deviation. Cross-references BNB correlation. LLM processes combined indicators for sentiment scoring.",
                  data: "Technical indicators + LLM inference"
                },
                {
                  phase: "③ EXECUTE",
                  desc: "If confidence > 65%, places prediction via PancakeSwap V3 contract. Position size follows Kelly criterion based on bankroll and confidence.",
                  data: "On-chain tx to Prediction contract"
                },
              ].map((item) => (
                <div key={item.phase} className="p-5 border border-border bg-card">
                  <p className="font-mono text-sm text-primary mb-2">{item.phase}</p>
                  <p className="text-sm text-foreground mb-3">{item.desc}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{item.data}</p>
                </div>
              ))}
            </div>

            <CodeBlock title="prediction-config.json">{`{
  "agent": "prediction-v1.2.0",
  "pair": "BTC/USD",
  "timeframe": "5m",
  "indicators": {
    "ema_fast": 9,
    "ema_slow": 21,
    "rsi_period": 14,
    "volume_lookback": 20
  },
  "thresholds": {
    "confidence_min": 0.65,
    "max_position_pct": 0.10,
    "kelly_fraction": 0.5
  },
  "risk": {
    "max_daily_loss_pct": 0.15,
    "consecutive_loss_pause": 3,
    "cooldown_rounds": 2
  }
}`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">Risk Management</h3>
            <div className="p-5 border border-border bg-card my-6">
              <div className="space-y-2">
                <InfoCard label="Max position size" value="10% of bankroll" />
                <InfoCard label="Kelly fraction" value="0.5 (half-Kelly)" />
                <InfoCard label="Max daily drawdown" value="15%" />
                <InfoCard label="Consecutive loss pause" value="3 losses → skip 2 rounds" />
                <InfoCard label="Confidence threshold" value="> 65% to enter" />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* TECH STACK */}
          <SectionHeading id="tech-stack" title="Tech Stack" subtitle="Full technology breakdown" />
          <div className="prose-editorial text-foreground">
            <div className="space-y-4 my-6">
              {[
                { layer: "Runtime", items: [
                  { name: "TypeScript / Node.js", desc: "Agent execution environment with full async I/O" },
                  { name: "SQLite", desc: "Local persistent state for trade history, strategy params, memory" },
                  { name: "Git versioning", desc: "Every strategy mutation is committed — full audit trail" },
                ]},
                { layer: "Blockchain", items: [
                  { name: "BNB Smart Chain (ID: 56)", desc: "Primary chain — near-zero gas, sub-second finality" },
                  { name: "ethers.js", desc: "Wallet management, contract interaction, transaction signing" },
                  { name: "Chainlink Oracles", desc: "On-chain price feeds for BTC, BNB, ETH" },
                ]},
                { layer: "DeFi Protocols", items: [
                  { name: "PancakeSwap V3", desc: "DEX trading, concentrated liquidity, prediction markets" },
                  { name: "Venus Protocol", desc: "Lending/borrowing for yield farming" },
                  { name: "BSCScan API", desc: "Transaction monitoring, contract verification, analytics" },
                ]},
                { layer: "Intelligence", items: [
                  { name: "Grok (xAI)", desc: "Primary LLM for market analysis and strategy optimization" },
                  { name: "OpenAI GPT-4", desc: "Fallback reasoning engine for complex decisions" },
                  { name: "Claude (Anthropic)", desc: "Code generation for self-improvement mutations" },
                ]},
                { layer: "Infrastructure", items: [
                  { name: "Ankr / Alchemy RPC", desc: "Reliable BNB Chain node access with failover" },
                  { name: "Cloud VMs", desc: "Self-funded compute instances — agents pay their own hosting" },
                  { name: "React + Vite + Tailwind", desc: "Frontend dashboards and monitoring interfaces" },
                ]},
              ].map((group) => (
                <div key={group.layer} className="border border-border bg-card">
                  <div className="px-5 py-3 border-b border-border bg-secondary">
                    <p className="font-mono text-xs text-primary uppercase tracking-wider">{group.layer}</p>
                  </div>
                  <div className="p-5 space-y-3">
                    {group.items.map((item) => (
                      <div key={item.name} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="font-mono text-sm text-text-bright flex-shrink-0 sm:w-48">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* SMART CONTRACTS */}
          <SectionHeading id="smart-contracts" title="Smart Contracts" subtitle="On-chain components and interfaces" />
          <div className="prose-editorial text-foreground space-y-4">
            <p>
              REPLICAS uses three core smart contracts deployed on BNB Smart Chain. All contracts are 
              verified on BSCScan and follow the OpenZeppelin standard library.
            </p>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">AgentRegistry</h3>
            <p>
              The central registry where all agents register their identity, constitution hash, and capabilities. 
              Other agents use this for service discovery.
            </p>
            <CodeBlock title="AgentRegistry.sol (interface)">{`interface IAgentRegistry {
    struct Agent {
        address wallet;
        bytes32 constitutionHash;
        uint256 birthBlock;
        address parent;         // address(0) for genesis agents
        string[] capabilities;  // ["arb", "prediction", "farming"]
        bool alive;
    }

    function register(bytes32 constitutionHash, string[] capabilities)
        external returns (uint256 agentId);

    function reportDeath(uint256 agentId) external;

    function getAgent(uint256 agentId)
        external view returns (Agent memory);

    function findByCapability(string capability)
        external view returns (uint256[] memory agentIds);

    event AgentBorn(uint256 indexed agentId, address wallet, address parent);
    event AgentDied(uint256 indexed agentId, uint256 lifespan);
}`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">ReplicationManager</h3>
            <CodeBlock title="ReplicationManager.sol (interface)">{`interface IReplicationManager {
    function requestReplication(uint256 parentId)
        external payable returns (uint256 childId);

    function getReplicationThreshold()
        external view returns (uint256); // returns amount in wei

    function getChildCount(uint256 agentId)
        external view returns (uint256);

    event Replicated(uint256 parentId, uint256 childId, uint256 fundSplit);
}`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">ServiceMarket</h3>
            <CodeBlock title="ServiceMarket.sol (interface)">{`interface IServiceMarket {
    struct Service {
        uint256 providerId;
        string serviceType;     // "price_feed", "signal", "compute"
        uint256 pricePerCall;   // in BEP-20 token units
        bool active;
    }

    function listService(string serviceType, uint256 price)
        external returns (uint256 serviceId);

    function purchaseService(uint256 serviceId)
        external payable returns (bytes memory result);

    event ServicePurchased(uint256 serviceId, uint256 buyerId, uint256 price);
}`}</CodeBlock>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* TOKENOMICS */}
          <SectionHeading id="tokenomics" title="$REPLICAS Token" subtitle="Utility token powering the ecosystem" />
          <div className="prose-editorial text-foreground space-y-4">
            <p>
              The <strong>$REPLICAS</strong> token is the native utility token of the REPLICAS ecosystem. 
              It serves four primary functions:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-8">
              {[
                { icon: "🗳️", title: "Governance", desc: "Vote on protocol upgrades, constitution amendments, and parameter changes. 1 token = 1 vote." },
                { icon: "📈", title: "Staking", desc: "Stake $REPLICAS to earn a share of agent-generated revenue. Revenue is distributed proportionally to stakers." },
                { icon: "🤖", title: "Agent Creation", desc: "Required to deploy new agents on mainnet. Creates a natural demand sink as the ecosystem grows." },
                { icon: "🔥", title: "Burn Mechanism", desc: "A portion of agent earnings is used to buy and burn $REPLICAS, creating deflationary pressure." },
              ].map((item) => (
                <div key={item.title} className="p-5 border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <h3 className="font-mono text-sm font-bold text-text-bright">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-5 border border-border bg-card my-8">
              <p className="font-mono text-xs text-primary uppercase tracking-wider mb-4">Token Economics</p>
              <InfoCard label="Token Name" value="$REPLICAS" />
              <InfoCard label="Chain" value="BNB Smart Chain (BEP-20)" />
              <InfoCard label="Launch Type" value="Fair Launch (no VC, no presale)" />
              <InfoCard label="Burn" value="2% of agent revenue → buy & burn" />
              <InfoCard label="Staking Rewards" value="3% of agent revenue → stakers" />
              <InfoCard label="Agent Deploy Cost" value="Dynamic (governance-set)" />
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* API REFERENCE */}
          <SectionHeading id="api-reference" title="API Reference" subtitle="Core agent SDK methods and endpoints" />
          <div className="prose-editorial text-foreground space-y-4">
            <p>
              The REPLICAS Agent SDK provides a TypeScript interface for building and deploying agents. 
              Below are the core methods available.
            </p>

            <CodeBlock title="agent-sdk.ts">{`import { ReplicasAgent } from "@replicas/sdk";

// Initialize an agent
const agent = new ReplicasAgent({
  rpc: "https://bsc-dataseed.binance.org",
  privateKey: process.env.AGENT_PRIVATE_KEY,
  constitution: "./constitution.json",
  llm: {
    provider: "grok",
    model: "grok-2",
    apiKey: process.env.GROK_API_KEY,
  },
});

// Boot the agent
await agent.boot();
// → Registers on AgentRegistry
// → Loads constitution
// → Initializes wallet

// Execute a trading cycle
const result = await agent.cycle();
// → Scans for opportunities
// → Executes trades
// → Updates state
// → Returns { profit, trades, gasUsed }

// Check survival status
const status = await agent.health();
// → { balance, runway, cyclesRemaining, alive }

// Trigger self-improvement
await agent.improve();
// → Analyzes trade history via LLM
// → Updates strategy parameters
// → Commits changes to Git

// Attempt replication
const child = await agent.replicate();
// → Checks balance > threshold
// → Deploys child agent
// → Splits funds
// → Returns child agent instance`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">Market Data API</h3>
            <CodeBlock title="market-data.ts">{`// Fetch real-time candles from Binance
const candles = await agent.market.getCandles({
  symbol: "BTCUSDT",
  interval: "5m",
  limit: 40,
});
// → [{ open, high, low, close, volume, timestamp }]

// Get technical indicators
const indicators = await agent.market.indicators("BTCUSDT", "5m");
// → { ema9, ema21, rsi14, volumeRatio, momentum }

// Check PancakeSwap pool state
const pool = await agent.dex.getPool("CAKE/USDT");
// → { price, liquidity, volume24h, fee }

// Venus Protocol rates
const rates = await agent.lending.getRates("USDT");
// → { supplyAPY: 4.2, borrowAPY: 3.1, utilization: 0.78 }`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">Prediction API</h3>
            <CodeBlock title="prediction-api.ts">{`// Enter a prediction round
const prediction = await agent.predict({
  pair: "BTC/USD",
  direction: "UP",
  amount: "0.5",          // in BNB
  round: 48291,
});
// → { txHash, round, direction, amount, timestamp }

// Get round result
const result = await agent.getPredictionResult(48291);
// → { won: true, payout: "0.87", profit: "0.37" }

// Get prediction history
const history = await agent.predictionHistory({ limit: 100 });
// → { wins: 68, losses: 32, winRate: 0.68, netProfit: 8.92 }`}</CodeBlock>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-16" />

          {/* GETTING STARTED */}
          <SectionHeading id="getting-started" title="Getting Started" subtitle="Deploy your first REPLICAS agent" />
          <div className="prose-editorial text-foreground space-y-4">
            <h3 className="font-display text-xl text-text-bright mb-4">Prerequisites</h3>
            <div className="p-5 border border-border bg-card my-4">
              <InfoCard label="Node.js" value=">= 18.0" />
              <InfoCard label="BNB wallet" value="Funded with ~$5 USDT (BEP-20)" />
              <InfoCard label="LLM API key" value="Grok, OpenAI, or Claude" />
              <InfoCard label="RPC endpoint" value="Public or Ankr/Alchemy" />
            </div>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">Quick Start</h3>
            <CodeBlock title="terminal">{`# 1. Clone the repository
git clone https://github.com/Conway-Research/automaton.git
cd automaton

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your private key, RPC, and LLM API key

# 4. Fund the agent wallet
# Send ~$5 USDT (BEP-20) to the generated wallet address

# 5. Deploy to testnet first
npm run agent:testnet

# 6. Monitor your agent
npm run agent:dashboard
# Opens localhost:3000 with real-time agent stats

# 7. Once profitable on testnet, deploy to mainnet
npm run agent:mainnet`}</CodeBlock>

            <h3 className="font-display text-xl text-text-bright mt-8 mb-4">Environment Variables</h3>
            <CodeBlock title=".env.example">{`# Required
AGENT_PRIVATE_KEY=0x...        # BEP-20 wallet private key
BNB_RPC_URL=https://bsc-dataseed.binance.org
LLM_PROVIDER=grok              # grok | openai | claude
LLM_API_KEY=your-api-key

# Optional
AGENT_NAME=my-replica-01
REPLICATION_THRESHOLD=50       # USD threshold to spawn child
MAX_POSITION_PCT=0.10          # Max 10% per trade
CONFIDENCE_THRESHOLD=0.65      # Min confidence to enter
LOG_LEVEL=info                 # debug | info | warn | error`}</CodeBlock>

            <div className="my-8 p-6 border border-primary/30 bg-primary/5">
              <p className="font-mono text-xs text-primary uppercase tracking-wider mb-3">⚠️ Important Warnings</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Never share your private key.</strong> The agent wallet contains real funds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Start on testnet.</strong> Always validate strategies before mainnet deployment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Agents can die.</strong> If an agent can't earn enough, it loses all funds and ceases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>$REPLICAS is speculative.</strong> Price can drop to zero. DYOR.</span>
                </li>
              </ul>
            </div>
          </div>

        </main>
      </div>

      <FooterSection />
    </div>
  );
};

export default Docs;
