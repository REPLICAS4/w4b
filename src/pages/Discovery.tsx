import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Brain, Copy, MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Replica {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  model: string;
  owner_id: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

const Discovery = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cloning, setCloning] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("replicas")
        .select("id, name, description, avatar_url, model, owner_id, created_at, profiles!replicas_owner_id_fkey(display_name, avatar_url)")
        .order("created_at", { ascending: false });
      if (!error) setReplicas((data as unknown as Replica[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleClone = async (replica: Replica) => {
    if (!user) { navigate("/auth"); return; }
    setCloning(replica.id);
    const { data: full, error: fetchErr } = await supabase
      .from("replicas")
      .select("*")
      .eq("id", replica.id)
      .single();

    if (fetchErr || !full) {
      toast({ title: "Error", description: "Could not fetch replica data", variant: "destructive" });
      setCloning(null);
      return;
    }

    const { error } = await supabase.from("replicas").insert({
      name: `${full.name} (clone)`,
      description: full.description,
      avatar_url: full.avatar_url,
      instruction: full.instruction,
      knowledge: full.knowledge,
      model: full.model,
      owner_id: user.id,
    });

    if (error) {
      toast({ title: "Clone failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Replica cloned!", description: "Check My Replicas to see it." });
    }
    setCloning(null);
  };

  const filtered = replicas.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="pt-14 max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Discover Replicas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, chat with, and clone replicas from the community.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search replicas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 font-mono text-sm bg-card/50 border-border"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No replicas found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="group border border-border rounded-lg p-5 bg-card/50 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  {r.avatar_url ? (
                    <img
                      src={r.avatar_url}
                      alt={r.name}
                      className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm font-semibold text-foreground truncate">
                      {r.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {r.description || "No description"}
                    </p>
                    <p className="font-mono text-[10px] text-primary mt-1">
                      {r.model.includes("/") ? r.model.split("/")[1] : r.model}
                    </p>
                  </div>
                </div>

                {r.profiles?.display_name && (
                  <p className="text-[10px] text-muted-foreground mb-3 font-mono">
                    by {r.profiles.display_name}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 font-mono text-[11px] tracking-wider"
                    onClick={() => {
                      if (!user) { navigate("/auth"); return; }
                      navigate(`/chat/${r.id}`);
                    }}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    CHAT
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="font-mono text-[11px] tracking-wider"
                    onClick={() => handleClone(r)}
                    disabled={cloning === r.id}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {cloning === r.id ? "..." : "CLONE"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
