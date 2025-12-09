-- Add JSONB column to store full comic data including generated images
ALTER TABLE public.comics ADD COLUMN IF NOT EXISTS data JSONB;

-- Add comment
COMMENT ON COLUMN public.comics.data IS 'Full comic data structure including generated image URLs';
