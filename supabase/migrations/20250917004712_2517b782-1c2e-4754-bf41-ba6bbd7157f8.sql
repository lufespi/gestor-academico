-- Create RPC functions for student pages

-- Function to get project details for the current student
CREATE OR REPLACE FUNCTION public.get_my_project_details()
RETURNS JSON
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT row_to_json(result)
  FROM (
    SELECT 
      p.title as project_title,
      p.description as project_description,
      p.status as project_status,
      prof.full_name as advisor_name
    FROM projects p
    JOIN students s ON s.id = p.student_id
    JOIN professors prof_table ON prof_table.id = s.advisor_id
    JOIN profiles prof ON prof.user_id = prof_table.user_id
    WHERE s.user_id = auth.uid()
    LIMIT 1
  ) result;
$function$;

-- Function to get meetings for the current student
CREATE OR REPLACE FUNCTION public.get_my_meetings()
RETURNS JSON
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(json_agg(meeting_data), '[]'::json)
  FROM (
    SELECT 
      m.meeting_date,
      m.notes as summary,
      d.file_path as document_url
    FROM meetings m
    JOIN projects p ON p.id = m.project_id
    JOIN students s ON s.id = p.student_id
    LEFT JOIN documents d ON d.meeting_id = m.id
    WHERE s.user_id = auth.uid()
    ORDER BY m.meeting_date DESC
  ) meeting_data;
$function$;

-- Function to get deadlines for the current student
CREATE OR REPLACE FUNCTION public.get_my_deadlines()
RETURNS JSON
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(json_agg(deadline_data), '[]'::json)
  FROM (
    SELECT 
      deadline_name,
      due_date,
      CASE 
        WHEN due_date < NOW() AND status NOT IN ('entregue', 'avaliado') THEN 'Overdue'
        WHEN status IN ('entregue', 'avaliado') THEN 'Submitted'
        ELSE 'Pending'
      END as status
    FROM (
      SELECT 'Proposta' as deadline_name, p.proposal_deadline as due_date, p.status
      FROM projects p
      JOIN students s ON s.id = p.student_id
      WHERE s.user_id = auth.uid() AND p.proposal_deadline IS NOT NULL
      
      UNION ALL
      
      SELECT 'Reelaboração da Proposta' as deadline_name, p.proposal_reelaboration_deadline as due_date, p.status
      FROM projects p
      JOIN students s ON s.id = p.student_id
      WHERE s.user_id = auth.uid() AND p.proposal_reelaboration_deadline IS NOT NULL
      
      UNION ALL
      
      SELECT 'Trabalho de Conclusão' as deadline_name, p.tc_deadline as due_date, p.status
      FROM projects p
      JOIN students s ON s.id = p.student_id
      WHERE s.user_id = auth.uid() AND p.tc_deadline IS NOT NULL
      
      UNION ALL
      
      SELECT 'Reelaboração do TC' as deadline_name, p.tc_reelaboration_deadline as due_date, p.status
      FROM projects p
      JOIN students s ON s.id = p.student_id
      WHERE s.user_id = auth.uid() AND p.tc_reelaboration_deadline IS NOT NULL
    ) all_deadlines
    ORDER BY due_date ASC
  ) deadline_data;
$function$;