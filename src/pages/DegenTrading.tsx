import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import DegenHero from "@/components/degen/DegenHero";
import TrendingTokensTable from "@/components/degen/TrendingTokensTable";
import { Token } from "@/components/degen/TokenAnalysisPanel";
import { supabase } from "@/integrations/supabase/client";

const DegenTrading = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <DegenHero />
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <TrendingTokensTable tokens={tokens} loading={loading} onRefresh={fetchTokens} />
        </section>
      </main>
    </div>
  );
};

export default DegenTrading;
