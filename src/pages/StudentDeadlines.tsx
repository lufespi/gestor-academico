import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, AlertCircle } from 'lucide-react';

interface Deadline {
  deadline_name: string;
  due_date: string;
  status: string;
}

const StudentDeadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDeadlines = async () => {
      if (!user) return;

      try {
        const { data, error } = await (supabase as any).rpc('get_my_deadlines');
        
        if (error) {
          setError(error.message);
        } else {
          setDeadlines((data as any[]) || []);
        }
      } catch (err) {
        setError('Erro ao carregar os prazos');
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'entregue':
        return 'default';
      case 'pending':
      case 'pendente':
        return 'secondary';
      case 'overdue':
      case 'atrasado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'entregue':
        return 'Entregue';
      case 'pending':
      case 'pendente':
        return 'Pendente';
      case 'overdue':
      case 'atrasado':
        return 'Atrasado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Erro ao carregar prazos</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prazos</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os prazos importantes do seu projeto.
        </p>
      </div>

      {deadlines.length === 0 ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum prazo definido</h3>
              <p className="text-muted-foreground">
                Não há prazos estabelecidos para o seu projeto ainda.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {deadlines.map((deadline, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{deadline.deadline_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(deadline.due_date)}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(deadline.status)}>
                    {getStatusLabel(deadline.status)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDeadlines;