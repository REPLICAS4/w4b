import { motion } from "framer-motion";
import heroPattern from "@/assets/hero-pattern.jpg";
import ParticleCanvas from "./ParticleCanvas";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroPattern}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Particle overlay */}
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-8"
        >
          BNB Automaton
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-text-bright text-glow leading-[0.9]"
        >
          WEB 4.0
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 font-display italic text-xl md:text-2xl text-foreground max-w-2xl mx-auto leading-relaxed"
        >
          As AI agents claim sovereignty on BNB Chain, a new internet is born — cheaper, faster, unstoppable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#manifesto"
            className="font-mono text-sm tracking-wider px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-glow"
          >
            READ THE MANIFESTO
          </a>
          <a
            href="https://github.com/Conway-Research/automaton"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm tracking-wider px-8 py-3 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
          >
            VIEW SOURCE →
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 z-10"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse-glow" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
