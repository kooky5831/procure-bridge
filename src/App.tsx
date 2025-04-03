import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from "react-router-dom";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Assets from "./pages/assets";
import AssetDetail from "./pages/assets/[id]";
import DepreciationSetup from "./pages/finance/DepreciationSetup";
import DepreciationSchedule from "./pages/finance/DepreciationSchedule";
import ImpairmentRevaluation from "./pages/finance/ImpairmentRevaluation";
import ERPIntegration from "./pages/finance/ERPIntegration";
import Reports from "./pages/reports";
import Requests from "./pages/requests";
import RequestDetail from "./pages/requests/[id]";
import Approvals from "./pages/requests/approvals";
import Maintenance from "./pages/maintenance";
import Vendors from "./pages/vendors";
import Users from "./pages/admin/users";
import Roles from "./pages/admin/roles";
import Workflow from "./pages/admin/workflow";
import Departments from "./pages/admin/departments";
import Integrations from "./pages/admin/integrations";
import CompanySetup from "./pages/admin/company";
import AuditLogs from "./pages/admin/audit-logs";
import GRNList from "./pages/grn/GRNList";
import GRNCreate from "./pages/grn/GRNCreate";
import GRNDetail from "./pages/grn/GRNDetail";
import DeliveryRequests from "./pages/requests/delivery";
import Login from "./pages/login";
import Signup from "./pages/signup";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Add this new component for protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Check if token exists and is not expired
  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      return true;
    }
  };

  if (!token || isTokenExpired()) {
    // Clear localStorage if token is expired
    localStorage.clear();
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes - no protection needed */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes - wrapped in DefaultLayout and ProtectedRoute */}
      <Route
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Procurement routes */}
        <Route path="/requests">
          <Route index element={<Requests />} />
          <Route path="delivery" element={<DeliveryRequests />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path=":id" element={<RequestDetail />} />
        </Route>

        {/* Asset routes */}
        <Route path="/assets" element={<Assets />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/vendors" element={<Vendors />} />

        {/* Admin routes */}
        <Route path="/admin">
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="workflow" element={<Workflow />} />
          <Route path="departments" element={<Departments />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="company" element={<CompanySetup />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          
          {/* Admin - Finance routes */}
          <Route path="finance/depreciation-setup" element={<DepreciationSetup />} />
          <Route path="finance/depreciation-schedule" element={<DepreciationSchedule />} />
          <Route path="finance/impairment-revaluation" element={<ImpairmentRevaluation />} />
          <Route path="finance/erp-integration" element={<ERPIntegration />} />
        </Route>

        {/* Reports */}
        <Route path="/reports/*" element={<Reports />} />

        {/* GRN routes */}
        <Route path="/grn">
          <Route index element={<GRNList />} />
          <Route path="create" element={<GRNCreate />} />
          <Route path=":id" element={<GRNDetail />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  console.log("App rendering"); // Debug log

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="relative">
            <Toaster />
            <Sonner />
            <AppRoutes />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
