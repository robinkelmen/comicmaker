# Supabase Setup for ComicMaker

## 1. Create the Comics Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create comics table
CREATE TABLE IF NOT EXISTS comics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Note: In production, you should restrict these to authenticated users

CREATE POLICY "Allow public read"
  ON comics FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert"
  ON comics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON comics FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete"
  ON comics FOR DELETE
  USING (true);
```

## 2. Environment Variables

Add these to your Vercel project or local `.env` file:

```env
VITE_SUPABASE_URL=https://yjmljkcrrinlnhehdnzr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbWxqa2NycmlubG5oZWhkbnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTUyMDcsImV4cCI6MjA4MDE3MTIwN30.3z7aWz06Cgzk4-NCkAgzQgaEovP1cCKQZPojEhn1PlQ
```

## 3. Test the Connection

1. Run your app locally: `cd web && npm run dev`
2. Try saving a comic
3. Check your Supabase table to see if the data appears

## Security Note

The current setup allows anyone to create, read, update, and delete comics. For production:

1. Enable Supabase Auth
2. Update RLS policies to check `auth.uid()`
3. Add a `user_id` column to the comics table
