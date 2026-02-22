import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isUp: boolean;
}

const PAIRS = [
  { symbol: "BTCUSDT", label: "BTC/USDT" },
  { symbol: "BNBUSDT", label: "BNB/USDT" },
];

const fetchKlines = async (symbol: string): Promise<CandleData[]> => {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=40`
  );
  const raw = await res.json();
  return raw.map((k: any[]) => {
    const open = parseFloat(k[1]);
    const high = parseFloat(k[2]);
    const low = parseFloat(k[3]);
    const close = parseFloat(k[4]);
    const volume = parseFloat(k[5]);
    const date = new Date(k[0]);
    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return { time, open, high, low, close, volume, isUp: close >= open };
  });
};

const CHART_H = 360;
const CHART_PAD = { top: 16, right: 50, bottom: 28, left: 10 };

const CandlestickChart = ({ data, pair }: { data: CandleData[]; pair: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: CandleData } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!data.length) return null;

  const allLow = Math.min(...data.map((d) => d.low));
  const allHigh = Math.max(...data.map((d) => d.high));
  const priceRange = allHigh - allLow || 1;
  const padded = priceRange * 0.05;
  const pMin = allLow - padded;
  const pMax = allHigh + padded;
  const pRange = pMax - pMin;

  const plotW = width - CHART_PAD.left - CHART_PAD.right;
  const plotH = CHART_H - CHART_PAD.top - CHART_PAD.bottom;
  const candleW = Math.max(3, (plotW / data.length) * 0.6);
  const gap = plotW / data.length;

  const priceToY = (p: number) => CHART_PAD.top + plotH - ((p - pMin) / pRange) * plotH;

  // Y-axis ticks
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount }, (_, i) => pMin + (pRange * i) / (tickCount - 1));

  const isBTC = pair.includes("BTC");
  const formatPrice = (v: number) =>
    isBTC ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(1)}`;

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg
        width={Math.max(width, 600)}
        height={CHART_H}
        className="select-none"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={CHART_PAD.left}
              x2={width - CHART_PAD.right}
              y1={priceToY(t)}
              y2={priceToY(t)}
              stroke="hsl(220, 10%, 90%)"
              strokeWidth={0.5}
            />
            <text
              x={width - CHART_PAD.right + 6}
              y={priceToY(t) + 3}
              fill="hsl(220, 10%, 45%)"
              fontSize={10}
              fontFamily="var(--font-mono)"
            >
              {formatPrice(t)}
            </text>
          </g>
        ))}

        {/* Candles */}
        {data.map((d, i) => {
          const cx = CHART_PAD.left + gap * i + gap / 2;
          const bodyTop = priceToY(Math.max(d.open, d.close));
          const bodyBot = priceToY(Math.min(d.open, d.close));
          const bodyH = Math.max(bodyBot - bodyTop, 1);
          const color = d.isUp ? "hsl(45, 96%, 48%)" : "hsl(0, 84%, 60%)";

          return (
            <g
              key={i}
              onMouseEnter={(e) => setTooltip({ x: cx, y: bodyTop - 10, d })}
              onMouseLeave={() => setTooltip(null)}
              className="cursor-crosshair"
            >
              {/* Wick */}
              <line
                x1={cx}
                x2={cx}
                y1={priceToY(d.high)}
                y2={priceToY(d.low)}
                stroke={color}
                strokeWidth={1}
              />
              {/* Body */}
              <rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyH}
                fill={color}
                rx={1}
              />
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) =>
          i % Math.ceil(data.length / 8) === 0 ? (
            <text
              key={i}
              x={CHART_PAD.left + gap * i + gap / 2}
              y={CHART_H - 6}
              fill="hsl(220, 10%, 45%)"
              fontSize={10}
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              {d.time}
            </text>
          ) : null
        )}

        {/* Tooltip */}
        {tooltip && (
          <foreignObject
            x={Math.min(tooltip.x + 10, width - 160)}
            y={Math.max(tooltip.y - 80, 5)}
            width={150}
            height={100}
            className="pointer-events-none"
          >
            <div className="bg-card border border-border p-2 font-mono text-[11px] shadow-lg">
              <p className="text-muted-foreground">{tooltip.d.time}</p>
              <p>O: ${tooltip.d.open.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p>H: ${tooltip.d.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p>L: ${tooltip.d.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p>C: ${tooltip.d.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

const PredictionChart = () => {
  const [activePair, setActivePair] = useState(PAIRS[0]);
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const candles = await fetchKlines(activePair.symbol);
      setData(candles);
    } catch (err) {
      console.error("Failed to fetch klines:", err);
    } finally {
      setLoading(false);
    }
  }, [activePair.symbol]);

  useEffect(() => {
    setLoading(true);
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const lastCandle = data[data.length - 1];
  const prevCandle = data[data.length - 2];
  const priceChange = lastCandle && prevCandle ? lastCandle.close - prevCandle.close : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="py-16 max-w-4xl mx-auto px-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-2">
            Live 5m Chart
          </h2>
          <p className="text-muted-foreground text-sm font-mono">
            Real-time candlestick data from Binance
          </p>
        </div>
        <div className="flex gap-2">
          {PAIRS.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => setActivePair(pair)}
              className={`font-mono text-xs px-4 py-2 border transition-all duration-200 ${
                activePair.symbol === pair.symbol
                  ? "border-primary text-primary border-glow"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {pair.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-text-bright">{activePair.label}</span>
            {lastCandle && (
              <>
                <span className="font-mono text-sm text-text-bright">
                  ${lastCandle.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className={`font-mono text-xs font-semibold ${priceChange >= 0 ? "text-primary" : "text-destructive"}`}>
                  {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] text-primary">LIVE · 5m</span>
          </div>
        </div>

        {/* Chart */}
        <div className="p-2">
          {loading && data.length === 0 ? (
            <div className="h-[360px] flex items-center justify-center font-mono text-sm text-muted-foreground animate-pulse">
              Loading {activePair.label} chart...
            </div>
          ) : (
            <CandlestickChart data={data} pair={activePair.symbol} />
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary font-mono text-[10px] text-muted-foreground">
          <span>Binance Spot · {activePair.symbol}</span>
          <span>{data.length} candles · 5m</span>
          <span>Updates every 15s</span>
        </div>
      </div>
    </motion.section>
  );
};

export default PredictionChart;
