import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { label: "Win Rate", value: 68, suffix: "%" },
  { label: "Total Predictions", value: 1247 },
  { label: "Net Profit", value: 892, prefix: "+$" },
  { label: "ROI", value: 178, prefix: "+", suffix: "%" },
];

const AnimatedCounter = ({ item, inView }: { item: StatItem; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = item.value;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, item.value]);

  return (
    <span className="font-mono text-3xl md:text-4xl font-bold text-text-bright">
      {item.prefix}
      {count.toLocaleString()}
      {item.suffix}
    </span>
  );
};

const PredictionStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="py-16 max-w-4xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-2">
        Live Stats
      </h2>
      <p className="text-muted-foreground text-sm mb-10 font-mono">
        Cumulative agent performance metrics
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-border bg-card p-5 text-center"
          >
            <AnimatedCounter item={stat} inView={inView} />
            <p className="font-mono text-xs text-muted-foreground mt-2 tracking-wider uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default PredictionStats;
