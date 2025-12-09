# Supabase Setup for ComicMaker

## Quick Start

### Option 1: Use Migration Files (Recommended)

Run the migration files located in `supabase/migrations/` in order:

1. Go to https://supabase.com/dashboard
2. Select your project (yjmljkcrrinlnhehdnzr)
3. Click "SQL Editor" in the sidebar
4. Copy/paste and run each file in order:
   - `supabase/migrations/20241209_001_create_comics_table.sql`
   - `supabase/migrations/20241209_002_create_characters_table.sql`
   - `supabase/migrations/20241209_003_create_storage_buckets.sql`

See `supabase/migrations/README.md` for detailed instructions.

### Option 2: Manual SQL (Quick Comics-Only Setup)

If you just want the comics table working quickly, run this in SQL Editor:

```sql
-- Create comics table
CREATE TABLE IF NOT EXISTS public.comics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS comics_updated_at_idx ON public.comics(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.comics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON public.comics FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.comics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.comics FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.comics FOR DELETE USING (true);
```

## Environment Variables

Your credentials are already set in Vercel. For local development, add to `web/.env`:

```env
VITE_SUPABASE_URL=https://yjmljkcrrinlnhehdnzr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbWxqa2NycmlubG5oZWhkbnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTUyMDcsImV4cCI6MjA4MDE3MTIwN30.3z7aWz06Cgzk4-NCkAgzQgaEovP1cCKQZPojEhn1PlQ
```

## Test the Connection

1. After running migrations, go to your Vercel deployment
2. Click the "Save" button and save a test comic
3. Click the "Load" button - you should see your saved comic
4. Check Supabase Table Editor to verify data is being stored

## What Each Migration Creates

### 001 - Comics Table
- Stores comic scripts with title and DSL content
- Enables save/load functionality

### 002 - Characters Table
- Stores character definitions and reference images
- Enables character consistency feature (coming soon)

### 003 - Storage Buckets
- `character-images` - For character reference photos
- `panel-images` - For AI-generated panel images

## Security Note

⚠️ **Current setup allows PUBLIC access** (anyone can CRUD any comic)

For production, you should:
1. Enable Supabase Auth
2. Update RLS policies to check `auth.uid()`
3. Add `user_id` column to tables
4. Restrict storage to authenticated users

Example production policy:
```sql
CREATE POLICY "Users can only read their own comics"
  ON public.comics FOR SELECT
  USING (auth.uid() = user_id);
```
