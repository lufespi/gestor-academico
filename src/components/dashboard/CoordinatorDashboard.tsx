import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp 
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface DashboardMetrics {
  totalStudents: number;
  activeProjects: number;
  upcomingDeadlines: number;
  overdueItems: number;
}

interface ProjectStatus {
  status_name: string;
  project_count: number;
}

interface RecentActivity {
  description: string;
  created_at: string;
  type: string;
}

export function CoordinatorDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 0,
    activeProjects: 0,
    upcomingDeadlines: 0,
    overdueItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [projectStatusLoading, setProjectStatusLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch metrics
        setLoading(true);
        const [
          { data: totalStudents },
          { data: activeProjects },
          { data: upcomingDeadlines },
          { data: overdueItems }
        ] = await Promise.all([
          supabase.rpc('get_total_students'),
          supabase.rpc('get_active_projects'),
          supabase.rpc('get_upcoming_deadlines_count'),
          supabase.rpc('get_overdue_items_count')
        ]);

        setMetrics({
          totalStudents: totalStudents || 0,
          activeProjects: activeProjects || 0,
          upcomingDeadlines: upcomingDeadlines || 0,
          overdueItems: overdueItems || 0
        });
        setLoading(false);

        // Fetch project status distribution
        setProjectStatusLoading(true);
        const { data: statusData, error: statusError } = await supabase.rpc('get_project_status_distribution');
        if (statusError) {
          console.error('Error fetching project status distribution:', statusError);
        } else {
          setProjectStatuses(statusData || []);
        }
        setProjectStatusLoading(false);

        // Fetch recent activities
        setActivitiesLoading(true);
        const { data: activitiesData, error: activitiesError } = await supabase.rpc('get_recent_activities');
        if (activitiesError) {
          console.error('Error fetching recent activities:', activitiesError);
        } else {
          setRecentActivities(activitiesData || []);
        }
        setActivitiesLoading(false);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
        setProjectStatusLoading(false);
        setActivitiesLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const stats = [
    {
      title: "Total de Alunos",
      value: metrics.totalStudents,
      change: "+4 este mês",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Projetos Ativos",
      value: metrics.activeProjects,
      change: "6 entregues",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Prazos Próximos",
      value: metrics.upcomingDeadlines,
      change: "Próximo: 3 dias",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Itens Atrasados",
      value: metrics.overdueItems,
      change: "Precisa atenção",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  // Calculate total projects and percentages for dynamic project statuses
  const totalProjects = projectStatuses.reduce((sum, status) => sum + Number(status.project_count), 0);
  
  const statusColors: Record<string, string> = {
    "Proposta": "bg-blue-500",
    "Em Andamento": "bg-yellow-500", 
    "Entregue": "bg-green-500",
    "Avaliado": "bg-purple-500"
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'info':
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-glow">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center justify-between p-8 text-white">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Painel do Coordenador</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Gerencie projetos de TC, acompanhe o progresso dos alunos e coordene com o corpo docente
            </p>
            <div className="flex gap-4 pt-4">
              <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Ver Todos os Alunos
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Gerar Relatório
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src={dashboardHero} 
              alt="Academic Dashboard" 
              className="w-64 h-40 object-cover rounded-lg opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className={`text-xs mt-1 ${
                    stat.title === "Itens Atrasados" 
                      ? "text-metric-alert" 
                      : "text-metric-secondary"
                  }`}>
                    {stat.change}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Visão Geral dos Projetos
            </CardTitle>
            <CardDescription>
              Distribuição atual dos status dos projetos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectStatusLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : projectStatuses.length > 0 ? (
              projectStatuses.map((item) => (
                <div key={item.status_name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.status_name}</span>
                    <span className="text-muted-foreground">{item.project_count} projetos</span>
                  </div>
                  <Progress 
                    value={totalProjects > 0 ? (Number(item.project_count) / totalProjects) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">Nenhum dado de projeto disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas atualizações de alunos e professores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Skeleton className="w-4 h-4 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente para mostrar</p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Atividades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Tarefas comuns para coordenação de TC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="w-6 h-6" />
              Adicionar Aluno
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Calendar className="w-6 h-6" />
              Definir Prazo
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <FileText className="w-6 h-6" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}