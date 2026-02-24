import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Shield, AlertTriangle, TrendingUp, Fish } from "lucide-react";
import DegenScoreGauge from "./DegenScoreGauge";

export interface TokenAnalysis {
  risk_score: number;
  degen_score: number;
  analysis: string;
  prediction: string;
  signals: {
    liquidity_locked: boolean | string;
    honeypot_risk: string;
    volume_trend: string;
    whale_activity: string;
  };
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  pairAddress: string;
  price: string;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  logo: string | null;
  dexUrl: string;
}

interface TokenAnalysisPanelProps {
  token: Token;
  analysis: TokenAnalysis | null;
  loading: boolean;
}

const TokenAnalysisPanel = ({ token, analysis, loading }: TokenAnalysisPanelProps) => {
  if (loading) {
    return (
      <Card className="border-primary/20 bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
            />
            <div>
              <p className="font-mono text-sm text-foreground">Analyzing {token.symbol}...</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                AI is scanning on-chain data and market signals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const predictionColor = {
    bullish: "bg-green-500/10 text-green-500 border-green-500/30",
    bearish: "bg-destructive/10 text-destructive border-destructive/30",
    neutral: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  }[analysis.prediction] || "bg-muted text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-base">
              AI Analysis: {token.name} ({token.symbol})
            </CardTitle>
            <a
              href={token.dexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-primary hover:underline"
            >
              DexScreener <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DegenScoreGauge label="RISK SCORE" score={analysis.risk_score} />
            <DegenScoreGauge label="DEGEN SCORE" score={analysis.degen_score} colorClass="bg-primary" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">PREDICTION:</span>
            <Badge className={`font-mono text-xs ${predictionColor}`}>
              {analysis.prediction.toUpperCase()}
            </Badge>
          </div>

          <p className="font-mono text-sm text-foreground/80 leading-relaxed">
            {analysis.analysis}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <SignalItem icon={<Shield className="w-3.5 h-3.5" />} label="Liquidity" value={String(analysis.signals.liquidity_locked)} />
            <SignalItem icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Honeypot" value={analysis.signals.honeypot_risk} />
            <SignalItem icon={<TrendingUp className="w-3.5 h-3.5" />} label="Volume" value={analysis.signals.volume_trend} />
            <SignalItem icon={<Fish className="w-3.5 h-3.5" />} label="Whales" value={analysis.signals.whale_activity} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SignalItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-2 p-2 rounded border border-border bg-muted/30">
    {icon}
    <div>
      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
      <p className="font-mono text-xs text-foreground capitalize">{value}</p>
    </div>
  </div>
);

export default TokenAnalysisPanel;
