# Supabase Migrations

This directory contains SQL migration files for setting up the ComicMaker database.

## Running Migrations

### Option 1: Manual (Supabase Dashboard)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the sidebar
4. Run each migration file in order:
   - `20241209_001_create_comics_table.sql`
   - `20241209_002_create_characters_table.sql`
   - `20241209_003_create_storage_buckets.sql`

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref yjmljkcrrinlnhehdnzr

# Run migrations
supabase db push
```

## Migration Files

### 001_create_comics_table.sql
Creates the main `comics` table for storing comic scripts.

**Columns:**
- `id` - UUID primary key
- `title` - Comic title
- `script` - Full comic script in DSL format
- `created_at` - Timestamp
- `updated_at` - Timestamp

**RLS:** Public read/write access (adjust for production)

### 002_create_characters_table.sql
Creates the `characters` table for character management and consistency.

**Columns:**
- `id` - UUID primary key
- `name` - Character name
- `description` - Character description
- `reference_image_url` - URL to character reference image in storage
- `style_notes` - Notes about character appearance/style
- `created_at` - Timestamp
- `updated_at` - Timestamp

**RLS:** Public read/write access (adjust for production)

### 003_create_storage_buckets.sql
Creates storage buckets for images.

**Buckets:**
- `character-images` - Stores character reference images
- `panel-images` - Stores generated panel images

**RLS:** Public read/write access (adjust for production)

## Security Notes

⚠️ **Current Setup:** All tables and storage have PUBLIC access for development.

For production, you should:

1. Enable Supabase Authentication
2. Update RLS policies to check `auth.uid()`
3. Add `user_id` column to comics and characters tables
4. Restrict storage to authenticated users

Example production policy:
```sql
CREATE POLICY "Users can only read their own comics"
  ON public.comics
  FOR SELECT
  USING (auth.uid() = user_id);
```
