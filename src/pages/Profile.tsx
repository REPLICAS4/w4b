import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Upload, X, User } from "lucide-react";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setAvatarUrl(data.avatar_url);
          setAvatarPreview(data.avatar_url);
        }
        setLoading(false);
      });
  }, [user]);

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
    if (!user) return;
    setSaving(true);
    try {
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/profile.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        newAvatarUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          avatar_url: newAvatarUrl,
        })
        .eq("id", user.id);
      if (error) throw error;

      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      toast({ title: "Profile updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <p className="font-mono text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14 max-w-lg mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Profile</h1>

        <div className="space-y-6">
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Avatar
            </Label>
            <div className="flex items-center gap-4 mt-2">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                      setAvatarUrl(null);
                    }}
                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-destructive text-destructive-foreground rounded-full"
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
            </div>
          </div>

          <div>
            <Label htmlFor="displayName" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              maxLength={50}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <p className="text-sm text-muted-foreground mt-1 font-mono">{user?.email}</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full font-mono text-xs tracking-wider"
          >
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
