import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

interface DraggableCardProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  accentColor?: string;
}

const DraggableCard = ({ id, title, icon, children, accentColor = "border-primary/30" }: DraggableCardProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border rounded-xl bg-card/80 backdrop-blur-sm transition-all duration-200 ${accentColor} ${
        isDragging ? "opacity-60 shadow-2xl scale-[1.02] z-50" : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
        <button
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-primary">{icon}</span>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex-1">
          {title}
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
      {!collapsed && (
        <div className="p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default DraggableCard;
