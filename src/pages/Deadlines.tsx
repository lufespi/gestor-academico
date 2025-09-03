import { useState } from "react";
import { Calendar, Plus, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Deadline {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'proposta' | 'reelaboracao-proposta' | 'tc' | 'reelaboracao-tc';
  status: 'agendado' | 'em-andamento' | 'vencido';
}

const mockDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'Entrega da Proposta',
    description: 'Prazo para entrega da proposta inicial do trabalho de conclusão',
    date: '2024-03-15',
    type: 'proposta',
    status: 'agendado'
  },
  {
    id: '2',
    title: 'Reelaboração da Proposta',
    description: 'Prazo para entrega da proposta reelaborada após feedback',
    date: '2024-04-10',
    type: 'reelaboracao-proposta',
    status: 'em-andamento'
  },
  {
    id: '3',
    title: 'Entrega do TC',
    description: 'Prazo para entrega do trabalho de conclusão final',
    date: '2024-06-15',
    type: 'tc',
    status: 'agendado'
  }
];

const typeLabels = {
  'proposta': 'Proposta',
  'reelaboracao-proposta': 'Reelaboração da Proposta',
  'tc': 'Trabalho de Conclusão',
  'reelaboracao-tc': 'Reelaboração do TC'
};

const statusColors = {
  'agendado': 'bg-blue-100 text-blue-800',
  'em-andamento': 'bg-yellow-100 text-yellow-800',
  'vencido': 'bg-red-100 text-red-800'
};

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>(mockDeadlines);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDeadline = () => {
    // Lógica para adicionar novo prazo
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cronograma de Entregas</h1>
          <p className="text-muted-foreground">
            Gerencie os prazos de entrega dos trabalhos de conclusão
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Prazo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Prazo</DialogTitle>
              <DialogDescription>
                Defina um novo prazo de entrega para os alunos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Entrega da Proposta"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipo
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="proposta">Proposta</SelectItem>
                    <SelectItem value="reelaboracao-proposta">Reelaboração da Proposta</SelectItem>
                    <SelectItem value="tc">Trabalho de Conclusão</SelectItem>
                    <SelectItem value="reelaboracao-tc">Reelaboração do TC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os detalhes do prazo..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddDeadline}>
                Adicionar Prazo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Prazos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deadlines.filter(d => d.status === 'em-andamento').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {deadlines.filter(d => d.status === 'vencido').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos 30 dias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Deadlines List */}
      <Card>
        <CardHeader>
          <CardTitle>Prazos Ativos</CardTitle>
          <CardDescription>
            Lista de todos os prazos de entrega configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{deadline.title}</h3>
                    <Badge className={statusColors[deadline.status]}>
                      {deadline.status === 'agendado' ? 'Agendado' : 
                       deadline.status === 'em-andamento' ? 'Em Andamento' : 'Vencido'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {deadline.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Tipo: {typeLabels[deadline.type]}</span>
                    <span>Data: {new Date(deadline.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Deadlines;