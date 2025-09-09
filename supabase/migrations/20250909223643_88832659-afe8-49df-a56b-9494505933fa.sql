-- Create function to get project status distribution
CREATE OR REPLACE FUNCTION public.get_project_status_distribution()
RETURNS TABLE(status_name text, project_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    CASE status
      WHEN 'proposta' THEN 'Proposta'
      WHEN 'em_andamento' THEN 'Em Andamento'
      WHEN 'entregue' THEN 'Entregue'
      WHEN 'avaliado' THEN 'Avaliado'
      ELSE status::text
    END as status_name,
    COUNT(*) as project_count
  FROM projects 
  GROUP BY status
  ORDER BY 
    CASE status
      WHEN 'proposta' THEN 1
      WHEN 'em_andamento' THEN 2
      WHEN 'entregue' THEN 3
      WHEN 'avaliado' THEN 4
      ELSE 5
    END;
$function$;

-- Create function to get recent activities
CREATE OR REPLACE FUNCTION public.get_recent_activities()
RETURNS TABLE(description text, created_at timestamp with time zone, type text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  WITH recent_project_changes AS (
    SELECT 
      CASE 
        WHEN p.status = 'entregue' THEN pr.full_name || ' entregou projeto final'
        WHEN p.status = 'proposta' THEN pr.full_name || ' criou nova proposta'
        WHEN p.status = 'em_andamento' THEN pr.full_name || ' iniciou desenvolvimento do projeto'
        WHEN p.status = 'avaliado' THEN pr.full_name || ' teve projeto avaliado'
        ELSE pr.full_name || ' atualizou projeto'
      END as description,
      p.updated_at as created_at,
      CASE 
        WHEN p.status = 'entregue' THEN 'success'
        WHEN p.status = 'avaliado' THEN 'success'
        WHEN p.status = 'proposta' THEN 'info'
        WHEN p.status = 'em_andamento' THEN 'info'
        ELSE 'info'
      END as type
    FROM projects p
    JOIN students s ON s.id = p.student_id
    JOIN profiles pr ON pr.user_id = s.user_id
    WHERE p.updated_at > NOW() - INTERVAL '30 days'
  ),
  recent_meetings AS (
    SELECT 
      pr.full_name || ' participou de reunião de orientação' as description,
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
  LIMIT 5;
$function$;