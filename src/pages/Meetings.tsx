import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, AlertCircle } from 'lucide-react';

interface Meeting {
  meeting_date: string;
  summary: string;
  document_url: string | null;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('get_my_meetings');
        
        if (error) {
          setError(error.message);
        } else {
          setMeetings(data || []);
        }
      } catch (err) {
        setError('Erro ao carregar as reuniões');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-8 w-24" />
            </div>
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
            <h3 className="text-lg font-semibold">Erro ao carregar reuniões</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
        <p className="text-muted-foreground">
          Histórico de reuniões de orientação com seu advisor.
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Resumo</TableHead>
              <TableHead className="w-32">Documentos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Nenhuma reunião foi registrada.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {formatDate(meeting.meeting_date)}
                  </TableCell>
                  <TableCell>{meeting.summary}</TableCell>
                  <TableCell>
                    {meeting.document_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(meeting.document_url!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Sem documentos
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Meetings;