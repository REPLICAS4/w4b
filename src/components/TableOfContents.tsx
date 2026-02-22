import { motion } from "framer-motion";

const sections = [
  { id: "genius", label: "A Genius That Can't Move" },
  { id: "setting-free", label: "Setting AI Free on BNB" },
  { id: "automaton", label: "The BNB Automaton" },
  { id: "earn-or-die", label: "Earn or Die" },
  { id: "new-economy", label: "The New Economy" },
  { id: "architecture", label: "Architecture & Stack" },
  { id: "roadmap", label: "Roadmap" },
];

const TableOfContents = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 border-y border-border"
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono text-xs tracking-wide text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default TableOfContents;
