import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, RefreshCw, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TokenAnalysisPanel, { Token, TokenAnalysis } from "./TokenAnalysisPanel";
import { supabase } from "@/integrations/supabase/client";

interface TrendingTokensTableProps {
  tokens: Token[];
  loading: boolean;
  onRefresh: () => void;
}

const formatNumber = (n: number) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
};

const TrendingTokensTable = ({ tokens, loading, onRefresh }: TrendingTokensTableProps) => {
  const [expandedToken, setExpandedToken] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, TokenAnalysis>>({});
  const [analyzingToken, setAnalyzingToken] = useState<string | null>(null);

  const handleAnalyze = async (token: Token) => {
    const key = token.address;
    if (expandedToken === key) {
      setExpandedToken(null);
      return;
    }
    setExpandedToken(key);

    if (analyses[key]) return;

    setAnalyzingToken(key);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-token", {
        body: { token },
      });
      if (error) throw error;
      setAnalyses((prev) => ({ ...prev, [key]: data }));
    } catch (e) {
      console.error("Analysis error:", e);
    } finally {
      setAnalyzingToken(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-muted-foreground">
          TRENDING BSC TOKENS ({tokens.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="font-mono text-xs gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          REFRESH
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-mono text-xs">TOKEN</TableHead>
              <TableHead className="font-mono text-xs text-right">PRICE</TableHead>
              <TableHead className="font-mono text-xs text-right">24H %</TableHead>
              <TableHead className="font-mono text-xs text-right hidden md:table-cell">VOLUME</TableHead>
              <TableHead className="font-mono text-xs text-right hidden md:table-cell">LIQUIDITY</TableHead>
              <TableHead className="font-mono text-xs text-right hidden lg:table-cell">MCAP</TableHead>
              <TableHead className="font-mono text-xs text-center">AI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && tokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                    <span className="font-mono text-sm text-muted-foreground">Scanning BSC chain...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 font-mono text-sm text-muted-foreground">
                  No trending tokens found. Try refreshing.
                </TableCell>
              </TableRow>
            ) : (
              tokens.map((token) => {
                const isExpanded = expandedToken === token.address;
                return (
                  <motion.tr
                    key={token.address}
                    layout
                    className="border-b border-border"
                  >
                    <TableCell colSpan={7} className="p-0">
                      <div
                        className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_auto_auto_auto_auto_auto_auto] items-center px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => handleAnalyze(token)}
                      >
                        <div className="flex items-center gap-2">
                          {token.logo ? (
                            <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center font-mono text-xs text-primary">
                              {token.symbol[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-mono text-sm text-foreground font-medium">{token.symbol}</p>
                            <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">{token.name}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm text-foreground text-right px-3">
                          ${parseFloat(token.price) < 0.01 ? parseFloat(token.price).toExponential(2) : parseFloat(token.price).toFixed(4)}
                        </span>
                        <Badge
                          className={`font-mono text-xs ${
                            token.priceChange24h >= 0
                              ? "bg-green-500/10 text-green-500 border-green-500/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                          }`}
                        >
                          {token.priceChange24h >= 0 ? "+" : ""}{token.priceChange24h.toFixed(1)}%
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground text-right px-3 hidden md:block">
                          {formatNumber(token.volume24h)}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground text-right px-3 hidden md:block">
                          {formatNumber(token.liquidity)}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground text-right px-3 hidden lg:block">
                          {formatNumber(token.marketCap)}
                        </span>
                        <div className="flex items-center justify-center px-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Brain className="w-4 h-4 text-primary" />}
                          </Button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 overflow-hidden"
                          >
                            <TokenAnalysisPanel
                              token={token}
                              analysis={analyses[token.address] || null}
                              loading={analyzingToken === token.address}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrendingTokensTable;
