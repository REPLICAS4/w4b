import { motion } from "framer-motion";

interface DegenScoreGaugeProps {
  label: string;
  score: number;
  maxScore?: number;
  colorClass?: string;
}

const DegenScoreGauge = ({ label, score, maxScore = 10, colorClass }: DegenScoreGaugeProps) => {
  const percentage = (score / maxScore) * 100;
  const getColor = () => {
    if (colorClass) return colorClass;
    if (score <= 3) return "bg-green-500";
    if (score <= 6) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-bold text-foreground">{score}/{maxScore}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
    </div>
  );
};

export default DegenScoreGauge;
