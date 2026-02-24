import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Replica {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  model: string;
}

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-replica`;

const ChatReplica = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [replica, setReplica] = useState<Replica | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Load replica info
  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("replicas")
      .select("id, name, description, avatar_url, model")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Replica not found", variant: "destructive" });
          navigate("/discovery");
        } else {
          setReplica(data);
        }
      });
  }, [user, id, navigate, toast]);

  // Load chat history
  useEffect(() => {
    if (!user || !id || historyLoaded) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("replica_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessages(data as Msg[]);
        }
        setHistoryLoaded(true);
      });
  }, [user, id, historyLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessage = async (msg: Msg) => {
    if (!user || !id) return;
    await supabase.from("chat_messages").insert({
      replica_id: id,
      user_id: user.id,
      role: msg.role,
      content: msg.content,
    });
  };

  const send = async () => {
    if (!input.trim() || streaming || !id) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Save user message
    saveMessage(userMsg);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages, replicaId: id }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Stream failed" }));
        toast({ title: "Error", description: err.error || "Failed to chat", variant: "destructive" });
        setStreaming(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      let done = false;
      while (!done) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save complete assistant message
      if (assistantSoFar) {
        saveMessage({ role: "assistant", content: assistantSoFar });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Chat error", variant: "destructive" });
    }
    setStreaming(false);
  };

  if (authLoading || !replica) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Header */}
      <div className="pt-14 border-b border-border bg-card/30">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/discovery"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          {replica.avatar_url ? (
            <img src={replica.avatar_url} alt={replica.name} className="w-8 h-8 rounded-lg object-cover border border-border" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
          )}
          <div>
            <h2 className="font-mono text-sm font-semibold text-foreground">{replica.name}</h2>
            <p className="text-[10px] text-muted-foreground">{replica.model.includes("/") ? replica.model.split("/")[1] : replica.model}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-mono text-sm">Start chatting with {replica.name}</p>
              {replica.description && (
                <p className="text-muted-foreground/60 text-xs mt-2 max-w-md mx-auto">{replica.description}</p>
              )}
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {streaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border rounded-lg px-4 py-2.5 text-sm">
                <span className="animate-pulse">●●●</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/30">
        <div className="max-w-3xl mx-auto px-6 py-3 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="font-mono text-sm bg-background"
            disabled={streaming}
          />
          <Button size="icon" onClick={send} disabled={streaming || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatReplica;
