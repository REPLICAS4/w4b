import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Brain, Wallet, Shield, BarChart3, Zap, Globe, Database, MessageSquare, GitBranch, Cpu } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  llm: Brain,
  wallet: Wallet,
  constitution: Shield,
  strategy: BarChart3,
  dex: Zap,
  oracle: Globe,
  memory: Database,
  comms: MessageSquare,
  replication: GitBranch,
  compute: Cpu,
};

const colorMap: Record<string, string> = {
  llm: "border-purple-400/50 bg-purple-500/5",
  wallet: "border-amber-400/50 bg-amber-500/5",
  constitution: "border-red-400/50 bg-red-500/5",
  strategy: "border-emerald-400/50 bg-emerald-500/5",
  dex: "border-blue-400/50 bg-blue-500/5",
  oracle: "border-cyan-400/50 bg-cyan-500/5",
  memory: "border-orange-400/50 bg-orange-500/5",
  comms: "border-pink-400/50 bg-pink-500/5",
  replication: "border-violet-400/50 bg-violet-500/5",
  compute: "border-slate-400/50 bg-slate-500/5",
};

const iconColorMap: Record<string, string> = {
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

export type AgentNodeData = {
  label: string;
  category: string;
  description: string;
  config?: Record<string, string>;
};

const AgentNode = ({ data, selected }: NodeProps & { data: AgentNodeData }) => {
  const Icon = iconMap[data.category] || Brain;
  const borderColor = colorMap[data.category] || "border-border bg-card";
  const iconColor = iconColorMap[data.category] || "text-primary";

  return (
    <div
      className={`min-w-[200px] max-w-[240px] border-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 ${borderColor} ${
        selected ? "ring-2 ring-primary shadow-xl scale-[1.02]" : ""
      }`}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/50">
        <div className={`p-1.5 rounded-md bg-background/80 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-semibold text-foreground truncate">{data.label}</p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{data.category}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        <p className="text-[11px] text-muted-foreground leading-relaxed">{data.description}</p>
        {data.config && Object.keys(data.config).length > 0 && (
          <div className="mt-2 space-y-1">
            {Object.entries(data.config).map(([key, value]) => (
              <div key={key} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground font-mono">{key}</span>
                <span className="text-primary font-mono font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
    </div>
  );
};

export default memo(AgentNode);
