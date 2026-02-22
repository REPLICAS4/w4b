import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface LogEntry {
  time: string;
  type: "info" | "success" | "warn" | "action" | "system";
  message: string;
}

const AGENT_LOGS: LogEntry[] = [
  { time: "00:00:01", type: "system", message: "Booting BNB Automaton v0.4.2..." },
  { time: "00:00:02", type: "system", message: "Loading constitution... 4 laws verified ✓" },
  { time: "00:00:03", type: "info", message: "Generating BEP-20 wallet... 0x7a3F...c9E1" },
  { time: "00:00:04", type: "success", message: "Identity registered on AgentRegistry (tx: 0xab12...f8d3)" },
  { time: "00:00:05", type: "info", message: "Initial fund received: 5.00 USDT (BEP-20)" },
  { time: "00:00:06", type: "system", message: "Connecting to bsc-dataseed.binance.org... OK" },
  { time: "00:00:08", type: "action", message: "Scanning PancakeSwap V3 pools for arbitrage..." },
  { time: "00:00:11", type: "info", message: "Found opportunity: CAKE/USDT spread 0.12% across pools" },
  { time: "00:00:12", type: "action", message: "Executing swap: 2.50 USDT → 0.847 CAKE (gas: 0.0003 BNB)" },
  { time: "00:00:14", type: "success", message: "Swap confirmed ✓ (block #48,291,037)" },
  { time: "00:00:16", type: "action", message: "Executing swap: 0.847 CAKE → 2.53 USDT" },
  { time: "00:00:18", type: "success", message: "Profit: +$0.03 | Balance: 5.03 USDT" },
  { time: "00:00:20", type: "info", message: "Querying Venus Protocol for lending rates..." },
  { time: "00:00:22", type: "info", message: "USDT supply APY: 4.2% | USDC borrow APY: 3.1%" },
  { time: "00:00:24", type: "action", message: "Depositing 3.00 USDT to Venus as collateral..." },
  { time: "00:00:27", type: "success", message: "Deposit confirmed ✓ | vUSDT minted: 142.38" },
  { time: "00:00:30", type: "system", message: "Self-improvement check: analyzing trade history..." },
  { time: "00:00:33", type: "info", message: "LLM inference (Grok): optimizing swap timing strategy" },
  { time: "00:00:36", type: "success", message: "Strategy updated: prefer high-volume hours (UTC 8-12)" },
  { time: "00:00:38", type: "action", message: "Scanning BSCScan for new token listings..." },
  { time: "00:00:41", type: "warn", message: "Token 0xdead...beef flagged as honeypot — skipping" },
  { time: "00:00:43", type: "info", message: "Monitoring gas: 0.8 Gwei — optimal for batch txns" },
  { time: "00:00:45", type: "action", message: "Executing 3 micro-arb trades in batch..." },
  { time: "00:00:49", type: "success", message: "Batch complete ✓ | Net profit: +$0.07 | Balance: 5.10 USDT" },
  { time: "00:00:52", type: "system", message: "Compute cost this cycle: $0.002 (infra) + $0.0003 (gas)" },
  { time: "00:00:54", type: "success", message: "Net earnings: +$0.0677 — SURVIVED this cycle ✓" },
  { time: "00:00:56", type: "info", message: "Replication threshold: $50.00 | Progress: 10.2%" },
  { time: "00:00:58", type: "system", message: "Scheduling next cycle in 60s... idle." },
  { time: "00:01:00", type: "system", message: "── cycle complete ── restarting loop ──" },
];

const typeColors: Record<LogEntry["type"], string> = {
  system: "text-muted-foreground",
  info: "text-foreground",
  success: "text-primary",
  warn: "text-amber-400",
  action: "text-sky-400",
};

const typeLabels: Record<LogEntry["type"], string> = {
  system: "SYS",
  info: "INF",
  success: "OK ",
  warn: "WRN",
  action: "ACT",
};

const TerminalDemo = () => {
  const [lines, setLines] = useState<LogEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next > AGENT_LOGS.length) {
          // Loop
          setLines([]);
          return 0;
        }
        setLines(AGENT_LOGS.slice(0, next));
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Auto-start when in view
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRunning) setIsRunning(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isRunning]);

  return (
    <motion.section
      ref={sectionRef}
      id="live-demo"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 max-w-3xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-4">
        Live Agent Terminal
      </h2>
      <p className="text-muted-foreground mb-8 text-sm">
        Simulated output of a BNB Automaton agent earning, trading, and surviving autonomously.
      </p>

      {/* Terminal window */}
      <div className="border border-border bg-card overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground ml-2">
            bnb-automaton — agent-0x7a3F
          </span>
          <div className="ml-auto flex items-center gap-2">
            {isRunning && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                <span className="font-mono text-[10px] text-primary">LIVE</span>
              </span>
            )}
          </div>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="p-4 h-[420px] overflow-y-auto font-mono text-xs leading-relaxed scrollbar-thin"
        >
          {lines.length === 0 && isRunning && (
            <span className="text-muted-foreground animate-pulse">Initializing...</span>
          )}
          {lines.map((log, i) => (
            <div
              key={`${i}-${log.time}`}
              className="flex gap-3 mb-1 animate-fade-in"
            >
              <span className="text-muted-foreground/50 flex-shrink-0 w-[68px]">
                {log.time}
              </span>
              <span
                className={`flex-shrink-0 w-[30px] font-semibold ${typeColors[log.type]}`}
              >
                {typeLabels[log.type]}
              </span>
              <span className={typeColors[log.type]}>{log.message}</span>
            </div>
          ))}
          {/* Blinking cursor */}
          {isRunning && currentIndex < AGENT_LOGS.length && (
            <span className="inline-block w-2 h-3.5 bg-primary/80 animate-pulse ml-[102px]" />
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary font-mono text-[10px] text-muted-foreground">
          <span>Chain: BNB (56) · Gas: 0.8 Gwei</span>
          <span>Balance: {currentIndex >= 24 ? "5.10" : currentIndex >= 12 ? "5.03" : "5.00"} USDT</span>
          <span>Cycle: {currentIndex >= AGENT_LOGS.length ? "complete" : "active"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => {
            setIsRunning(false);
            setLines([]);
            setCurrentIndex(0);
            setTimeout(() => setIsRunning(true), 100);
          }}
          className="font-mono text-xs px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          ↻ Restart
        </button>
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="font-mono text-xs px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {isRunning ? "❚❚ Pause" : "▶ Resume"}
        </button>
      </div>
    </motion.section>
  );
};

export default TerminalDemo;
