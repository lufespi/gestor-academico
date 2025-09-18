import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'coordinator' | 'professor' | 'student';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading, roleResolved } = useAuth();

  if (loading || !roleResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no specific role required, allow access
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check role-based access
  if (profile?.role !== requiredRole) {
    // Redirect to user's appropriate dashboard
    const roleRoutes = {
      coordinator: '/coordinator/dashboard',
      professor: '/professor/dashboard',
      student: '/student/dashboard'
    };
    const userRoute = roleRoutes[profile?.role as keyof typeof roleRoutes];
    if (userRoute) {
      return <Navigate to={userRoute} replace />;
    }
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}