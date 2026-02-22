import { Play, Save, Trash2, ZoomIn, ZoomOut, Maximize } from "lucide-react";

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
  return (
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

      <button
        className="flex items-center gap-1.5 px-3 py-1.5 ml-1 bg-primary text-primary-foreground font-mono text-xs rounded hover:bg-primary/90 transition-colors"
        title="Deploy Agent"
      >
        <Play className="w-3.5 h-3.5" />
        DEPLOY
      </button>
    </div>
  );
};

export default BuilderToolbar;
