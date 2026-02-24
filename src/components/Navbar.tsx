import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import WaitlistModal from "./WaitlistModal";
import { LogOut, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const links = [
    { to: "/", label: "Home" },
    { to: "/discovery", label: "Discovery" },
    { to: "/create-replica", label: "Create Replica" },
    { to: "/predictmarket", label: "Predict Market" },
    { to: "/docs", label: "Docs" },
  ];

  if (user) {
    links.push({ to: "/my-replicas", label: "My Replicas" });
    links.push({ to: "/profile", label: "Profile" });
  }

  const navLink = (link: { to: string; label: string }, onClick?: () => void) => (
    <Link
      key={link.to}
      to={link.to}
      onClick={onClick}
      className={`font-mono text-xs tracking-wider transition-colors duration-200 ${
        location.pathname === link.to
          ? "text-primary"
          : "text-muted-foreground hover:text-primary"
      }`}
    >
      {link.label.toUpperCase()}
    </Link>
  );

  const authButton = (onClick?: () => void) =>
    user ? (
      <button
        onClick={() => { signOut(); onClick?.(); }}
        className="font-mono text-xs tracking-wider px-4 py-1.5 border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-all duration-300 flex items-center gap-1.5"
      >
        <LogOut className="w-3 h-3" />
        SIGN OUT
      </button>
    ) : (
      <Link
        to="/auth"
        onClick={onClick}
        className="font-mono text-xs tracking-wider px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        SIGN IN →
      </Link>
    );

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

          {isMobile ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle className="font-display text-lg font-bold">REPLICAS</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {links.map((link) => navLink(link, () => setSheetOpen(false)))}
                  <a
                    href="https://github.com/REPLICAS4/w4b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    OPEN-SOURCE
                  </a>
                  <div className="pt-2 border-t border-border">
                    {authButton(() => setSheetOpen(false))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center gap-6">
              {links.map((link) => navLink(link))}
              <a
                href="https://github.com/REPLICAS4/w4b"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                OPEN-SOURCE
              </a>
              {authButton()}
            </div>
          )}
        </nav>
      </motion.header>
    </>
  );
};

export default Navbar;
