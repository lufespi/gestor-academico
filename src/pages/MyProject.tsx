import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface ProjectDetails {
  project_title: string;
  project_description: string;
  project_status: string;
  advisor_name: string;
}

const MyProject = () => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!user) return;

      try {
        const { data, error } = await (supabase as any).rpc('get_my_project_details');
        
        if (error) {
          setError(error.message);
        } else {
          setProject((data as any) as ProjectDetails);
        }
      } catch (err) {
        setError('Erro ao carregar os dados do projeto');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'proposta':
        return 'secondary';
      case 'em_andamento':
        return 'default';
      case 'entregue':
        return 'outline';
      case 'avaliado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'proposta':
        return 'Proposta';
      case 'em_andamento':
        return 'Em Andamento';
      case 'entregue':
        return 'Entregue';
      case 'avaliado':
        return 'Avaliado';
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Erro ao carregar projeto</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground">Você ainda não foi atribuído a um projeto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Projeto</h1>
        <p className="text-muted-foreground">
          Visualize os detalhes do seu projeto de trabalho de conclusão.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{project.project_title}</CardTitle>
              <CardDescription>
                Orientador: {project.advisor_name}
              </CardDescription>
            </div>
            <Badge variant={getStatusColor(project.project_status)}>
              {getStatusLabel(project.project_status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Descrição do Projeto</h4>
              <p className="text-muted-foreground leading-relaxed">
                {project.project_description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProject;