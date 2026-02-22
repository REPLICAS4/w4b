import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceDot,
} from "recharts";

interface CandleData {
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  prediction: "UP" | "DOWN";
  result: "win" | "loss";
  // derived for chart
  bottom: number;
  body: number;
}

const generateCandles = (): CandleData[] => {
  let price = 67000 + Math.random() * 500;
  const candles: CandleData[] = [];

  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.48) * 200;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 80;
    const low = Math.min(open, close) - Math.random() * 80;
    const prediction = Math.random() > 0.45 ? "UP" : "DOWN";
    const actualUp = close > open;
    const result =
      (prediction === "UP" && actualUp) || (prediction === "DOWN" && !actualUp)
        ? "win"
        : "loss";

    candles.push({
      time: `${String(i * 5).padStart(2, "0")}:00`,
      open: Math.round(open),
      close: Math.round(close),
      high: Math.round(high),
      low: Math.round(low),
      prediction,
      result,
      bottom: Math.round(Math.min(open, close)),
      body: Math.round(Math.abs(close - open)) || 5,
    });

    price = close;
  }
  return candles;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as CandleData;
  return (
    <div className="bg-card border border-border p-3 font-mono text-xs">
      <p className="text-muted-foreground mb-1">{d.time}</p>
      <p>O: ${d.open.toLocaleString()}</p>
      <p>H: ${d.high.toLocaleString()}</p>
      <p>L: ${d.low.toLocaleString()}</p>
      <p>C: ${d.close.toLocaleString()}</p>
      <p className="mt-1">
        Agent:{" "}
        <span className={d.prediction === "UP" ? "text-primary" : "text-destructive"}>
          {d.prediction}
        </span>{" "}
        → <span className={d.result === "win" ? "text-primary" : "text-destructive"}>{d.result}</span>
      </p>
    </div>
  );
};

const PredictionChart = () => {
  const [data, setData] = useState<CandleData[]>(() => generateCandles());

  // Refresh data every 30s to simulate live feel
  useEffect(() => {
    const interval = setInterval(() => setData(generateCandles()), 30000);
    return () => clearInterval(interval);
  }, []);

  const minPrice = Math.min(...data.map((d) => d.low)) - 50;
  const maxPrice = Math.max(...data.map((d) => d.high)) + 50;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="py-16 max-w-4xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-2">
        Live BTC 5m Chart
      </h2>
      <p className="text-muted-foreground text-sm mb-8 font-mono">
        Simulated agent predictions overlaid on BTC price action
      </p>

      <div className="border border-border bg-card p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "hsl(220 10% 45%)", fontFamily: "var(--font-mono)" }}
                axisLine={{ stroke: "hsl(220 10% 90%)" }}
                tickLine={false}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 10, fill: "hsl(220 10% 45%)", fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="body" stackId="candle" barSize={12}>
                {data.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.close >= d.open ? "hsl(45 96% 48%)" : "hsl(0 84% 60%)"}
                    y={d.bottom}
                  />
                ))}
              </Bar>
              {/* Prediction markers on top */}
              {data.map((d, i) => (
                <ReferenceDot
                  key={i}
                  x={d.time}
                  y={d.high + 20}
                  r={4}
                  fill={d.result === "win" ? "hsl(45 96% 48%)" : "hsl(0 84% 60%)"}
                  stroke="none"
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Win
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> Loss
          </span>
          <span className="ml-auto">Auto-refreshes every 30s</span>
        </div>
      </div>
    </motion.section>
  );
};

export default PredictionChart;
