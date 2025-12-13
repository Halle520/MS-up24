-- Create consumptions table
CREATE TABLE IF NOT EXISTS public.consumptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(10, 2) NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  group_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT consumptions_user_fk FOREIGN KEY (user_id) REFERENCES public.users (id),
  CONSTRAINT consumptions_group_fk FOREIGN KEY (group_id) REFERENCES public.groups (id)
);

-- Add consumption_id to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS consumption_id uuid;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_consumption_fk') THEN
        ALTER TABLE public.messages ADD CONSTRAINT messages_consumption_fk FOREIGN KEY (consumption_id) REFERENCES public.consumptions (id);
    END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consumptions_user_id ON public.consumptions (user_id);
CREATE INDEX IF NOT EXISTS idx_consumptions_group_id ON public.consumptions (group_id);
CREATE INDEX IF NOT EXISTS idx_consumptions_date ON public.consumptions (date DESC);
