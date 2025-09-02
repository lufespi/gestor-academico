import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Calendar,
  ClipboardList
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ReviewPanels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExaminer1, setSelectedExaminer1] = useState("");
  const [selectedExaminer2, setSelectedExaminer2] = useState("");

  const panels = [
    {
      id: 1,
      student: "Alice Johnson",
      projectTitle: "Aplicações de Machine Learning na Saúde",
      advisor: "Dr. Sarah Chen",
      examiner1: "Prof. Michael Rodriguez",
      examiner2: "Dr. James Lee",
      defenseDate: "2024-06-15",
      status: "Agendada"
    },
    {
      id: 2,
      student: "Bob Smith",
      projectTitle: "Estratégias de Planejamento Urbano Sustentável",
      advisor: "Prof. Michael Rodriguez",
      examiner1: "Dr. Sarah Chen",
      examiner2: "Prof. Emily Martinez",
      defenseDate: "2024-06-20",
      status: "Confirmada"
    },
    {
      id: 3,
      student: "Carol Davis",
      projectTitle: "Blockchain no Gerenciamento da Cadeia de Suprimentos",
      advisor: "Dr. James Lee",
      examiner1: "Dr. Sarah Chen",
      examiner2: "Prof. Michael Rodriguez",
      defenseDate: "2024-05-28",
      status: "Concluída"
    }
  ];

  const availableStudents = [
    { id: 4, name: "David Wilson", project: "Soluções de Armazenamento de Energia Renovável" },
    { id: 5, name: "Emma Brown", project: "Ética em IA para Sistemas de Tomada de Decisão" },
    { id: 6, name: "Frank Miller", project: "Computação Quântica e Criptografia" }
  ];

  const availableProfessors = [
    { id: 1, name: "Dr. Sarah Chen", department: "Ciência da Computação" },
    { id: 2, name: "Prof. Michael Rodriguez", department: "Planejamento Urbano" },
    { id: 3, name: "Dr. James Lee", department: "Administração" },
    { id: 4, name: "Prof. Emily Martinez", department: "Engenharia" },
    { id: 5, name: "Dr. Robert Johnson", department: "Filosofia" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Confirmada":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Concluída":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Cancelada":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const filteredPanels = panels.filter(panel =>
    panel.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.advisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Composição de Bancas</h1>
          <p className="text-muted-foreground">
            Definir os professores que compõem as bancas avaliadoras
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">15</CardTitle>
            <CardDescription>Bancas Formadas</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">8</CardTitle>
            <CardDescription>Defesas Agendadas</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Pendentes</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Concluídas</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form para Nova Banca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Formar Nova Banca
            </CardTitle>
            <CardDescription>
              Selecione o aluno e os dois professores avaliadores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Selecionar Aluno</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um aluno para defesa" />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStudent && (
                <p className="text-xs text-muted-foreground mt-1">
                  Projeto: {availableStudents.find(s => s.id.toString() === selectedStudent)?.project}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">1º Avaliador</label>
              <Select value={selectedExaminer1} onValueChange={setSelectedExaminer1}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o primeiro avaliador" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfessors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.name} - {professor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">2º Avaliador</label>
              <Select value={selectedExaminer2} onValueChange={setSelectedExaminer2}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o segundo avaliador" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfessors
                    .filter(prof => prof.id.toString() !== selectedExaminer1)
                    .map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.name} - {professor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full gap-2" 
              disabled={!selectedStudent || !selectedExaminer1 || !selectedExaminer2}
            >
              <ClipboardList className="w-4 h-4" />
              Formar Banca
            </Button>
          </CardContent>
        </Card>

        {/* Estatísticas dos Professores */}
        <Card>
          <CardHeader>
            <CardTitle>Participação em Bancas</CardTitle>
            <CardDescription>
              Distribuição de professores nas bancas avaliadoras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableProfessors.slice(0, 4).map((professor) => {
                const participationCount = Math.floor(Math.random() * 8) + 1;
                return (
                  <div key={professor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{professor.name}</div>
                      <div className="text-sm text-muted-foreground">{professor.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{participationCount}</div>
                      <div className="text-xs text-muted-foreground">bancas</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Bancas Formadas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Bancas Formadas
              </CardTitle>
              <CardDescription>
                Todas as bancas avaliadoras definidas
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
                placeholder="Buscar bancas..."
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
                  <TableHead>Orientador</TableHead>
                  <TableHead>Avaliadores</TableHead>
                  <TableHead>Data da Defesa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPanels.map((panel) => (
                  <TableRow key={panel.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{panel.student}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {panel.projectTitle}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{panel.advisor}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{panel.examiner1}</div>
                        <div className="text-sm">{panel.examiner2}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(panel.defenseDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(panel.status)}>
                        {panel.status}
                      </Badge>
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
                            Editar Banca
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Calendar className="w-4 h-4" />
                            Agendar Defesa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            Cancelar Banca
                          </DropdownMenuItem>
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

export default ReviewPanels;