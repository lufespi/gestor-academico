import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Professors from "./pages/Professors";
import Assignments from "./pages/Assignments";
import ReviewPanels from "./pages/ReviewPanels";
import Grading from "./pages/Grading";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/students" element={
            <DashboardLayout>
              <Students />
            </DashboardLayout>
          } />
          <Route path="/professors" element={
            <DashboardLayout>
              <Professors />
            </DashboardLayout>
          } />
          <Route path="/assignments" element={
            <DashboardLayout>
              <Assignments />
            </DashboardLayout>
          } />
          <Route path="/review-panels" element={
            <DashboardLayout>
              <ReviewPanels />
            </DashboardLayout>
          } />
          <Route path="/grading" element={
            <DashboardLayout>
              <Grading />
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
