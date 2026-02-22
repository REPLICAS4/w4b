import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface PriceData {
  symbol: string;
  pair: string;
  price: number;
  prevPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

const PAIRS = [
  { symbol: "BTCUSDT", pair: "BTC/USDT" },
  { symbol: "BNBUSDT", pair: "BNB/USDT" },
];

const LivePriceTicker = () => {
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const prevPrices = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const responses = await Promise.all(
          PAIRS.map((p) =>
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${p.symbol}`)
              .then((r) => r.json())
          )
        );

        const newPrices = new Map<string, PriceData>();
        responses.forEach((data, i) => {
          const currentPrice = parseFloat(data.lastPrice);
          const prev = prevPrices.current.get(PAIRS[i].symbol) ?? currentPrice;
          prevPrices.current.set(PAIRS[i].symbol, currentPrice);

          newPrices.set(PAIRS[i].symbol, {
            symbol: PAIRS[i].symbol,
            pair: PAIRS[i].pair,
            price: currentPrice,
            prevPrice: prev,
            change24h: parseFloat(data.priceChangePercent),
            high24h: parseFloat(data.highPrice),
            low24h: parseFloat(data.lowPrice),
          });
        });

        setPrices(newPrices);
      } catch (err) {
        console.error("Failed to fetch Binance prices:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPriceColor = (d: PriceData) => {
    if (d.price > d.prevPrice) return "text-primary";
    if (d.price < d.prevPrice) return "text-destructive";
    return "text-foreground";
  };

  const getChangeIcon = (d: PriceData) => {
    if (d.change24h > 0) return <ArrowUp className="w-3 h-3" />;
    if (d.change24h < 0) return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PAIRS.map((p) => {
          const d = prices.get(p.symbol);
          return (
            <div
              key={p.symbol}
              className="border border-border bg-card p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground tracking-wider mb-1">
                  {p.pair}
                  <span className="ml-2 text-[10px] text-muted-foreground/60">BINANCE · LIVE</span>
                </p>
                <p className={`font-mono text-2xl font-bold transition-colors duration-300 ${d ? getPriceColor(d) : "text-foreground"}`}>
                  ${d ? d.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
                </p>
              </div>
              {d && (
                <div className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1 font-mono text-sm font-semibold ${
                      d.change24h >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {getChangeIcon(d)}
                    {d.change24h >= 0 ? "+" : ""}
                    {d.change24h.toFixed(2)}%
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">
                    H: ${d.high24h.toLocaleString()} · L: ${d.low24h.toLocaleString()}
                  </p>
                </div>
              )}
              {!d && (
                <span className="font-mono text-xs text-muted-foreground animate-pulse">Loading...</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[10px] text-muted-foreground">Live from Binance · Updates every 3s</span>
      </div>
    </motion.div>
  );
};

export default LivePriceTicker;
