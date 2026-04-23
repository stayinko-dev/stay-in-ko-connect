import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import HostDashboard from "./pages/HostDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import MyPage from "./pages/MyPage.tsx";
import RequestNew from "./pages/RequestNew.tsx";
import MatchBooking from "./pages/MatchBooking.tsx";
import Community from "./pages/Community.tsx";
import SafetyTrust from "./pages/SafetyTrust.tsx";

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
            <Route path="/request/new" element={<RequestNew />} />
            <Route path="/match" element={<MatchBooking />} />
            <Route path="/community" element={<Community />} />
            <Route path="/safety" element={<SafetyTrust />} />
            <Route
              path="/host"
              element={
                <ProtectedRoute>
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
