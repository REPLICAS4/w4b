import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ open, onClose }: WaitlistModalProps) => {
  const [xAccount, setXAccount] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xAccount.trim()) return;
    // Store locally for now
    const entry = { xAccount: xAccount.trim(), description: description.trim(), timestamp: Date.now() };
    const existing = JSON.parse(localStorage.getItem("replicas_waitlist") || "[]");
    existing.push(entry);
    localStorage.setItem("replicas_waitlist", JSON.stringify(existing));
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setXAccount("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-md border border-primary/30 bg-background p-8"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <>
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-2">
                  EARLY ACCESS
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-text-bright mb-2">
                  Join the Waitlist
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Be among the first to forge your Replicas. Connect your identity and get priority access.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-mono text-xs tracking-wider text-muted-foreground uppercase block mb-2">
                      X (Twitter) Account *
                    </label>
                    <input
                      type="text"
                      value={xAccount}
                      onChange={(e) => setXAccount(e.target.value)}
                      placeholder="@youraccount"
                      required
                      maxLength={50}
                      className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-text-bright placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs tracking-wider text-muted-foreground uppercase block mb-2">
                      Tell us about yourself
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What excites you about Replicas? Your experience with DeFi, AI agents..."
                      maxLength={500}
                      rows={3}
                      className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-text-bright placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full font-mono text-sm tracking-wider px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-glow"
                  >
                    JOIN WAITLIST →
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 border border-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl">✓</span>
                </div>
                <h3 className="font-display text-xl font-bold text-text-bright mb-2">
                  You're on the list
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  We'll notify you on X when it's time to forge your first Replica.
                </p>
                <button
                  onClick={handleClose}
                  className="font-mono text-xs tracking-wider text-primary hover:underline"
                >
                  CLOSE
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
