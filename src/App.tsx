import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Professors from "./pages/Professors";
import Assignments from "./pages/Assignments";
import ReviewPanels from "./pages/ReviewPanels";
import Grading from "./pages/Grading";
import Deadlines from "./pages/Deadlines";
import Reports from "./pages/Reports";
import MyProject from "./pages/MyProject";
import Meetings from "./pages/Meetings";
import StudentDeadlines from "./pages/StudentDeadlines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RoleBasedDeadlines = () => {
  const { profile } = useAuth();
  if (profile?.role === 'student') {
    return <StudentDeadlines />;
  }
  return <Deadlines />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/coordinator/dashboard" element={
              <ProtectedRoute requiredRole="coordinator">
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/professor/dashboard" element={
              <ProtectedRoute requiredRole="professor">
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/dashboard" element={
              <ProtectedRoute requiredRole="student">
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/my-project" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyProject />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/meetings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Meetings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute requiredRole="coordinator">
                <DashboardLayout>
                  <Students />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/professors" element={
              <ProtectedRoute requiredRole="coordinator">
                <DashboardLayout>
                  <Professors />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Assignments />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/review-panels" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReviewPanels />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/grading" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Grading />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/deadlines" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RoleBasedDeadlines />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requiredRole="coordinator">
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
