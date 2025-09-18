import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  BookOpen,
  FileText,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfessorMetrics {
  totalAdvisees: number;
  pendingGradings: number;
  upcomingMeetings: number;
  projectsInProgress: number;
}

export function ProfessorDashboard() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<ProfessorMetrics>({
    totalAdvisees: 0,
    pendingGradings: 0,
    upcomingMeetings: 0,
    projectsInProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessorData = async () => {
      if (!profile) return;
      
      setLoading(true);
      try {
        // Mock data for now - will be replaced with actual RPC calls
        setMetrics({
          totalAdvisees: 8,
          pendingGradings: 3,
          upcomingMeetings: 2,
          projectsInProgress: 6
        });
      } catch (error) {
        console.error('Error fetching professor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, [profile]);

  const stats = [
    {
      title: "Meus Orientandos",
      value: metrics.totalAdvisees,
      change: "3 novos este semestre",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Avaliações Pendentes",
      value: metrics.pendingGradings,
      change: "2 prazos próximos",
      icon: ClipboardList,
      color: "text-orange-600"
    },
    {
      title: "Reuniões Esta Semana",
      value: metrics.upcomingMeetings,
      change: "Próxima: amanhã",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Projetos Ativos",
      value: metrics.projectsInProgress,
      change: "2 finalizando",
      icon: FileText,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Painel do Professor</h1>
        <p className="text-muted-foreground">
          Acompanhe seus orientandos, avaliações e atividades acadêmicas
        </p>
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
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>
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
        {/* Recent Advisee Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Atividades dos Orientandos
            </CardTitle>
            <CardDescription>
              Últimas atualizações dos seus alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Ana Silva", activity: "Entregou proposta de TC", time: "2h atrás", status: "success" },
                { name: "João Santos", activity: "Agendou reunião", time: "1 dia atrás", status: "info" },
                { name: "Maria Costa", activity: "Submeteu revisão", time: "3 dias atrás", status: "warning" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.activity}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Orientandos
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximas Tarefas
            </CardTitle>
            <CardDescription>
              Avaliações e compromissos pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Avaliar proposta - Ana Silva", due: "Hoje", priority: "high" },
                { task: "Reunião com João Santos", due: "Amanhã 14h", priority: "medium" },
                { task: "Revisar TC - Maria Costa", due: "Sexta-feira", priority: "low" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.due}</p>
                  </div>
                  <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                    {item.priority === 'high' ? 'Urgente' : item.priority === 'medium' ? 'Normal' : 'Baixa'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              Ver Agenda Completa
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Tarefas comuns para professores orientadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <BookOpen className="w-6 h-6" />
              Agendar Reunião
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <ClipboardList className="w-6 h-6" />
              Avaliar Trabalho
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <FileText className="w-6 h-6" />
              Gerar Relatório
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="w-6 h-6" />
              Ver Orientandos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}