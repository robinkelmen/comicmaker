-- Create comics table for storing comic scripts
CREATE TABLE IF NOT EXISTS public.comics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on updated_at for faster sorting
CREATE INDEX IF NOT EXISTS comics_updated_at_idx ON public.comics(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.comics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Note: These allow anyone to CRUD comics. Adjust for production use.

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON public.comics;
  DROP POLICY IF EXISTS "Allow public insert access" ON public.comics;
  DROP POLICY IF EXISTS "Allow public update access" ON public.comics;
  DROP POLICY IF EXISTS "Allow public delete access" ON public.comics;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Allow anyone to read all comics
CREATE POLICY "Allow public read access"
  ON public.comics
  FOR SELECT
  USING (true);

-- Allow anyone to insert comics
CREATE POLICY "Allow public insert access"
  ON public.comics
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update any comic
CREATE POLICY "Allow public update access"
  ON public.comics
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete any comic
CREATE POLICY "Allow public delete access"
  ON public.comics
  FOR DELETE
  USING (true);

-- Add comment
COMMENT ON TABLE public.comics IS 'Stores comic scripts created by users';
