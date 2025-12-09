# ComicMaker TODO

## Immediate Issues to Fix

### 1. Supabase Connection Error
**Problem:** "Supabase not configured" error when clicking Load button
**Solution:** You need to run the SQL from `SUPABASE_SETUP.md` in your Supabase SQL Editor to create the `comics` table.

Steps:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in sidebar
4. Run the SQL from `SUPABASE_SETUP.md`
5. Verify the `comics` table exists in Table Editor
6. Redeploy on Vercel (it should auto-deploy from latest commit)

### 2. Panel Separator (`---`) Glitches
**Problem:** Third panel on Page 2 acts weird with `---`
**Current Status:** Parser logic is correct, but may need better error handling
**Next Steps:**
- Test with example to reproduce the issue
- Add validation to ensure `---` is on its own line
- Maybe add visual feedback in editor when `---` is detected

## Major Features to Add

### 3. AI Image Generation Integration
**Goal:** Let users generate panel images directly in the app
**Requirements:**
- Add "Generate Images" button to UI
- Settings panel for AI provider (Stability AI, OpenAI)
- API key input (stored locally or in env)
- Progress indicator during generation
- Display generated images in panels

**Implementation Ideas:**
```tsx
// Add to App.tsx
const [aiProvider, setAiProvider] = useState('stability')
const [aiApiKey, setAiApiKey] = useState('')
const [generating, setGenerating] = useState(false)

const handleGenerateImages = async () => {
  // Call backend or direct API
  // Update comic with image URLs
}
```

### 4. Character Management System
**Goal:** Store character images for consistency across panels
**Requirements:**
- Character library UI
- Upload character reference image OR generate initial image
- Store in Supabase Storage
- Auto-inject character ref into prompts for consistency
- Character selector when writing dialogue

**Database Schema:**
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**UI Mockup:**
```
[Characters Panel]
├── CAT - 🖼️ [Edit] [Delete]
├── HERO - 🖼️ [Edit] [Delete]
└── + Add Character
```

## Nice-to-Have Improvements

### 5. Better Error Messages
- Show which line number has issues
- Highlight syntax errors in editor
- Autocomplete for character names

### 6. Export Options
- Export to PDF
- Export individual panels as images
- Share link to view comic

### 7. Collaboration Features
- Share comics with view link
- Fork/remix other comics
- Comments on panels

## Current File Structure

```
comicmaker/
├── src/              # CLI backend tools
├── web/              # React frontend
│   ├── src/
│   │   ├── App.tsx           # Main app
│   │   ├── ComicPreview.tsx  # Preview component
│   │   ├── parser.ts         # DSL parser
│   │   ├── supabase.ts       # DB functions
│   │   └── types.ts          # TypeScript types
│   └── ...
├── SUPABASE_SETUP.md  # Database setup instructions
└── TODO.md            # This file
```

## Priority Order

1. **Fix Supabase** (Critical) - Without this, save/load doesn't work
2. **Character Management** (High) - Core feature for consistency
3. **AI Image Generation** (High) - Main value prop
4. **Panel Parser Fixes** (Medium) - UX improvement
5. **Export Features** (Low) - Nice-to-have
