import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DexToken {
  url?: string;
  chainId?: string;
  tokenAddress?: string;
  icon?: string;
  header?: string;
  description?: string;
  name?: string;
  symbol?: string;
}

interface DexPair {
  chainId?: string;
  pairAddress?: string;
  baseToken?: { address?: string; name?: string; symbol?: string };
  quoteToken?: { address?: string; name?: string; symbol?: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  marketCap?: number;
  info?: { imageUrl?: string };
  url?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Fetch top boosted tokens
    const boostRes = await fetch("https://api.dexscreener.com/token-boosts/top/v1");
    const boostData: DexToken[] = await boostRes.json();

    // Filter BSC tokens
    const bscTokens = (boostData || []).filter((t) => t.chainId === "bsc");

    // Get unique token addresses
    const addresses = [...new Set(bscTokens.map((t) => t.tokenAddress).filter(Boolean))];

    if (addresses.length === 0) {
      // Fallback: search for meme tokens on BSC
      const searchRes = await fetch("https://api.dexscreener.com/latest/dex/search?q=meme");
      const searchData = await searchRes.json();
      const bscPairs: DexPair[] = (searchData.pairs || [])
        .filter((p: DexPair) => p.chainId === "bsc")
        .slice(0, 20);

      const tokens = bscPairs.map((p) => ({
        name: p.baseToken?.name || "Unknown",
        symbol: p.baseToken?.symbol || "???",
        address: p.baseToken?.address || "",
        pairAddress: p.pairAddress || "",
        price: p.priceUsd || "0",
        priceChange24h: p.priceChange?.h24 || 0,
        volume24h: p.volume?.h24 || 0,
        liquidity: p.liquidity?.usd || 0,
        marketCap: p.marketCap || p.fdv || 0,
        logo: p.info?.imageUrl || null,
        dexUrl: p.url || `https://dexscreener.com/bsc/${p.pairAddress}`,
      }));

      return new Response(JSON.stringify({ tokens, source: "search" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch pair data for boosted BSC tokens (batch up to 30)
    const batchAddresses = addresses.slice(0, 30).join(",");
    const pairRes = await fetch(`https://api.dexscreener.com/tokens/v1/bsc/${batchAddresses}`);
    const pairData: DexPair[] = await pairRes.json();

    // Build token list from pair data, deduplicate by base token address
    const seen = new Set<string>();
    const tokens = (pairData || [])
      .filter((p) => {
        const addr = p.baseToken?.address?.toLowerCase();
        if (!addr || seen.has(addr)) return false;
        seen.add(addr);
        return true;
      })
      .slice(0, 20)
      .map((p) => ({
        name: p.baseToken?.name || "Unknown",
        symbol: p.baseToken?.symbol || "???",
        address: p.baseToken?.address || "",
        pairAddress: p.pairAddress || "",
        price: p.priceUsd || "0",
        priceChange24h: p.priceChange?.h24 || 0,
        volume24h: p.volume?.h24 || 0,
        liquidity: p.liquidity?.usd || 0,
        marketCap: p.marketCap || p.fdv || 0,
        logo: p.info?.imageUrl || bscTokens.find((t) => t.tokenAddress?.toLowerCase() === p.baseToken?.address?.toLowerCase())?.icon || null,
        dexUrl: p.url || `https://dexscreener.com/bsc/${p.pairAddress}`,
      }));

    return new Response(JSON.stringify({ tokens, source: "boosted" }), {
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
