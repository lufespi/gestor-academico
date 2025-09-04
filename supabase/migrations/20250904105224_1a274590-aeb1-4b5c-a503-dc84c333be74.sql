-- Criar tipos enum para status e roles
CREATE TYPE public.user_role AS ENUM ('coordinator', 'professor', 'student');
CREATE TYPE public.project_status AS ENUM ('proposta', 'reelaboracao_proposta', 'em_andamento', 'entregue', 'reelaboracao_tc', 'avaliado', 'aprovado', 'reprovado');
CREATE TYPE public.evaluation_type AS ENUM ('proposta', 'reelaboracao_proposta', 'tc', 'reelaboracao_tc');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de professores
CREATE TABLE public.professors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  specialization TEXT,
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de alunos
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_number TEXT NOT NULL UNIQUE,
  course TEXT NOT NULL,
  semester INTEGER NOT NULL,
  advisor_id UUID REFERENCES public.professors(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de projetos/TCs
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'proposta',
  proposal_deadline TIMESTAMP WITH TIME ZONE,
  proposal_reelaboration_deadline TIMESTAMP WITH TIME ZONE,
  tc_deadline TIMESTAMP WITH TIME ZONE,
  tc_reelaboration_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de bancas
CREATE TABLE public.review_panels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  professor1_id UUID NOT NULL REFERENCES public.professors(id),
  professor2_id UUID NOT NULL REFERENCES public.professors(id),
  defense_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT different_professors CHECK (professor1_id != professor2_id)
);

-- Tabela de critérios de avaliação
CREATE TABLE public.evaluation_criteria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_score DECIMAL(4,2) NOT NULL DEFAULT 10.00,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  evaluation_type evaluation_type NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de avaliações/notas
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.professors(id),
  criteria_id UUID NOT NULL REFERENCES public.evaluation_criteria(id),
  score DECIMAL(4,2) NOT NULL,
  comments TEXT,
  evaluation_type evaluation_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para validar score
CREATE OR REPLACE FUNCTION validate_evaluation_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.score < 0 OR NEW.score > (SELECT max_score FROM public.evaluation_criteria WHERE id = NEW.criteria_id) THEN
    RAISE EXCEPTION 'Score must be between 0 and the maximum score for this criteria';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar score
CREATE TRIGGER validate_score_trigger 
  BEFORE INSERT OR UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION validate_evaluation_score();

-- Tabela de reuniões de orientação
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.professors(id),
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  agenda TEXT,
  notes TEXT,
  next_meeting TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de documentos/uploads
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT document_belongs_to_meeting_or_project CHECK (
    (meeting_id IS NOT NULL AND project_id IS NULL) OR 
    (meeting_id IS NULL AND project_id IS NOT NULL)
  )
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professors_updated_at BEFORE UPDATE ON public.professors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_review_panels_updated_at BEFORE UPDATE ON public.review_panels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON public.evaluations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para verificar role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Políticas RLS para profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para professors
CREATE POLICY "Everyone can view professors" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Coordinators can manage professors" ON public.professors FOR ALL USING (public.get_user_role(auth.uid()) = 'coordinator');
CREATE POLICY "Professors can update their own data" ON public.professors FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para students
CREATE POLICY "Everyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Coordinators can manage students" ON public.students FOR ALL USING (public.get_user_role(auth.uid()) = 'coordinator');
CREATE POLICY "Students can view their own data" ON public.students FOR SELECT USING (auth.uid() = user_id);

-- Políticas RLS para projects
CREATE POLICY "Students can view their own projects" ON public.projects FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.students WHERE id = student_id)
);
CREATE POLICY "Professors can view projects they advise" ON public.projects FOR SELECT USING (
  auth.uid() IN (
    SELECT p.user_id FROM public.professors p
    JOIN public.students s ON s.advisor_id = p.id
    WHERE s.id = student_id
  )
);
CREATE POLICY "Coordinators can manage all projects" ON public.projects FOR ALL USING (public.get_user_role(auth.uid()) = 'coordinator');

-- Políticas RLS para evaluation_criteria
CREATE POLICY "Everyone can view evaluation criteria" ON public.evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "Coordinators can manage evaluation criteria" ON public.evaluation_criteria FOR ALL USING (public.get_user_role(auth.uid()) = 'coordinator');

-- Políticas RLS para evaluations
CREATE POLICY "Professors can view evaluations they made" ON public.evaluations FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.professors WHERE id = professor_id)
);
CREATE POLICY "Students can view their project evaluations" ON public.evaluations FOR SELECT USING (
  auth.uid() IN (
    SELECT s.user_id FROM public.students s
    JOIN public.projects p ON p.student_id = s.id
    WHERE p.id = project_id
  )
);
CREATE POLICY "Professors can insert/update their evaluations" ON public.evaluations FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.professors WHERE id = professor_id)
);
CREATE POLICY "Coordinators can view all evaluations" ON public.evaluations FOR SELECT USING (public.get_user_role(auth.uid()) = 'coordinator');

-- Políticas RLS para meetings
CREATE POLICY "Students can view their meetings" ON public.meetings FOR SELECT USING (
  auth.uid() IN (
    SELECT s.user_id FROM public.students s
    JOIN public.projects p ON p.student_id = s.id
    WHERE p.id = project_id
  )
);
CREATE POLICY "Professors can manage their meetings" ON public.meetings FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.professors WHERE id = professor_id)
);
CREATE POLICY "Coordinators can view all meetings" ON public.meetings FOR SELECT USING (public.get_user_role(auth.uid()) = 'coordinator');

-- Políticas RLS para documents
CREATE POLICY "Users can view documents they uploaded" ON public.documents FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Students can view documents from their projects" ON public.documents FOR SELECT USING (
  project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.students s ON s.id = p.student_id
    WHERE s.user_id = auth.uid()
  )
);
CREATE POLICY "Professors can view documents from meetings they conduct" ON public.documents FOR SELECT USING (
  meeting_id IN (SELECT id FROM public.meetings WHERE professor_id IN (SELECT id FROM public.professors WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can upload documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Coordinators can view all documents" ON public.documents FOR SELECT USING (public.get_user_role(auth.uid()) = 'coordinator');

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Inserir critérios de avaliação padrão
INSERT INTO public.evaluation_criteria (name, description, max_score, weight, evaluation_type) VALUES
('Originalidade', 'Grau de inovação e originalidade da proposta', 10.00, 1.00, 'proposta'),
('Fundamentação Teórica', 'Qualidade da fundamentação teórica apresentada', 10.00, 1.00, 'proposta'),
('Metodologia', 'Adequação da metodologia proposta', 10.00, 1.00, 'proposta'),
('Viabilidade', 'Viabilidade de execução do projeto', 10.00, 1.00, 'proposta'),
('Qualidade Técnica', 'Qualidade técnica do trabalho desenvolvido', 10.00, 1.50, 'tc'),
('Apresentação', 'Qualidade da apresentação oral e visual', 10.00, 1.00, 'tc'),
('Contribuição', 'Contribuição para a área de conhecimento', 10.00, 1.25, 'tc'),
('Documentação', 'Qualidade da documentação apresentada', 10.00, 1.00, 'tc');