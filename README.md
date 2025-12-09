# ComicMaker

A rapid comic creation tool with a markdown-like DSL. Write scripts, generate AI images, publish comics.

## What is this?

ComicMaker lets you create comics by writing simple text scripts. No drawing skills required—describe your panels in plain English and let AI generate the artwork.

```markdown
---
title: My First Comic
style: manga
---

# Page 1

A hero standing on a rooftop at sunset

HERO
The city needs me.

---

Close-up of hero's determined face

HERO (determined)
Time to go to work.

*WHOOSH*
```

That's it. The DSL parses your script, generates panel images via AI, and renders a complete comic page.

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/comicmaker.git
cd comicmaker
npm install

# Set up your AI provider (pick one)
cp .env.example .env
# Edit .env with your API key

# Run development server
npm run dev
```

Open `http://localhost:3000` and start writing.

## AI Provider Setup

ComicMaker supports multiple AI image generation backends. Pick whichever works for you.

### Option 1: Replicate (Recommended)

Cheapest option. ~$0.003 per image. No GPU required.

1. Sign up at [replicate.com](https://replicate.com)
2. Get your API token from Settings
3. Add to `.env`:

```env
AI_PROVIDER=replicate
REPLICATE_API_TOKEN=r8_your_token_here
```

### Option 2: Stability AI

Direct Stable Diffusion access. Credit-based pricing.

1. Sign up at [platform.stability.ai](https://platform.stability.ai)
2. Get your API key
3. Add to `.env`:

```env
AI_PROVIDER=stability
STABILITY_API_KEY=sk-your_key_here
```

### Option 3: Self-Hosted (Free but requires GPU)

Run Stable Diffusion locally. Needs a decent GPU (8GB+ VRAM).

**With Docker:**

```bash
# Pull the image (first run downloads ~10GB of models)
docker run -d \
  --gpus all \
  -p 7860:7860 \
  --name sd-webui \
  ghcr.io/automatic1111/stable-diffusion-webui:latest

# Wait for it to start (check logs)
docker logs -f sd-webui
```

**Configure ComicMaker:**

```env
AI_PROVIDER=local
AI_ENDPOINT=http://localhost:7860/api/v1
```

**Manual install** (if you hate Docker):

```bash
# Clone Automatic1111's WebUI
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Run with API enabled
./webui.sh --api
```

## DSL Syntax

The comic DSL is designed to be readable and writable without documentation. If it looks like a comic script, it probably works.

### Basic Structure

```markdown
---
title: Comic Title
author: Your Name
style: manga | superhero | cartoon | webcomic
---

# Page 1

Panel description here

CHARACTER NAME
Dialogue goes here.

---

Next panel description

ANOTHER CHARACTER (emotion)
More dialogue!

*SOUND EFFECT*

> Narration box text
```

### Elements

| Element | Syntax | Example |
|---------|--------|---------|
| Page | `# Page N` | `# Page 1` |
| Panel | Text followed by `---` | See above |
| Layout | `[preset]` | `[2x2]`, `[splash]` |
| Dialogue | `NAME` + newline + text | `HERO`<br>`Hello!` |
| Emotion | `(emotion)` after name | `HERO (angry)` |
| Shout | `!` in dialogue | `Watch out!` |
| Whisper | `*wrapped text*` | `*psst*` |
| Sound FX | `*CAPS*` | `*BOOM*` |
| Narration | `> text` | `> Meanwhile...` |
| Thought | `~ text` | `~ I wonder...` |
| Comment | `// text` | `// fix this later` |

### Layout Presets

- `[single]` or `[splash]` - Full page, one panel
- `[2x1]` - Two panels stacked
- `[1x2]` - Two panels side by side
- `[2x2]` - Four equal panels
- `[3x3]` - Nine panels (Watchmen style)
- `[rows: 2, 1]` - Custom: 2 panels top row, 1 full-width bottom

### Emotions

Use these in parentheses after character names to affect both speech balloon style and AI image generation:

`neutral`, `happy`, `sad`, `angry`, `surprised`, `scared`, `confused`, `excited`

### Style Presets

Set in frontmatter to change the overall look:

- `manga` - Anime/manga aesthetic
- `superhero` - Bold American comic style
- `cartoon` - Simple, clean lines
- `webcomic` - Modern digital style
- `noir` - Dark, high contrast
- `chibi` - Cute, super-deformed

## Project Structure

```
comicmaker/
├── research/              # Design research (you are here)
│   └── comic-conventions-and-ux.md
├── src/
│   ├── parser/           # DSL → data model
│   ├── renderer/         # Data model → visual
│   ├── services/         # AI integration
│   └── types/            # TypeScript definitions
├── public/
└── tests/
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Build for production
npm run build
```

## Testing the DSL Parser

```bash
# Parse a comic file
npm run parse examples/simple.md

# Validate without generating
npm run validate examples/simple.md

# Generate with AI (requires API key)
npm run generate examples/simple.md --output ./output
```

### Quick Test Script

```bash
# Create a test comic
cat > /tmp/test.md << 'EOF'
---
title: Test
---

# Page 1

A cat sitting on a fence

CAT
Meow.
EOF

# Parse and validate
npm run validate /tmp/test.md
```

## Configuration

### Environment Variables

```env
# Required: AI provider
AI_PROVIDER=replicate|stability|openai|local

# Provider-specific keys
REPLICATE_API_TOKEN=r8_xxx
STABILITY_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx

# For self-hosted
AI_ENDPOINT=http://localhost:7860/api/v1

# Optional settings
DEFAULT_STYLE=manga
DEFAULT_IMAGE_WIDTH=1024
DEFAULT_IMAGE_HEIGHT=1024
MAX_CONCURRENT_GENERATIONS=3
```

### Config File

Create `comicmaker.config.js` for project-level settings:

```javascript
module.exports = {
  defaultStyle: 'manga',
  imageSize: { width: 1024, height: 1024 },
  outputDir: './output',
  exportFormats: ['png', 'pdf'],
};
```

## Troubleshooting

**Parser errors?**
- Check your frontmatter has `---` on its own lines
- Make sure panel separators are `---` with blank lines around them
- Character names need to be ALL CAPS

**AI generation failing?**
- Verify your API key is set correctly
- Check you have credits/quota remaining
- For self-hosted: make sure the API endpoint is accessible

**Slow generation?**
- Reduce image size in config
- Use a faster model (trade quality for speed)
- For self-hosted: get a better GPU

**Images look wrong?**
- Try different style presets
- Add more detail to panel descriptions
- Experiment with the `customPrompt` field in frontmatter

## Contributing

PRs welcome. Please:
1. Write tests for new features
2. Follow existing code style
3. Update docs if needed

## License

MIT

---

Built because drawing is hard but storytelling shouldn't be.
