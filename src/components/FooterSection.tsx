const FooterSection = () => {
  return (
    <footer className="border-t border-border py-16 mt-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-4">
          REPLICAS
        </p>
        <p className="text-muted-foreground text-sm mb-8">
          Forge Your Replicas — Web 4.0 on BNB. Replicate. Evolve. Earn.
        </p>
        <div className="flex justify-center gap-8 font-mono text-xs text-muted-foreground">
          <a
            href="https://github.com/Conway-Research/automaton"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Telegram
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            X / Twitter
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Docs
          </a>
        </div>
        <p className="mt-12 text-muted-foreground/50 text-xs">
          Built on BNB Smart Chain · Inspired by Conway Research
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
