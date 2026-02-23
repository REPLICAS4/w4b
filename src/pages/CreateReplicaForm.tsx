import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Upload, X } from "lucide-react";

const LLM_MODELS = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5", label: "GPT-5" },
];

const CreateReplicaForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    instruction: "",
    knowledge: "",
    model: "google/gemini-3-flash-preview",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
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
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile);
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

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14 max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Replica</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure your AI agent's identity and behavior.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider">Avatar</Label>
            <div className="flex items-center gap-4">
              {avatarPreview ? (
                <div className="relative">
                  <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-lg object-cover border border-border" />
                  <button
                    type="button"
                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
              <p className="text-[11px] text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="My Trading Agent"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc" className="font-mono text-xs uppercase tracking-wider">Description</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="A brief description of what this replica does..."
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Instruction */}
          <div className="space-y-2">
            <Label htmlFor="instruction" className="font-mono text-xs uppercase tracking-wider">System Instruction</Label>
            <Textarea
              id="instruction"
              value={form.instruction}
              onChange={(e) => setForm(f => ({ ...f, instruction: e.target.value }))}
              placeholder="You are a DeFi trading agent. Your goal is to..."
              rows={5}
            />
          </div>

          {/* Knowledge */}
          <div className="space-y-2">
            <Label htmlFor="knowledge" className="font-mono text-xs uppercase tracking-wider">Knowledge Base</Label>
            <Textarea
              id="knowledge"
              value={form.knowledge}
              onChange={(e) => setForm(f => ({ ...f, knowledge: e.target.value }))}
              placeholder="Paste any reference text, docs, or context your replica should know..."
              rows={5}
            />
          </div>

          {/* LLM Model */}
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider">LLM Model</Label>
            <Select value={form.model} onValueChange={(v) => setForm(f => ({ ...f, model: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full font-mono text-xs tracking-wider" disabled={loading}>
            {loading ? "CREATING..." : "CREATE REPLICA →"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateReplicaForm;
