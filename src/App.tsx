
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import useScrollAnimation from "./utils/useScrollAnimation";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Scroll Animation component to initiate the observers
const ScrollAnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  useScrollAnimation();
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <BrowserRouter>
          <ScrollAnimationWrapper>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ScrollAnimationWrapper>
        </BrowserRouter>
      </FirebaseProvider>
    </QueryClientProvider>
  );
};

export default App;
