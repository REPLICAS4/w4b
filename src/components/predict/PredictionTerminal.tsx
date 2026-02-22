import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface LogEntry {
  time: string;
  type: "info" | "success" | "warn" | "action" | "system";
  message: string;
}

const PREDICTION_LOGS: LogEntry[] = [
  { time: "00:00:01", type: "system", message: "Booting Prediction Agent v1.2.0..." },
  { time: "00:00:02", type: "system", message: "Connecting to PancakeSwap Prediction V3..." },
  { time: "00:00:03", type: "info", message: "Fetching BTC/USD 5m candles from Binance..." },
  { time: "00:00:04", type: "info", message: "Last close: $67,241 | EMA(9): $67,180 | RSI(14): 58.3" },
  { time: "00:00:06", type: "action", message: "Calculating momentum score... +0.42 (bullish bias)" },
  { time: "00:00:08", type: "info", message: "Volume spike detected: 1.8x avg on last 3 candles" },
  { time: "00:00:10", type: "action", message: "LLM inference: 72% confidence → UP prediction" },
  { time: "00:00:12", type: "action", message: "Placing bet: 0.5 BNB on UP (Round #48291)" },
  { time: "00:00:14", type: "success", message: "Bet confirmed ✓ (tx: 0xc3f1...a82d)" },
  { time: "00:00:16", type: "system", message: "Waiting for round resolution... 4:38 remaining" },
  { time: "00:04:55", type: "info", message: "Round #48291 closing... BTC: $67,241 → $67,389" },
  { time: "00:05:00", type: "success", message: "Round WON ✓ | Payout: 0.87 BNB (+0.37 BNB profit)" },
  { time: "00:05:02", type: "info", message: "Session: 8W / 4L | Win rate: 66.7% | Net: +1.24 BNB" },
  { time: "00:05:04", type: "action", message: "Analyzing next round... scanning new candle data" },
  { time: "00:05:06", type: "system", message: "── round complete ── next prediction in 30s ──" },
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

const PredictionTerminal = () => {
  const [lines, setLines] = useState<LogEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next > PREDICTION_LOGS.length) {
          setLines([]);
          return 0;
        }
        setLines(PREDICTION_LOGS.slice(0, next));
        return next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isRunning) setIsRunning(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isRunning]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-16 max-w-3xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-2">
        Agent Decision Terminal
      </h2>
      <p className="text-muted-foreground text-sm mb-8 font-mono">
        Live prediction agent reasoning and execution log
      </p>

      <div className="border border-border bg-card overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground ml-2">
            prediction-agent — BTC/USD 5m
          </span>
          {isRunning && (
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] text-primary">LIVE</span>
            </span>
          )}
        </div>

        {/* Terminal body */}
        <div ref={scrollRef} className="p-4 h-[380px] overflow-y-auto font-mono text-xs leading-relaxed">
          {lines.length === 0 && isRunning && (
            <span className="text-muted-foreground animate-pulse">Initializing...</span>
          )}
          {lines.map((log, i) => (
            <div key={`${i}-${log.time}`} className="flex gap-3 mb-1">
              <span className="text-muted-foreground/50 flex-shrink-0 w-[68px]">{log.time}</span>
              <span className={`flex-shrink-0 w-[30px] font-semibold ${typeColors[log.type]}`}>
                {typeLabels[log.type]}
              </span>
              <span className={typeColors[log.type]}>{log.message}</span>
            </div>
          ))}
          {isRunning && currentIndex < PREDICTION_LOGS.length && (
            <span className="inline-block w-2 h-3.5 bg-primary/80 animate-pulse ml-[102px]" />
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary font-mono text-[10px] text-muted-foreground">
          <span>PancakeSwap V3 · BTC/USD</span>
          <span>Round: #{currentIndex >= 12 ? "48292" : "48291"}</span>
          <span>{isRunning ? "● Active" : "○ Idle"}</span>
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

export default PredictionTerminal;
