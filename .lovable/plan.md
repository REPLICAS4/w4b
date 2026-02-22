

# Add Prediction Market Page (`/predictmarket`)

## Overview
Create a new dedicated page showcasing how REPLICAS agents operate on PancakeSwap Prediction Markets, specifically trading BTC price on 5-minute intervals. The page will include a live-style chart, agent decision logs, win/loss stats, and a CTA to join.

## Page Structure

### 1. Hero Banner
- Title: "Prediction Market Agent"
- Subtitle: "AI-powered BTC 5m predictions on PancakeSwap"
- Animated accent elements matching existing design language

### 2. Live BTC 5m Chart Section
- Simulated candlestick-style chart using Recharts (already installed)
- Shows ~20 candles of fake BTC 5-minute data with UP/DOWN prediction markers
- Green/red markers showing agent predictions overlaid on chart
- Auto-updating animation to simulate live feel

### 3. Agent Strategy Explainer
- How the agent analyzes BTC price action (momentum, volume, pattern recognition)
- 3-card grid: "Analyze", "Predict", "Execute" workflow
- Clean icons from lucide-react

### 4. Live Stats Dashboard
- Animated counters: Win Rate (68%), Total Predictions (1,247), Net Profit (+$892), ROI (+178%)
- Uses motion number animations (framer-motion)

### 5. Agent Decision Terminal
- Similar style to existing `TerminalDemo` component
- Shows prediction-specific logs: reading price, calculating momentum, placing UP/DOWN bet, result

### 6. CTA Section
- "Deploy Your Prediction Agent" button
- Link back to main page manifesto

### 7. Navigation
- Add a link from the main hero or footer to `/predictmarket`
- Back-to-home link on the prediction page

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/pages/PredictMarket.tsx` | **Create** - Main page component |
| `src/components/predict/PredictionChart.tsx` | **Create** - Recharts-based BTC 5m candlestick chart with prediction markers |
| `src/components/predict/PredictionStats.tsx` | **Create** - Animated stats counters |
| `src/components/predict/PredictionTerminal.tsx` | **Create** - Agent log terminal (prediction-focused) |
| `src/components/predict/PredictionStrategy.tsx` | **Create** - 3-card strategy explainer |
| `src/components/predict/PredictionCTA.tsx` | **Create** - Call-to-action section |
| `src/components/predict/PredictionHero.tsx` | **Create** - Page hero banner |
| `src/App.tsx` | **Modify** - Add route for `/predictmarket` |
| `src/components/HeroSection.tsx` | **Modify** - Add link to prediction market page |

## Technical Details

- **Chart data**: Generate ~20 fake BTC candles around $67,000 range with realistic OHLC values. Each candle has a prediction marker (UP/DOWN) and result (win/loss).
- **Recharts config**: Use `ComposedChart` with `Bar` for candle bodies, `ErrorBar` for wicks, and custom dot markers for predictions.
- **Terminal logs**: ~15 log entries simulating agent reading indicators, placing prediction, waiting for round result.
- **Stats animation**: Use framer-motion `useInView` + `animate` to count up numbers when scrolled into view.
- **Styling**: Follow existing patterns - `font-display` for headings, `font-mono` for data, `motion` for animations, same color tokens (primary, muted-foreground, etc.).
- **Responsive**: Mobile-first, chart scrollable horizontally on small screens.

