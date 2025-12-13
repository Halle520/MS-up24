-- Enable required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- UserGroups join table
CREATE TABLE IF NOT EXISTS public.user_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  group_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_groups_user_group_unique UNIQUE (user_id, group_id),
  CONSTRAINT user_groups_user_fk FOREIGN KEY (user_id) REFERENCES public.users (id),
  CONSTRAINT user_groups_group_fk FOREIGN KEY (group_id) REFERENCES public.groups (id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid NOT NULL,
  group_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT messages_user_fk FOREIGN KEY (user_id) REFERENCES public.users (id),
  CONSTRAINT messages_group_fk FOREIGN KEY (group_id) REFERENCES public.groups (id)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON public.user_groups (user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON public.user_groups (group_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON public.messages (group_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages (user_id);

