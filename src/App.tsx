import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext.tsx";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider, PublicRoute, AdminRoute } from "@/lib/authSystem";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Categories from "./pages/Categories";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import { SixDigitLogin } from "./components/SixDigitLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/search" element={<Search />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/categories" element={<Categories />} />
                
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <SixDigitLogin />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } 
                />
                
                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
