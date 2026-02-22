import { useState } from "react";
import { Play, Trash2, ZoomIn, ZoomOut, Maximize, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BuilderToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onClear: () => void;
  nodeCount: number;
  edgeCount: number;
}

const BuilderToolbar = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onClear,
  nodeCount,
  edgeCount,
}: BuilderToolbarProps) => {
  const [walletState, setWalletState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleDeploy = () => {
    setShowDeployModal(true);
  };

  const handleConnectWallet = async () => {
    setWalletState("connecting");
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setWalletAddress(mockAddress);
      setWalletState("connected");
    }, 2000);
  };

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-1.5 bg-card/90 border border-border rounded-lg backdrop-blur-md shadow-lg">
        <button
          onClick={onZoomIn}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onFitView}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Fit View"
        >
          <Maximize className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-3 px-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            <span className="text-primary font-semibold">{nodeCount}</span> nodes
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            <span className="text-primary font-semibold">{edgeCount}</span> edges
          </span>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={onClear}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {walletState === "connected" ? (
          <div className="flex items-center gap-1.5 px-2 py-1.5 ml-1 font-mono text-[10px] text-primary border border-primary/30 rounded">
            <Wallet className="w-3 h-3" />
            {shortenAddress(walletAddress)}
          </div>
        ) : null}

        <button
          onClick={handleDeploy}
          className="flex items-center gap-1.5 px-3 py-1.5 ml-1 bg-primary text-primary-foreground font-mono text-xs rounded hover:bg-primary/90 transition-colors"
          title="Deploy Agent"
        >
          <Play className="w-3.5 h-3.5" />
          DEPLOY
        </button>
      </div>

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeployModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowDeployModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-md border border-primary/30 bg-background p-8"
            >
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-2">
                DEPLOY AGENT
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Connect Wallet to Deploy
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Connect your BNB Chain wallet to deploy your agent on-chain. Gas fees apply.
              </p>

              {/* Agent Summary */}
              <div className="border border-border rounded p-4 mb-6 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Nodes</span>
                  <span className="text-primary font-semibold">{nodeCount}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="text-primary font-semibold">{edgeCount}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground">BNB Smart Chain</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Est. Gas</span>
                  <span className="text-foreground">~0.005 BNB</span>
                </div>
              </div>

              {/* Wallet Connection */}
              {walletState === "disconnected" && (
                <button
                  onClick={handleConnectWallet}
                  className="w-full flex items-center justify-center gap-2 font-mono text-sm tracking-wider px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-glow"
                >
                  <Wallet className="w-4 h-4" />
                  CONNECT WALLET
                </button>
              )}

              {walletState === "connecting" && (
                <div className="w-full flex items-center justify-center gap-2 font-mono text-sm tracking-wider px-8 py-3 border border-border text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  CONNECTING...
                </div>
              )}

              {walletState === "connected" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-3 border border-primary/30 rounded font-mono text-xs text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Connected: {shortenAddress(walletAddress)}</span>
                  </div>
                  <button
                    onClick={() => setShowDeployModal(false)}
                    className="w-full flex items-center justify-center gap-2 font-mono text-sm tracking-wider px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                  >
                    <Play className="w-4 h-4" />
                    DEPLOY AGENT →
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowDeployModal(false)}
                className="w-full mt-3 font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors text-center py-2"
              >
                CANCEL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BuilderToolbar;
