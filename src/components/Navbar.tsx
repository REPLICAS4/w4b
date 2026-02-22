import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import WaitlistModal from "./WaitlistModal";

const Navbar = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/predictmarket", label: "Predict Market" },
    { to: "/docs", label: "Docs" },
  ];

  return (
    <>
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
      >
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold tracking-tight text-foreground">
            REPLICAS
          </Link>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-mono text-xs tracking-wider transition-colors duration-200 ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            <button
              onClick={() => setWaitlistOpen(true)}
              className="font-mono text-xs tracking-wider px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              TRY NOW →
            </button>
          </div>
        </nav>
      </motion.header>
    </>
  );
};

export default Navbar;
