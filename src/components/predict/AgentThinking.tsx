import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface ThinkingStep {
  phase: "observe" | "analyze" | "decide" | "execute";
  text: string;
}

const THINKING_SEQUENCES: ThinkingStep[][] = [
  [
    { phase: "observe", text: "Reading BTC/USDT 5m candle... close=$67,389 vol=142.3 BTC" },
    { phase: "observe", text: "Reading BNB/USDT 5m candle... close=$612.40 vol=8,241 BNB" },
    { phase: "analyze", text: "EMA(9) crossed above EMA(21) — bullish signal on BTC" },
    { phase: "analyze", text: "RSI(14) = 58.3 — neutral zone, no divergence detected" },
    { phase: "analyze", text: "Volume 1.8x above 20-period avg — momentum confirmed" },
    { phase: "analyze", text: "BNB correlation: +0.82 with BTC — aligned trend" },
    { phase: "decide", text: "Confidence score: 72% → threshold met (>65%)" },
    { phase: "decide", text: "Position sizing: 0.5 BNB (5% of bankroll) — Kelly criterion" },
    { phase: "decide", text: "Decision: UP on BTC 5m round #48291" },
    { phase: "execute", text: "Submitting prediction to PancakeSwap V3..." },
    { phase: "execute", text: "Transaction confirmed ✓ — waiting for round result" },
  ],
  [
    { phase: "observe", text: "Reading BTC/USDT 5m candle... close=$67,195 vol=98.7 BTC" },
    { phase: "observe", text: "Reading BNB/USDT 5m candle... close=$609.80 vol=6,102 BNB" },
    { phase: "analyze", text: "Price rejected from resistance at $67,400 — bearish wick" },
    { phase: "analyze", text: "RSI(14) = 64.1 — approaching overbought territory" },
    { phase: "analyze", text: "Volume declining on last 3 candles — weakening momentum" },
    { phase: "analyze", text: "BNB showing divergence: down while BTC sideways" },
    { phase: "decide", text: "Confidence score: 68% → threshold met (>65%)" },
    { phase: "decide", text: "Position sizing: 0.3 BNB (3% of bankroll) — lower confidence" },
    { phase: "decide", text: "Decision: DOWN on BTC 5m round #48292" },
    { phase: "execute", text: "Submitting prediction to PancakeSwap V3..." },
    { phase: "execute", text: "Transaction confirmed ✓ — waiting for round result" },
  ],
];

const phaseColors: Record<ThinkingStep["phase"], string> = {
  observe: "text-sky-400",
  analyze: "text-amber-400",
  decide: "text-primary",
  execute: "text-primary",
};

const phaseLabels: Record<ThinkingStep["phase"], string> = {
  observe: "👁 OBSERVE",
  analyze: "🧠 ANALYZE",
  decide: "⚡ DECIDE",
  execute: "🚀 EXECUTE",
};

const AgentThinking = () => {
  const [seqIndex, setSeqIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<ThinkingStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentSeq = THINKING_SEQUENCES[seqIndex % THINKING_SEQUENCES.length];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next > currentSeq.length) {
          // Move to next sequence after pause
          setTimeout(() => {
            setSeqIndex((s) => s + 1);
            setStepIndex(0);
            setVisibleSteps([]);
          }, 2000);
          clearInterval(interval);
          return prev;
        }
        setVisibleSteps(currentSeq.slice(0, next));
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning, seqIndex, currentSeq]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleSteps]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isRunning) setIsRunning(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isRunning]);

  // Current phase for progress indicator
  const currentPhase = visibleSteps.length > 0 ? visibleSteps[visibleSteps.length - 1].phase : null;
  const phases: ThinkingStep["phase"][] = ["observe", "analyze", "decide", "execute"];

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="py-16 max-w-3xl mx-auto px-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <Brain className="w-6 h-6 text-primary" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright">
          Agent Thinking
        </h2>
      </div>
      <p className="text-muted-foreground text-sm mb-8 font-mono">
        Watch the agent's real-time reasoning process as it analyzes market data
      </p>

      {/* Phase progress bar */}
      <div className="flex items-center gap-1 mb-6">
        {phases.map((phase, i) => {
          const phaseIdx = currentPhase ? phases.indexOf(currentPhase) : -1;
          const isActive = i <= phaseIdx;
          return (
            <div key={phase} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1 w-full rounded-full transition-all duration-500 ${
                  isActive ? "bg-primary" : "bg-border"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground/50"
                }`}
              >
                {phase}
              </span>
            </div>
          );
        })}
      </div>

      {/* Thinking log */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary">
          <Brain className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[11px] text-muted-foreground">
            agent-reasoning — round #{48291 + (seqIndex % 2)}
          </span>
          {isRunning && (
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] text-primary">THINKING</span>
            </span>
          )}
        </div>

        <div ref={scrollRef} className="p-4 h-[320px] overflow-y-auto font-mono text-xs leading-relaxed">
          {visibleSteps.length === 0 && isRunning && (
            <span className="text-muted-foreground animate-pulse">Agent initializing reasoning engine...</span>
          )}
          {visibleSteps.map((step, i) => (
            <motion.div
              key={`${seqIndex}-${i}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 mb-2"
            >
              <span className={`flex-shrink-0 font-semibold ${phaseColors[step.phase]}`}>
                {phaseLabels[step.phase]}
              </span>
              <span className="text-foreground">{step.text}</span>
            </motion.div>
          ))}
          {isRunning && stepIndex < currentSeq.length && (
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <span className="inline-block w-2 h-3.5 bg-primary/80 animate-pulse" />
              <span className="animate-pulse text-[10px]">processing...</span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default AgentThinking;
