import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Filter,
  Star,
  FileText,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Grading = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const gradings = [
    {
      id: 1,
      student: "Alice Johnson",
      projectTitle: "Aplicações de Machine Learning na Saúde",
      type: "Proposta",
      submissionDate: "2024-05-15",
      status: "Pendente",
      dueDate: "2024-05-22"
    },
    {
      id: 2,
      student: "Bob Smith", 
      projectTitle: "Estratégias de Planejamento Urbano Sustentável",
      type: "TC Final",
      submissionDate: "2024-05-10",
      status: "Avaliado",
      grade: 8.5,
      dueDate: "2024-05-17"
    },
    {
      id: 3,
      student: "Carol Davis",
      projectTitle: "Blockchain no Gerenciamento da Cadeia de Suprimentos", 
      type: "Reelaboração Proposta",
      submissionDate: "2024-05-18",
      status: "Em Avaliação",
      dueDate: "2024-05-25"
    }
  ];

  const pendingGradings = gradings.filter(g => g.status === "Pendente" || g.status === "Em Avaliação");

  const gradingCriteria = {
    "Proposta": [
      "Relevância do Tema",
      "Fundamentação Teórica", 
      "Metodologia Proposta",
      "Cronograma de Execução",
      "Qualidade da Escrita"
    ],
    "Reelaboração Proposta": [
      "Incorporação das Sugestões",
      "Melhoria na Fundamentação",
      "Ajustes Metodológicos",
      "Cronograma Revisado",
      "Qualidade da Escrita"
    ],
    "TC Final": [
      "Desenvolvimento do Trabalho",
      "Aplicação da Metodologia",
      "Análise dos Resultados", 
      "Conclusões e Contribuições",
      "Qualidade Técnica e Científica"
    ],
    "Reelaboração TC": [
      "Correções Implementadas",
      "Melhoria nos Resultados",
      "Ajustes nas Conclusões",
      "Qualidade Final",
      "Contribuição Científica"
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Em Avaliação":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Avaliado":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Atrasado":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Proposta":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Reelaboração Proposta":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "TC Final":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Reelaboração TC":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const filteredGradings = gradings.filter(grading =>
    grading.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grading.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grading.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sistema de Avaliação</h1>
          <p className="text-muted-foreground">
            Avalie propostas e trabalhos de conclusão por critérios específicos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{pendingGradings.length}</CardTitle>
            <CardDescription>Pendentes de Avaliação</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Avaliadas este Mês</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">2</CardTitle>
            <CardDescription>Próximo ao Prazo</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">8.2</CardTitle>
            <CardDescription>Nota Média</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulário de Avaliação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Nova Avaliação
            </CardTitle>
            <CardDescription>
              Avalie trabalhos por critérios específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Selecionar Trabalho</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um trabalho para avaliar" />
                </SelectTrigger>
                <SelectContent>
                  {pendingGradings.map((grading) => (
                    <SelectItem key={grading.id} value={grading.id.toString()}>
                      {grading.student} - {grading.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Avaliação</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Reelaboração Proposta">Reelaboração Proposta</SelectItem>
                  <SelectItem value="TC Final">TC Final</SelectItem>
                  <SelectItem value="Reelaboração TC">Reelaboração TC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedType && (
              <div className="space-y-3">
                <label className="text-sm font-medium block">Critérios de Avaliação</label>
                {gradingCriteria[selectedType as keyof typeof gradingCriteria]?.map((criterion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{criterion}</span>
                    <Select>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="0-10" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(11)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Comentários</label>
              <Textarea 
                placeholder="Feedback detalhado para o aluno..."
                className="min-h-20"
              />
            </div>

            <Button className="w-full gap-2" disabled={!selectedStudent || !selectedType}>
              <Star className="w-4 h-4" />
              Salvar Avaliação
            </Button>
          </CardContent>
        </Card>

        {/* Prazos de Avaliação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prazos de Avaliação
            </CardTitle>
            <CardDescription>
              Trabalhos aguardando avaliação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingGradings.map((grading) => {
                const daysLeft = Math.ceil((new Date(grading.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysLeft < 0;
                const isUrgent = daysLeft <= 2 && daysLeft >= 0;
                
                return (
                  <div key={grading.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{grading.student}</div>
                      <div className="text-xs text-muted-foreground">{grading.type}</div>
                      <div className="text-xs text-muted-foreground">
                        Entregue: {new Date(grading.submissionDate).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="text-right">
                      {isOverdue ? (
                        <Badge className="bg-red-100 text-red-800">
                          Atrasado {Math.abs(daysLeft)} dias
                        </Badge>
                      ) : isUrgent ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          {daysLeft} dia{daysLeft !== 1 ? "s" : ""} restante{daysLeft !== 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">
                          {daysLeft} dias restantes
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Avaliações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Histórico de Avaliações
              </CardTitle>
              <CardDescription>
                Todas as avaliações realizadas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar avaliações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Prazo Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGradings.map((grading) => (
                  <TableRow key={grading.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{grading.student}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {grading.projectTitle}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(grading.type)}>
                        {grading.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(grading.submissionDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {new Date(grading.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(grading.status)}>
                        {grading.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {grading.grade ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {grading.grade}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Star className="w-4 h-4" />
                            Avaliar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            Ver Detalhes
                          </DropdownMenuItem>
                          {grading.grade && (
                            <DropdownMenuItem className="gap-2">
                              Editar Avaliação
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grading;