import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import EditReplicaDialog from "@/components/EditReplicaDialog";
import { Plus, Trash2, Brain, Pencil } from "lucide-react";

interface Replica {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  instruction: string | null;
  knowledge: string | null;
  model: string;
  created_at: string;
}

const MyReplicas = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loading, setLoading] = useState(true);
  const [editReplica, setEditReplica] = useState<Replica | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchReplicas = async () => {
      const { data, error } = await supabase
        .from("replicas")
        .select("id, name, description, avatar_url, instruction, knowledge, model, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Error loading replicas", description: error.message, variant: "destructive" });
      } else {
        setReplicas(data || []);
      }
      setLoading(false);
    };
    fetchReplicas();
  }, [user, toast]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("replicas").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setReplicas((r) => r.filter((x) => x.id !== id));
      toast({ title: "Replica deleted" });
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
      <div className="pt-14 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Replicas</h1>
            <p className="text-sm text-muted-foreground mt-1">{replicas.length} replica{replicas.length !== 1 ? "s" : ""}</p>
          </div>
          <Button asChild className="font-mono text-xs tracking-wider">
            <Link to="/create-replica"><Plus className="w-4 h-4 mr-2" />NEW REPLICA</Link>
          </Button>
        </div>

        {replicas.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No replicas yet</p>
            <Button asChild variant="outline" className="font-mono text-xs">
              <Link to="/create-replica">Create your first replica</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {replicas.map((r) => (
              <div key={r.id} className="border border-border rounded-lg p-4 bg-card/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt={r.name} className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm font-semibold text-foreground truncate">{r.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{r.description || "No description"}</p>
                    <p className="font-mono text-[10px] text-primary mt-1">{r.model.split("/")[1]}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditReplica(r)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditReplicaDialog
        replica={editReplica}
        open={!!editReplica}
        onClose={() => setEditReplica(null)}
        onSaved={(updated) => {
          setReplicas((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
        }}
      />
    </div>
  );
};

export default MyReplicas;
