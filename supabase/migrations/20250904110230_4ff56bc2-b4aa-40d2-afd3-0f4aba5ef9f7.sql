-- Create MASTER user with admin credentials
-- Note: This will create a user that can be used to login immediately
-- The password will be hashed by Supabase auth system

-- Insert the master user profile directly
-- We'll use a fixed UUID for the master user to ensure consistency
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@gestortc.com',
  crypt('Unisc#2025', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador Master", "role": "coordinator"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert the corresponding profile
INSERT INTO public.profiles (
  user_id,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000000',
  'Administrador Master',
  'coordinator',
  NOW(),
  NOW()
);