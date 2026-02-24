import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DexPair {
  chainId?: string;
  pairAddress?: string;
  baseToken?: { address?: string; name?: string; symbol?: string };
  quoteToken?: { address?: string; name?: string; symbol?: string };
  priceUsd?: string;
  priceChange?: { h24?: number; h6?: number; h1?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  marketCap?: number;
  info?: { imageUrl?: string };
  url?: string;
  txns?: { h24?: { buys?: number; sells?: number } };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Multiple search queries to get diverse BSC tokens
    const queries = ["BSC", "BNB", "pancakeswap", "doge", "pepe", "shib", "floki", "baby"];
    
    const fetchPromises = queries.map((q) =>
      fetch(`https://api.dexscreener.com/latest/dex/search?q=${q}`)
        .then((r) => r.json())
        .then((d) => (d.pairs || []) as DexPair[])
        .catch(() => [] as DexPair[])
    );

    // Also fetch top boosted tokens
    const boostPromise = fetch("https://api.dexscreener.com/token-boosts/top/v1")
      .then((r) => r.json())
      .catch(() => []);

    const [boostData, ...searchResults] = await Promise.all([boostPromise, ...fetchPromises]);

    // Collect all BSC pairs from searches
    const allBscPairs: DexPair[] = searchResults
      .flat()
      .filter((p) => p.chainId === "bsc");

    // If we have boosted BSC tokens, fetch their pair data too
    const boostedBsc = (Array.isArray(boostData) ? boostData : []).filter(
      (t: any) => t.chainId === "bsc" && t.tokenAddress
    );
    if (boostedBsc.length > 0) {
      const addrs = [...new Set(boostedBsc.map((t: any) => t.tokenAddress))].slice(0, 30);
      try {
        const pairRes = await fetch(`https://api.dexscreener.com/tokens/v1/bsc/${addrs.join(",")}`);
        const pairData: DexPair[] = await pairRes.json();
        if (Array.isArray(pairData)) {
          allBscPairs.push(...pairData.filter((p) => p.chainId === "bsc"));
        }
      } catch {}
    }

    // Deduplicate by base token address, keep the pair with highest volume
    const tokenMap = new Map<string, DexPair>();
    for (const p of allBscPairs) {
      const addr = p.baseToken?.address?.toLowerCase();
      if (!addr) continue;
      const existing = tokenMap.get(addr);
      if (!existing || (p.volume?.h24 || 0) > (existing.volume?.h24 || 0)) {
        tokenMap.set(addr, p);
      }
    }

    // Sort by 24h volume descending, take top 30
    const sorted = [...tokenMap.values()]
      .filter((p) => (p.volume?.h24 || 0) > 100) // min $100 volume
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, 30);

    const tokens = sorted.map((p) => ({
      name: p.baseToken?.name || "Unknown",
      symbol: p.baseToken?.symbol || "???",
      address: p.baseToken?.address || "",
      pairAddress: p.pairAddress || "",
      price: p.priceUsd || "0",
      priceChange24h: p.priceChange?.h24 || 0,
      priceChange6h: p.priceChange?.h6 || 0,
      priceChange1h: p.priceChange?.h1 || 0,
      volume24h: p.volume?.h24 || 0,
      liquidity: p.liquidity?.usd || 0,
      marketCap: p.marketCap || p.fdv || 0,
      logo: p.info?.imageUrl || null,
      dexUrl: p.url || `https://dexscreener.com/bsc/${p.pairAddress}`,
      buys24h: p.txns?.h24?.buys || 0,
      sells24h: p.txns?.h24?.sells || 0,
    }));

    return new Response(JSON.stringify({ tokens, count: tokens.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-trending-bsc error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
