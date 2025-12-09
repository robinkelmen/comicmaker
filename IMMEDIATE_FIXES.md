# IMMEDIATE FIXES NEEDED

## 🔴 CRITICAL - Supabase CRUD Not Working

**Problem:** Env vars not loading on Vercel
**Status:** Just pushed vercel.json - Vercel will redeploy automatically
**What to do:** Wait 2-3 minutes for Vercel to rebuild, then test Save/Load

---

## 🟡 HIGH PRIORITY - UX Issues

### 1. Confusing Syntax
**Current:** Text-based guide with code examples
**Problem:** Not intuitive, users don't understand the DSL
**Better Solution:**
- Interactive tutorial/wizard on first use
- Visual examples showing input → output
- Autocomplete for character names
- Real-time validation with helpful errors

### 2. Missing Dictionary/Legend
**Need:**
- Collapsible reference panel
- Visual examples of each element
- Quick insert buttons for common patterns

### 3. No AI Integration Visible
**Problem:** Users can't generate images!
**Need:**
- "Generate Images" button on each panel
- Settings modal for API key (Stability AI / OpenAI)
- Progress bar during generation
- Preview thumbnails

---

## 📋 PROPOSED UX IMPROVEMENTS

### Editor Toolbar
```
[New] [Load] [Save] | [Generate All Images] [Settings] | [Help]
```

### Panel Actions
Each panel preview should have:
```
┌─────────────────────┐
│  Panel Preview      │
│                     │
│  [🎨 Generate]      │ ← Click to generate THIS panel
└─────────────────────┘
```

### Settings Modal
```
⚙️ Settings
├── AI Provider: [Stability AI ▼]
├── API Key: [••••••••••]
├── Style: [manga ▼]
└── [Test Connection] [Save]
```

### Better Syntax Helper
```
┌─ Quick Insert ────────┐
│ [Page] [Panel] [---]  │
│ [Dialogue] [SFX]       │
│ [Narration]            │
└───────────────────────┘
```

---

## 🎯 NEXT STEPS (In Order)

1. ✅ Fix Vercel env vars (DONE - deploying now)
2. Test Save/Load works
3. Add "Generate Images" button
4. Add Settings modal for API keys
5. Improve syntax UX with visual helpers
6. Add character management

---

## Reality Check

**What I built:** Backend-focused CLI tool
**What you need:** User-friendly web app with AI generation

I focused too much on parsing/validation and not enough on **making it easy to use**.

The DSL is cool for developers but confusing for regular users. We need:
- Visual editor mode (drag & drop panels?)
- Or at minimum: Better guided input
- AI generation integrated into the UI flow
- Character library front and center

Should we pivot to a more visual approach?
