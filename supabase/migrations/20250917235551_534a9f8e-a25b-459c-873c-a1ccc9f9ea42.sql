-- Create comprehensive schema for thesis management system

-- Create user role enum
CREATE TYPE user_role AS ENUM ('coordinator', 'professor', 'student');

-- Create project status enum  
CREATE TYPE project_status AS ENUM ('proposal', 'proposal_revision', 'development', 'final_submission', 'final_revision', 'completed', 'cancelled');

-- Create deadline kind enum
CREATE TYPE deadline_kind AS ENUM ('proposal_submission', 'proposal_revision', 'final_submission', 'final_revision');

-- Create grade stage enum
CREATE TYPE grade_stage AS ENUM ('proposal', 'proposal_revision', 'final_project', 'final_revision');

-- Create students table
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_number TEXT NOT NULL UNIQUE,
    course TEXT NOT NULL DEFAULT 'Engenharia de Software',
    semester INTEGER NOT NULL DEFAULT 1,
    advisor_id UUID REFERENCES public.professors(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professors table
CREATE TABLE public.professors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    department TEXT,
    specialization TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table  
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    abstract TEXT,
    status project_status NOT NULL DEFAULT 'proposal',
    proposal_deadline TIMESTAMP WITH TIME ZONE,
    proposal_reelaboration_deadline TIMESTAMP WITH TIME ZONE,
    tc_deadline TIMESTAMP WITH TIME ZONE,
    tc_reelaboration_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_status_history table
CREATE TABLE public.project_status_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status project_status NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    notes TEXT
);

-- Create deadlines table
CREATE TABLE public.deadlines (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    kind deadline_kind NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table
CREATE TABLE public.meetings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES public.professors(id),
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    agenda TEXT,
    notes TEXT,
    next_meeting TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create files/documents table
CREATE TABLE public.documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    project_id UUID REFERENCES public.projects(id),
    meeting_id UUID REFERENCES public.meetings(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create review_panels table
CREATE TABLE public.review_panels (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    professor1_id UUID NOT NULL REFERENCES public.professors(id),
    professor2_id UUID NOT NULL REFERENCES public.professors(id),
    defense_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grade_criteria table
CREATE TABLE public.evaluation_criteria (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    evaluation_type USER-DEFINED NOT NULL,
    max_score NUMERIC NOT NULL DEFAULT 10.00,
    weight NUMERIC NOT NULL DEFAULT 1.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grades/evaluations table
CREATE TABLE public.evaluations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES public.professors(id),
    criteria_id UUID NOT NULL REFERENCES public.evaluation_criteria(id),
    evaluation_type USER-DEFINED NOT NULL,
    score NUMERIC NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    payload JSONB,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for students advisor_id (had to be added after professors table exists)
ALTER TABLE public.students ADD CONSTRAINT students_advisor_id_fkey 
    FOREIGN KEY (advisor_id) REFERENCES public.professors(id);

-- Create indexes for performance
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_student_id ON public.projects(student_id);
CREATE INDEX idx_deadlines_due_date ON public.deadlines(due_date);
CREATE INDEX idx_meetings_project_id ON public.meetings(project_id);
CREATE INDEX idx_meetings_professor_id ON public.meetings(professor_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professors_updated_at
    BEFORE UPDATE ON public.professors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deadlines_updated_at
    BEFORE UPDATE ON public.deadlines
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON public.meetings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_panels_updated_at
    BEFORE UPDATE ON public.review_panels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
    BEFORE UPDATE ON public.evaluations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC functions for dashboard metrics

-- Get total active students
CREATE OR REPLACE FUNCTION public.get_total_students()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer 
  FROM students 
  WHERE is_active = true;
$$;

-- Get active projects count
CREATE OR REPLACE FUNCTION public.get_active_projects()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer 
  FROM projects 
  WHERE status IN ('proposal', 'development', 'final_submission');
$$;

-- Get upcoming deadlines count (next 7 days)
CREATE OR REPLACE FUNCTION public.get_upcoming_deadlines_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer 
  FROM deadlines 
  WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';
$$;

-- Get overdue items count (deadlines passed + projects needing attention)
CREATE OR REPLACE FUNCTION public.get_overdue_items_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH overdue_deadlines AS (
    SELECT COUNT(*) as count
    FROM deadlines 
    WHERE due_date < CURRENT_DATE
  ),
  overdue_project_deadlines AS (
    SELECT COUNT(*) as count
    FROM projects p
    WHERE (
      (p.proposal_deadline IS NOT NULL AND p.proposal_deadline < NOW() AND p.status = 'proposal') OR
      (p.proposal_reelaboration_deadline IS NOT NULL AND p.proposal_reelaboration_deadline < NOW() AND p.status = 'proposal_revision') OR
      (p.tc_deadline IS NOT NULL AND p.tc_deadline < NOW() AND p.status = 'development') OR
      (p.tc_reelaboration_deadline IS NOT NULL AND p.tc_reelaboration_deadline < NOW() AND p.status = 'final_revision')
    )
  )
  SELECT (od.count + opd.count)::integer
  FROM overdue_deadlines od, overdue_project_deadlines opd;
$$;

-- Get project status distribution
CREATE OR REPLACE FUNCTION public.get_project_status_distribution()
RETURNS TABLE(status_name text, project_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE status
      WHEN 'proposal' THEN 'Proposta'
      WHEN 'proposal_revision' THEN 'Revisão da Proposta'
      WHEN 'development' THEN 'Em Andamento'
      WHEN 'final_submission' THEN 'Entregue'
      WHEN 'final_revision' THEN 'Revisão Final'
      WHEN 'completed' THEN 'Finalizado'
      WHEN 'cancelled' THEN 'Cancelado'
      ELSE status::text
    END as status_name,
    COUNT(*) as project_count
  FROM projects 
  GROUP BY status
  ORDER BY 
    CASE status
      WHEN 'proposal' THEN 1
      WHEN 'proposal_revision' THEN 2
      WHEN 'development' THEN 3
      WHEN 'final_submission' THEN 4
      WHEN 'final_revision' THEN 5
      WHEN 'completed' THEN 6
      WHEN 'cancelled' THEN 7
      ELSE 8
    END;
$$;

-- Get recent activities
CREATE OR REPLACE FUNCTION public.get_recent_activities()
RETURNS TABLE(description text, created_at timestamp with time zone, type text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH recent_project_changes AS (
    SELECT 
      pr.full_name || ' atualizou projeto: ' || p.title as description,
      p.updated_at as created_at,
      CASE 
        WHEN p.status IN ('final_submission', 'completed') THEN 'success'
        WHEN p.status IN ('proposal_revision', 'final_revision') THEN 'warning'
        ELSE 'info'
      END as type
    FROM projects p
    JOIN students s ON s.id = p.student_id
    JOIN profiles pr ON pr.user_id = s.user_id
    WHERE p.updated_at > NOW() - INTERVAL '30 days'
  ),
  recent_meetings AS (
    SELECT 
      pr.full_name || ' realizou reunião' as description,
      m.created_at,
      'info' as type
    FROM meetings m
    JOIN projects p ON p.id = m.project_id
    JOIN students s ON s.id = p.student_id
    JOIN profiles pr ON pr.user_id = s.user_id
    WHERE m.created_at > NOW() - INTERVAL '30 days'
  )
  SELECT description, created_at, type
  FROM (
    SELECT * FROM recent_project_changes
    UNION ALL
    SELECT * FROM recent_meetings
  ) combined_activities
  ORDER BY created_at DESC
  LIMIT 10;
$$;