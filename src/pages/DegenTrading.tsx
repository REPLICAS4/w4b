import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "@/components/Navbar";
import DegenHero from "@/components/degen/DegenHero";
import TrendingTokensTable from "@/components/degen/TrendingTokensTable";
import { Token } from "@/components/degen/TokenAnalysisPanel";
import { supabase } from "@/integrations/supabase/client";

const DegenTrading = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxMcap, setMaxMcap] = useState<number>(10_000_000);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-trending-bsc");
      if (error) throw error;
      setTokens(data?.tokens || []);
    } catch (e) {
      console.error("Failed to fetch tokens:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, [fetchTokens]);

  const filteredTokens = useMemo(
    () => tokens.filter((t) => t.marketCap <= maxMcap),
    [tokens, maxMcap]
  );

  const mcapOptions = [
    { label: "< $1M", value: 1_000_000 },
    { label: "< $5M", value: 5_000_000 },
    { label: "< $10M", value: 10_000_000 },
    { label: "< $50M", value: 50_000_000 },
    { label: "All", value: Infinity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <DegenHero />
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">MCAP FILTER:</span>
            {mcapOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMaxMcap(opt.value)}
                className={`font-mono text-xs px-3 py-1 rounded border transition-colors ${
                  maxMcap === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <TrendingTokensTable tokens={filteredTokens} loading={loading} onRefresh={fetchTokens} />
        </section>
      </main>
    </div>
  );
};

export default DegenTrading;
