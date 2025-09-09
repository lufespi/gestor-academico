-- Create RPC functions for dashboard metrics

-- Function to get total students count
CREATE OR REPLACE FUNCTION public.get_total_students()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer 
  FROM students 
  WHERE is_active = true;
$$;

-- Function to get active projects count  
CREATE OR REPLACE FUNCTION public.get_active_projects()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer 
  FROM projects 
  WHERE status IN ('proposta', 'em_andamento');
$$;

-- Function to get upcoming deadlines count (within next 7 days)
CREATE OR REPLACE FUNCTION public.get_upcoming_deadlines_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer 
  FROM (
    SELECT proposal_deadline as deadline FROM projects WHERE proposal_deadline IS NOT NULL AND proposal_deadline BETWEEN NOW() AND NOW() + INTERVAL '7 days'
    UNION ALL
    SELECT proposal_reelaboration_deadline as deadline FROM projects WHERE proposal_reelaboration_deadline IS NOT NULL AND proposal_reelaboration_deadline BETWEEN NOW() AND NOW() + INTERVAL '7 days'
    UNION ALL
    SELECT tc_deadline as deadline FROM projects WHERE tc_deadline IS NOT NULL AND tc_deadline BETWEEN NOW() AND NOW() + INTERVAL '7 days'
    UNION ALL
    SELECT tc_reelaboration_deadline as deadline FROM projects WHERE tc_reelaboration_deadline IS NOT NULL AND tc_reelaboration_deadline BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  ) deadlines;
$$;

-- Function to get overdue items count (past deadlines)
CREATE OR REPLACE FUNCTION public.get_overdue_items_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer 
  FROM (
    SELECT proposal_deadline as deadline FROM projects WHERE proposal_deadline IS NOT NULL AND proposal_deadline < NOW() AND status = 'proposta'
    UNION ALL
    SELECT proposal_reelaboration_deadline as deadline FROM projects WHERE proposal_reelaboration_deadline IS NOT NULL AND proposal_reelaboration_deadline < NOW() AND status = 'proposta'
    UNION ALL
    SELECT tc_deadline as deadline FROM projects WHERE tc_deadline IS NOT NULL AND tc_deadline < NOW() AND status = 'em_andamento'
    UNION ALL
    SELECT tc_reelaboration_deadline as deadline FROM projects WHERE tc_reelaboration_deadline IS NOT NULL AND tc_reelaboration_deadline < NOW() AND status = 'em_andamento'
  ) overdue_deadlines;
$$;