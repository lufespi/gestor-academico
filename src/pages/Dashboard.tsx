import { CoordinatorDashboard } from "@/components/dashboard/CoordinatorDashboard";
import { ProfessorDashboard } from "@/components/dashboard/ProfessorDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }
  
  switch (profile?.role) {
    case 'coordinator':
      return <CoordinatorDashboard />;
    case 'professor':
      return <ProfessorDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <CoordinatorDashboard />;
  }
};

export default Dashboard;