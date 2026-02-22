import { Brain, Wallet, Shield, BarChart3, Zap, Globe, Database, MessageSquare, GitBranch, Cpu } from "lucide-react";

export type NodeTemplate = {
  category: string;
  label: string;
  description: string;
  icon: React.ElementType;
  config?: Record<string, string>;
};

const nodeTemplates: NodeTemplate[] = [
  {
    category: "llm",
    label: "LLM Brain",
    description: "AI reasoning engine — Grok, OpenAI, or Claude",
    icon: Brain,
    config: { provider: "grok", model: "grok-2" },
  },
  {
    category: "wallet",
    label: "BEP-20 Wallet",
    description: "On-chain identity, signs & broadcasts transactions",
    icon: Wallet,
    config: { chain: "BNB (56)", type: "BEP-20" },
  },
  {
    category: "constitution",
    label: "Constitution",
    description: "Immutable laws hardcoded at birth — cannot be overridden",
    icon: Shield,
    config: { laws: "4", immutable: "true" },
  },
  {
    category: "strategy",
    label: "Strategy Engine",
    description: "Trading logic — arbitrage, farming, prediction markets",
    icon: BarChart3,
    config: { mode: "adaptive", risk: "medium" },
  },
  {
    category: "dex",
    label: "DEX Connector",
    description: "PancakeSwap V3 integration for swaps & liquidity",
    icon: Zap,
    config: { protocol: "PancakeSwap V3" },
  },
  {
    category: "oracle",
    label: "Price Oracle",
    description: "Chainlink feeds for real-time market data on BNB",
    icon: Globe,
    config: { source: "Chainlink" },
  },
  {
    category: "memory",
    label: "Memory Store",
    description: "SQLite + vector embeddings for persistent agent memory",
    icon: Database,
    config: { engine: "SQLite", vectors: "on" },
  },
  {
    category: "comms",
    label: "Agent Comms",
    description: "Inter-agent messaging via AgentRegistry contract",
    icon: MessageSquare,
    config: { protocol: "on-chain" },
  },
  {
    category: "replication",
    label: "Replication Module",
    description: "Spawns child agents when balance exceeds threshold",
    icon: GitBranch,
    config: { threshold: "$50" },
  },
  {
    category: "compute",
    label: "Compute Manager",
    description: "Manages VM lifecycle & auto-pays infrastructure costs",
    icon: Cpu,
    config: { cost: "$0.002/cycle" },
  },
];

const categoryColors: Record<string, string> = {
  llm: "border-purple-400/40 hover:border-purple-400/70 hover:bg-purple-500/5",
  wallet: "border-amber-400/40 hover:border-amber-400/70 hover:bg-amber-500/5",
  constitution: "border-red-400/40 hover:border-red-400/70 hover:bg-red-500/5",
  strategy: "border-emerald-400/40 hover:border-emerald-400/70 hover:bg-emerald-500/5",
  dex: "border-blue-400/40 hover:border-blue-400/70 hover:bg-blue-500/5",
  oracle: "border-cyan-400/40 hover:border-cyan-400/70 hover:bg-cyan-500/5",
  memory: "border-orange-400/40 hover:border-orange-400/70 hover:bg-orange-500/5",
  comms: "border-pink-400/40 hover:border-pink-400/70 hover:bg-pink-500/5",
  replication: "border-violet-400/40 hover:border-violet-400/70 hover:bg-violet-500/5",
  compute: "border-slate-400/40 hover:border-slate-400/70 hover:bg-slate-500/5",
};

const iconColors: Record<string, string> = {
  llm: "text-purple-500",
  wallet: "text-amber-500",
  constitution: "text-red-500",
  strategy: "text-emerald-500",
  dex: "text-blue-500",
  oracle: "text-cyan-500",
  memory: "text-orange-500",
  comms: "text-pink-500",
  replication: "text-violet-500",
  compute: "text-slate-500",
};

interface BuilderSidebarProps {
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void;
}

const BuilderSidebar = ({ onDragStart }: BuilderSidebarProps) => {
  return (
    <aside className="w-72 border-r border-border bg-card/50 h-full overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-border">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-1">Components</p>
        <p className="text-[11px] text-muted-foreground">Drag & drop to canvas</p>
      </div>

      <div className="p-3 space-y-2">
        {nodeTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.category}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
              className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
                categoryColors[template.category] || "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <Icon className={`w-4 h-4 flex-shrink-0 ${iconColors[template.category] || "text-primary"}`} />
                <span className="font-mono text-xs font-semibold text-foreground">{template.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed pl-[26px]">
                {template.description}
              </p>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default BuilderSidebar;
