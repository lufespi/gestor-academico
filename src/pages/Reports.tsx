import { BarChart3, FileText, Download, Users, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const projectStatusData = [
    { status: "Proposta Aprovada", count: 45, percentage: 67 },
    { status: "Em Desenvolvimento", count: 18, percentage: 27 },
    { status: "Aguardando Defesa", count: 3, percentage: 4 },
    { status: "Concluído", count: 1, percentage: 2 }
  ];

  const advisorPerformance = [
    { name: "Prof. Silva", advisees: 8, completed: 6, inProgress: 2 },
    { name: "Prof. Santos", advisees: 6, completed: 4, inProgress: 2 },
    { name: "Prof. Oliveira", advisees: 5, completed: 3, inProgress: 2 },
    { name: "Prof. Costa", advisees: 4, completed: 2, inProgress: 2 }
  ];

  const gradeDistribution = [
    { range: "9.0 - 10.0", count: 5 },
    { range: "8.0 - 8.9", count: 12 },
    { range: "7.0 - 7.9", count: 8 },
    { range: "6.0 - 6.9", count: 3 },
    { range: "< 6.0", count: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e estatísticas do programa de trabalhos de conclusão
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao semestre anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              Meta: 85%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orientadores Ativos</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Média de 2.9 orientandos por professor
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2</div>
            <p className="text-xs text-muted-foreground">
              +0.3 pontos vs. semestre anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Status dos Projetos</TabsTrigger>
          <TabsTrigger value="advisors">Desempenho dos Orientadores</TabsTrigger>
          <TabsTrigger value="grades">Distribuição de Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos por Fase</CardTitle>
              <CardDescription>
                Distribuição dos trabalhos de conclusão por etapa de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.status}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} projetos ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho dos Orientadores</CardTitle>
              <CardDescription>
                Estatísticas de orientação por professor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advisorPerformance.map((advisor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{advisor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {advisor.advisees} orientandos ativos
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {advisor.completed} concluídos
                      </Badge>
                      <Badge variant="outline">
                        {advisor.inProgress} em andamento
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Notas</CardTitle>
              <CardDescription>
                Análise das notas atribuídas aos trabalhos defendidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeDistribution.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{grade.range}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {grade.count} trabalhos
                      </span>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(grade.count / 29) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;