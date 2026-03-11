import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RestaurantProvider, useRestaurant } from "@/contexts/RestaurantContext";
import Login from "./pages/Login";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MenuManagement from "./pages/MenuManagement";
import StaffManagement from "./pages/StaffManagement";
import UserManagement from "./pages/UserManagement";
import OrderHistory from "./pages/OrderHistory";
import RestaurantSettings from "./pages/RestaurantSettings";
import StaffOrderHistory from "./pages/StaffOrderHistory";
import KitchenDashboard from "./pages/KitchenDashboard";
import NotFound from "./pages/NotFound";
import {
  CustomerHome,
  CustomerMenu,
  CustomerCheckout,
  CustomerOrderSuccess,
  CustomerReceipt,
  CustomerAuth,
  CustomerOrderHistory
} from "./pages/customer";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'staff' | 'customer' }) => {
  const { currentUser } = useRestaurant();
  if (!currentUser) {
    if (requiredRole === 'customer') return <Navigate to="/auth" replace />;
    return <Navigate to="/staff/login" replace />;
  }
  if (requiredRole) {
    if (requiredRole === 'staff' && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
      return <>{children}</>;
    }
    if (currentUser.role !== requiredRole) return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RestaurantProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerHome />} />
            <Route path="/menu" element={<CustomerMenu />} />
            <Route path="/auth" element={<CustomerAuth />} />
            <Route path="/checkout" element={<ProtectedRoute requiredRole="customer"><CustomerCheckout /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><CustomerOrderHistory /></ProtectedRoute>} />
            <Route path="/order-success/:orderId" element={<CustomerOrderSuccess />} />
            <Route path="/receipt/:orderId" element={<CustomerReceipt />} />

            {/* Auth & Admin Routes */}
            <Route path="/staff/login" element={<Login />} />
            <Route path="/staff" element={<ProtectedRoute requiredRole="staff"><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/kitchen" element={<ProtectedRoute requiredRole="staff"><KitchenDashboard /></ProtectedRoute>} />
            <Route path="/staff/orders" element={<ProtectedRoute requiredRole="staff"><StaffOrderHistory /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute requiredRole="admin"><MenuManagement /></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute requiredRole="admin"><StaffManagement /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><OrderHistory /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><RestaurantSettings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
