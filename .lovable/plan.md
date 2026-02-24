

# Degen Trading on BSC -- Meme Token Scanner + AI Analysis

## Overview

Add a new **Degen Trading** page at `/degen` where replicas automatically fetch trending meme tokens on BSC from DexScreener's public API, then use AI (via Lovable AI) to analyze, score, and predict each token. Users can view live trending tokens, get AI-powered insights, and see trade recommendations.

## Architecture

```text
+------------------+       +---------------------+       +-------------------+
|  /degen page     | ----> | Edge Function:       | ----> | DexScreener API   |
|  (React frontend)|       | fetch-trending-bsc   |       | (public, no key)  |
+------------------+       +---------------------+       +-------------------+
        |                          |
        |                          v
        |                  +---------------------+
        |                  | Edge Function:       |
        +----------------> | analyze-token        | ----> Lovable AI (Gemini)
                           +---------------------+
```

DexScreener has a **free public API** (no API key needed, rate-limited to 300 req/min). We'll proxy through edge functions to avoid CORS issues and add AI analysis.

## What Gets Built

### 1. Edge Function: `fetch-trending-bsc`
Fetches trending/top meme tokens on BSC from DexScreener API:
- `GET https://api.dexscreener.com/token-boosts/top/v1` -- top boosted tokens
- Filter to `chainId === "bsc"` only
- Also fetch pair data: `GET https://api.dexscreener.com/latest/dex/search?q=meme` filtered to BSC
- Returns: token name, symbol, price, 24h change, volume, liquidity, market cap, pair address, logo

### 2. Edge Function: `analyze-token`
Takes a token's market data and uses Lovable AI (Gemini Flash) to generate:
- **Risk score** (1-10, 10 = extremely risky)
- **Degen score** (1-10, 10 = maximum degen potential)
- **Short analysis** (2-3 sentences on why buy/avoid)
- **Prediction** (bullish/bearish/neutral for next 24h)
- **Key signals** (liquidity locked?, honeypot risk, volume trend)

### 3. New Page: `/degen` -- Degen Trading Dashboard
Sections on the page:

**a) Hero Section** -- "Degen Scanner" branding with BSC logo, live pulse indicator

**b) Trending Meme Tokens Table** -- Live table showing:
| Token | Price | 24h % | Volume | Liquidity | Degen Score | Action |
Each row is clickable to expand AI analysis

**c) AI Analysis Panel** -- When a token is selected:
- Risk/Degen score gauges
- AI-generated insight text
- Bullish/Bearish prediction badge
- Key signals (liquidity, honeypot check, volume trend)
- Link to DexScreener for the pair

**d) Agent Thinking Terminal** -- Reuse the existing terminal animation pattern to show the AI "thinking" while analyzing a token

### 4. Navigation
- Add "Degen" link to the Navbar

## Database

**No new tables needed** for the initial version. This is a real-time scanner -- data is fetched live from DexScreener and analyzed on-the-fly. A future iteration could add a `watchlist` table or `trade_signals` table.

## Technical Details

### Edge Function: `fetch-trending-bsc/index.ts`
- Calls DexScreener public endpoints (no API key)
- Filters results to BSC chain only
- Enriches with pair data (price, volume, liquidity)
- Returns top 20 trending BSC meme tokens
- CORS headers included

### Edge Function: `analyze-token/index.ts`
- Receives token data (name, price, volume, liquidity, price change)
- Calls Lovable AI (Gemini Flash) with a structured prompt
- Returns JSON with risk_score, degen_score, analysis, prediction, signals
- Uses the same AI gateway pattern as `chat-replica`

### Frontend Components (all in `src/components/degen/`)
- `DegenHero.tsx` -- Page hero with scanner branding
- `TrendingTokensTable.tsx` -- Live table of trending BSC meme tokens with auto-refresh
- `TokenAnalysisPanel.tsx` -- AI analysis display for selected token
- `DegenScoreGauge.tsx` -- Visual gauge component for risk/degen scores
- `TokenRow.tsx` -- Individual token row with expand/collapse for analysis

### Page: `src/pages/DegenTrading.tsx`
- Composes all degen components
- Manages selected token state
- Auto-refreshes trending data every 30 seconds

### Files to Create
1. `supabase/functions/fetch-trending-bsc/index.ts`
2. `supabase/functions/analyze-token/index.ts`
3. `src/pages/DegenTrading.tsx`
4. `src/components/degen/DegenHero.tsx`
5. `src/components/degen/TrendingTokensTable.tsx`
6. `src/components/degen/TokenAnalysisPanel.tsx`
7. `src/components/degen/DegenScoreGauge.tsx`

### Files to Edit
1. `src/App.tsx` -- add `/degen` route
2. `src/components/Navbar.tsx` -- add "Degen" link
3. `supabase/config.toml` -- add `verify_jwt = false` for new functions

## Implementation Order
1. Create both edge functions and deploy
2. Build frontend components
3. Wire up the page and add routing
4. Test end-to-end

