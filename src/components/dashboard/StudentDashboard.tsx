import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface StudentData {
  projectTitle: string;
  projectStatus: string;
  advisorName: string;
  nextDeadline: string;
  overallProgress: number;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Mock data for now - will be replaced with actual RPC calls
        setStudentData({
          projectTitle: "Sistema de Gestão Acadêmica com IA",
          projectStatus: "development",
          advisorName: "Prof. Dr. Carlos Silva",
          nextDeadline: "Entrega do TC - 15/11/2024",
          overallProgress: 65
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposal': return 'secondary';
      case 'development': return 'default';
      case 'final_submission': return 'outline';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'proposal': return 'Proposta';
      case 'development': return 'Em Desenvolvimento';
      case 'final_submission': return 'Aguardando Avaliação';
      case 'completed': return 'Finalizado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground">Você ainda não foi atribuído a um projeto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meu Painel</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso do seu trabalho de conclusão de curso
        </p>
      </div>

      {/* Project Overview */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{studentData.projectTitle}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Orientador: {studentData.advisorName}
              </CardDescription>
            </div>
            <Badge variant={getStatusColor(studentData.projectStatus)}>
              {getStatusLabel(studentData.projectStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm text-muted-foreground">{studentData.overallProgress}%</span>
              </div>
              <Progress value={studentData.overallProgress} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Próximo prazo:</span>
              <span className="font-medium">{studentData.nextDeadline}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximos Prazos
            </CardTitle>
            <CardDescription>
              Mantenha-se atualizado com as datas importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Entrega Final do TC", date: "15/11/2024", status: "pending", days: 5 },
                { task: "Apresentação de Defesa", date: "22/11/2024", status: "pending", days: 12 },
                { task: "Correções Finais", date: "30/11/2024", status: "pending", days: 20 }
              ].map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{deadline.days} dias</p>
                    <p className="text-xs text-muted-foreground">restantes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Suas últimas interações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  action: "Reunião de orientação realizada", 
                  time: "Há 2 dias", 
                  type: "success",
                  icon: CheckCircle 
                },
                { 
                  action: "Documento enviado para revisão", 
                  time: "Há 1 semana", 
                  type: "info",
                  icon: FileText 
                },
                { 
                  action: "Feedback do orientador recebido", 
                  time: "Há 2 semanas", 
                  type: "warning",
                  icon: AlertTriangle 
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <activity.icon className={`w-4 h-4 mt-0.5 ${
                    activity.type === 'success' ? 'text-green-500' :
                    activity.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <FileText className="w-6 h-6" />
              Ver Meu Projeto
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <BookOpen className="w-6 h-6" />
              Histórico de Reuniões
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Calendar className="w-6 h-6" />
              Calendário de Prazos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}