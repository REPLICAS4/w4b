import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

const LLM_MODELS = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5", label: "GPT-5" },
];

interface Replica {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  instruction: string | null;
  knowledge: string | null;
  model: string;
}

interface EditReplicaDialogProps {
  replica: Replica | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Replica) => void;
}

const EditReplicaDialog = ({ replica, open, onClose, onSaved }: EditReplicaDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    instruction: "",
    knowledge: "",
    model: "google/gemini-3-flash-preview",
  });

  // Reset form when replica changes
  const [lastId, setLastId] = useState<string | null>(null);
  if (replica && replica.id !== lastId) {
    setLastId(replica.id);
    setForm({
      name: replica.name,
      description: replica.description || "",
      instruction: replica.instruction || "",
      knowledge: replica.knowledge || "",
      model: replica.model,
    });
    setAvatarPreview(replica.avatar_url);
    setAvatarFile(null);
  }

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

  const handleSave = async () => {
    if (!user || !replica) return;
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let avatar_url = avatarPreview;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("replicas")
        .update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          avatar_url,
          instruction: form.instruction.trim() || null,
          knowledge: form.knowledge.trim() || null,
          model: form.model,
        })
        .eq("id", replica.id);
      if (error) throw error;

      onSaved({
        ...replica,
        name: form.name.trim(),
        description: form.description.trim() || null,
        avatar_url,
        instruction: form.instruction.trim() || null,
        knowledge: form.knowledge.trim() || null,
        model: form.model,
      });
      toast({ title: "Replica updated!" });
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Replica</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Name *</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} />
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Avatar</Label>
            <div className="flex items-center gap-3 mt-1">
              {avatarPreview ? (
                <div className="relative">
                  <img src={avatarPreview} alt="Avatar" className="w-14 h-14 rounded-lg object-cover border border-border" />
                  <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(null); }} className="absolute -top-1.5 -right-1.5 p-0.5 bg-destructive text-destructive-foreground rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-14 h-14 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} maxLength={500} rows={2} className="resize-none" />
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">System Instruction</Label>
            <Textarea value={form.instruction} onChange={(e) => setForm((f) => ({ ...f, instruction: e.target.value }))} rows={4} className="resize-none font-mono text-xs" />
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Knowledge Base</Label>
            <Textarea value={form.knowledge} onChange={(e) => setForm((f) => ({ ...f, knowledge: e.target.value }))} rows={4} className="resize-none" />
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Model</Label>
            <Select value={form.model} onValueChange={(v) => setForm((f) => ({ ...f, model: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LLM_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full font-mono text-xs tracking-wider">
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditReplicaDialog;
