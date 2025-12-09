-- Create characters table for character consistency
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  reference_image_url TEXT,
  style_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS characters_name_idx ON public.characters(name);

-- Enable Row Level Security
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Note: Adjust these for production use with authentication

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON public.characters;
  DROP POLICY IF EXISTS "Allow public insert access" ON public.characters;
  DROP POLICY IF EXISTS "Allow public update access" ON public.characters;
  DROP POLICY IF EXISTS "Allow public delete access" ON public.characters;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Allow anyone to read all characters
CREATE POLICY "Allow public read access"
  ON public.characters
  FOR SELECT
  USING (true);

-- Allow anyone to insert characters
CREATE POLICY "Allow public insert access"
  ON public.characters
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update any character
CREATE POLICY "Allow public update access"
  ON public.characters
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete any character
CREATE POLICY "Allow public delete access"
  ON public.characters
  FOR DELETE
  USING (true);

-- Add comment
COMMENT ON TABLE public.characters IS 'Stores character definitions and reference images for consistent AI generation';
