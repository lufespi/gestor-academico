import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

export function CoordinatorDashboard() {
  const stats = [
    {
      title: "Total de Alunos",
      value: "48",
      change: "+4 este mês",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Projetos Ativos",
      value: "42",
      change: "6 entregues",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Prazos Próximos",
      value: "7",
      change: "Próximo: 3 dias",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Itens Atrasados",
      value: "3",
      change: "Precisa atenção",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const projectStatuses = [
    { status: "Proposta", count: 12, color: "bg-blue-500", percentage: 25 },
    { status: "Em Andamento", count: 18, color: "bg-yellow-500", percentage: 38 },
    { status: "Entregue", count: 10, color: "bg-green-500", percentage: 21 },
    { status: "Avaliado", count: 8, color: "bg-purple-500", percentage: 17 }
  ];

  const recentActivities = [
    {
      student: "Alice Johnson",
      action: "Entregou projeto final",
      time: "2 horas atrás",
      status: "success"
    },
    {
      student: "Bob Smith",
      action: "Perdeu prazo da proposta",
      time: "1 dia atrás",
      status: "warning"
    },
    {
      student: "Carol Davis",
      action: "Iniciou orientação com Prof. Martinez",
      time: "2 dias atrás",
      status: "info"
    },
    {
      student: "David Wilson",
      action: "Proposta reelaborada aprovada",
      time: "3 dias atrás",
      status: "success"
    }
  ];

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
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs mt-1 ${
                stat.title === "Itens Atrasados" 
                  ? "text-metric-alert" 
                  : "text-metric-secondary"
              }`}>
                {stat.change}
              </p>
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
            {projectStatuses.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-muted-foreground">{item.count} projetos</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
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
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="mt-0.5">
                    {activity.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    {activity.status === 'info' && (
                      <Clock className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
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