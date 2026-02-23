import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import DraggableCard from "@/components/replica-form/DraggableCard";
import {
  Upload,
  X,
  User,
  FileText,
  Terminal,
  BookOpen,
  Cpu,
  Rocket,
} from "lucide-react";

const LLM_MODELS = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5", label: "GPT-5" },
];

const INITIAL_ORDER = ["identity", "description", "instruction", "knowledge", "model"];

const CreateReplicaForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cardOrder, setCardOrder] = useState(INITIAL_ORDER);
  const [form, setForm] = useState({
    name: "",
    description: "",
    instruction: "",
    knowledge: "",
    model: "google/gemini-3-flash-preview",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let avatar_url: string | null = null;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("replicas").insert({
        owner_id: user.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        avatar_url,
        instruction: form.instruction.trim() || null,
        knowledge: form.knowledge.trim() || null,
        model: form.model,
      });
      if (error) throw error;

      toast({ title: "Replica created!" });
      navigate("/my-replicas");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) { navigate("/auth"); return null; }

  const cardContent: Record<string, React.ReactNode> = {
    identity: (
      <DraggableCard id="identity" title="Identity" icon={<User className="w-4 h-4" />} accentColor="border-amber-400/30">
        <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="My Trading Agent"
          maxLength={100}
        />
        <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Avatar</Label>
        <div className="flex items-center gap-3">
          {avatarPreview ? (
            <div className="relative">
              <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-lg object-cover border border-border" />
              <button
                type="button"
                onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                className="absolute -top-1.5 -right-1.5 p-0.5 bg-destructive text-destructive-foreground rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          )}
          <p className="text-[10px] text-muted-foreground">PNG, JPG · max 5MB</p>
        </div>
      </DraggableCard>
    ),
    description: (
      <DraggableCard id="description" title="Description" icon={<FileText className="w-4 h-4" />} accentColor="border-emerald-400/30">
        <Textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="A brief description of what this replica does..."
          maxLength={500}
          rows={3}
          className="resize-none"
        />
      </DraggableCard>
    ),
    instruction: (
      <DraggableCard id="instruction" title="System Instruction" icon={<Terminal className="w-4 h-4" />} accentColor="border-purple-400/30">
        <Textarea
          value={form.instruction}
          onChange={(e) => setForm((f) => ({ ...f, instruction: e.target.value }))}
          placeholder="You are a DeFi trading agent. Your goal is to..."
          rows={5}
          className="resize-none font-mono text-xs"
        />
      </DraggableCard>
    ),
    knowledge: (
      <DraggableCard id="knowledge" title="Knowledge Base" icon={<BookOpen className="w-4 h-4" />} accentColor="border-cyan-400/30">
        <Textarea
          value={form.knowledge}
          onChange={(e) => setForm((f) => ({ ...f, knowledge: e.target.value }))}
          placeholder="Paste any reference text, docs, or context..."
          rows={5}
          className="resize-none"
        />
      </DraggableCard>
    ),
    model: (
      <DraggableCard id="model" title="LLM Model" icon={<Cpu className="w-4 h-4" />} accentColor="border-blue-400/30">
        <Select value={form.model} onValueChange={(v) => setForm((f) => ({ ...f, model: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LLM_MODELS.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DraggableCard>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14 max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Create Replica</h1>
          <p className="text-sm text-muted-foreground">
            Drag cards to reorder · Collapse sections you don't need
          </p>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {cardOrder.map((id) => (
                <div key={id}>{cardContent[id]}</div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 font-mono text-xs tracking-wider gap-2"
          size="lg"
        >
          <Rocket className="w-4 h-4" />
          {loading ? "CREATING..." : "DEPLOY REPLICA →"}
        </Button>
      </div>
    </div>
  );
};

export default CreateReplicaForm;
