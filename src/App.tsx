import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PredictMarket from "./pages/PredictMarket";
import Docs from "./pages/Docs";
import CreateReplicas from "./pages/CreateReplicas";
import Auth from "./pages/Auth";
import CreateReplicaForm from "./pages/CreateReplicaForm";
import MyReplicas from "./pages/MyReplicas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/predictmarket" element={<PredictMarket />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/create-replicas" element={<CreateReplicas />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create-replica" element={<CreateReplicaForm />} />
            <Route path="/my-replicas" element={<MyReplicas />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
