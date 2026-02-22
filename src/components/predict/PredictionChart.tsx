import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
} from "recharts";

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  bottom: number;
  body: number;
  isUp: boolean;
}

const PAIRS = [
  { symbol: "BTCUSDT", label: "BTC/USDT" },
  { symbol: "BNBUSDT", label: "BNB/USDT" },
];

const fetchKlines = async (symbol: string): Promise<CandleData[]> => {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=30`
  );
  const raw = await res.json();

  return raw.map((k: any[]) => {
    const open = parseFloat(k[1]);
    const high = parseFloat(k[2]);
    const low = parseFloat(k[3]);
    const close = parseFloat(k[4]);
    const volume = parseFloat(k[5]);
    const isUp = close >= open;
    const date = new Date(k[0]);
    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    return {
      time,
      timestamp: k[0],
      open,
      high,
      low,
      close,
      volume,
      bottom: Math.min(open, close),
      body: Math.abs(close - open) || 0.01,
      isUp,
    };
  });
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as CandleData;
  return (
    <div className="bg-card border border-border p-3 font-mono text-xs z-50">
      <p className="text-muted-foreground mb-1">{d.time}</p>
      <p>O: ${d.open.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      <p>H: ${d.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      <p>L: ${d.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      <p>C: ${d.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      <p className="text-muted-foreground mt-1">Vol: {d.volume.toFixed(2)}</p>
    </div>
  );
};

// Custom candlestick shape
const CandlestickShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;

  const { open, close, high, low, isUp } = payload;
  const color = isUp ? "hsl(45, 96%, 48%)" : "hsl(0, 84%, 60%)";

  // We need to calculate wick positions relative to the bar
  const yScale = height / Math.abs(close - open || 0.01);
  const barCenter = x + width / 2;

  return (
    <g>
      {/* Candle body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(height, 1)}
        fill={color}
        opacity={0.9}
      />
    </g>
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

  const minPrice = data.length ? Math.min(...data.map((d) => d.low)) * 0.9999 : 0;
  const maxPrice = data.length ? Math.max(...data.map((d) => d.high)) * 1.0001 : 0;

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

        {/* Pair switcher */}
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
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-text-bright">{activePair.label}</span>
            {lastCandle && (
              <>
                <span className="font-mono text-sm text-text-bright">
                  ${lastCandle.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    priceChange >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}
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
        <div className="p-4 overflow-x-auto">
          {loading && data.length === 0 ? (
            <div className="h-[360px] flex items-center justify-center font-mono text-sm text-muted-foreground animate-pulse">
              Loading {activePair.label} chart...
            </div>
          ) : (
            <div className="min-w-[600px]">
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)", fontFamily: "var(--font-mono)" }}
                    axisLine={{ stroke: "hsl(220, 10%, 90%)" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[minPrice, maxPrice]}
                    tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)", fontFamily: "var(--font-mono)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      activePair.symbol === "BTCUSDT"
                        ? `$${(v / 1000).toFixed(1)}k`
                        : `$${v.toFixed(1)}`
                    }
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="body"
                    barSize={10}
                    shape={<CandlestickShape />}
                  >
                    {data.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.isUp ? "hsl(45, 96%, 48%)" : "hsl(0, 84%, 60%)"}
                      />
                    ))}
                  </Bar>
                  {/* Close price line */}
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(45, 96%, 48%)"
                    strokeWidth={1}
                    dot={false}
                    opacity={0.3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary font-mono text-[10px] text-muted-foreground">
          <span>Binance Spot · {activePair.symbol}</span>
          <span>{data.length} candles · 5m interval</span>
          <span>Updates every 15s</span>
        </div>
      </div>
    </motion.section>
  );
};

export default PredictionChart;
