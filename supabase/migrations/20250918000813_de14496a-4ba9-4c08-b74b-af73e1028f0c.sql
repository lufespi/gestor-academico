-- Fix the migration by creating evaluation_type enum first

-- Create evaluation type enum
CREATE TYPE evaluation_type AS ENUM ('proposal', 'proposal_revision', 'final_project', 'final_revision', 'defense');

-- Update the evaluation_criteria table structure to use the correct enum
ALTER TABLE public.evaluation_criteria 
ALTER COLUMN evaluation_type TYPE evaluation_type USING evaluation_type::text::evaluation_type;

-- Update the evaluations table structure to use the correct enum  
ALTER TABLE public.evaluations 
ALTER COLUMN evaluation_type TYPE evaluation_type USING evaluation_type::text::evaluation_type;