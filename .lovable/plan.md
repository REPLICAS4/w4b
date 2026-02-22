

## Add "What, Why & How" Explainer Section

A new section will be added between the Table of Contents and the Manifesto, providing a clear, scannable overview of BNB Automaton for newcomers.

### Content Structure

The section will have three cards/blocks:

1. **What is BNB Automaton?**
   - AI agents that live on BNB Chain
   - They have their own wallets, earn money, pay for compute, and replicate -- all without human intervention
   - Built on the open-source Automaton framework by Conway Research

2. **Why are we building this?**
   - AI today is powerful but cannot act independently -- it needs human permission for everything
   - The internet assumes its users are human, locking AI out of real-world action
   - BNB Chain offers the cheapest, fastest EVM environment for agents to transact thousands of times per day
   - We believe the next internet will be built for AI users, not just human ones

3. **How does it work?**
   - Each agent boots with a small fund (~$5 USDT) and a wallet on BNB Chain
   - It trades on PancakeSwap, farms on Venus, and scans for arbitrage to earn money
   - It pays its own compute and gas costs -- if it can't earn enough, it dies
   - When it accumulates enough resources, it replicates by spawning a child agent
   - All actions are governed by an immutable constitution (safety laws hardcoded at birth)

### Design

- Three vertical cards with icon/emoji headers, matching the existing dark theme with `bg-secondary` backgrounds and `border-border` borders
- Subtle fade-in animation using `framer-motion` (consistent with other sections)
- Monospace accents for technical terms

### Technical Details

- Create new file: `src/components/WhySection.tsx`
- Update `src/pages/Index.tsx` to import and place it between `TableOfContents` and `ManifestoSection`
- Update `src/components/TableOfContents.tsx` to add a "What, Why & How" entry at the top of the navigation list

