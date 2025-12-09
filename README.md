# ComicMaker

Write comics in markdown. Generate images with AI.

## Quick Start

```bash
git clone <repo-url>
cd comicmaker
npm install

# Parse and validate a comic
npm run validate src/examples/simple.md

# Render to HTML preview (no AI needed)
npm run render src/examples/simple.md comic.html
open comic.html

# Generate AI images (requires API key)
STABILITY_API_KEY=sk-xxx npm run generate src/examples/simple.md
```

## DSL Syntax

```markdown
---
title: My Comic
author: Your Name
style: manga
---

# Page 1

A cat sitting on a sunny windowsill

CAT
Hello, world!

---

The cat stretching and yawning

CAT (happy)
What a beautiful day.

*YAWN*

> Life was good for this little cat.
```

### Elements

| Element | Syntax | Example |
|---------|--------|---------|
| Page | `# Page N` | `# Page 1` |
| Panel separator | `---` | |
| Layout | `[preset]` | `[2x2]`, `[splash]` |
| Dialogue | `NAME` then text | `CAT`<br>`Hello!` |
| Emotion | `(emotion)` | `CAT (happy)` |
| Sound effect | `*TEXT*` | `*BOOM*` |
| Narration | `> text` | `> Meanwhile...` |
| Comment | `// text` | `// todo` |

### Styles

`manga` · `superhero` · `cartoon` · `webcomic` · `noir` · `chibi`

### Layouts

`single` · `splash` · `1x2` · `2x1` · `2x2` · `3x3`

### Emotions

`neutral` · `happy` · `sad` · `angry` · `surprised` · `scared` · `excited`

## Commands

```bash
npm run parse <file>      # Parse DSL to JSON
npm run validate <file>   # Parse + validate against schema
npm run render <file>     # Generate HTML preview
npm run generate <file>   # Generate AI images (needs API key)
npm test                  # Run test suite
npm run typecheck         # TypeScript check
```

## AI Setup

### Stability AI (recommended)

1. Get API key at [platform.stability.ai](https://platform.stability.ai)
2. Run with key:

```bash
STABILITY_API_KEY=sk-xxx npm run generate src/examples/simple.md
```

### OpenAI (DALL-E)

1. Get API key at [platform.openai.com](https://platform.openai.com)
2. Run with key:

```bash
OPENAI_API_KEY=sk-xxx npm run generate src/examples/simple.md
```

## Architecture

```
src/
├── schema/
│   ├── comic.schema.json   # JSON Schema (source of truth)
│   └── types.ts            # TypeScript types
├── parser/
│   ├── parse.ts            # DSL text → Comic object
│   └── validate.ts         # Schema validation (AJV)
├── services/
│   └── generate.ts         # AI image generation
├── render/
│   └── html.ts             # Comic → standalone HTML
├── examples/
│   └── simple.md           # Example comic
└── index.ts                # Public exports
```

**Data flow:** DSL text → `parse()` → Comic JSON → `validate()` → `generate()` / `renderToHtml()`

## Schema

JSON Schema at `src/schema/comic.schema.json` defines:

```
Comic
├── title (required)
├── author
├── style
└── pages[] (required)
    ├── layout
    └── panels[]
        ├── description (required)
        ├── dialogue[]
        │   ├── character
        │   ├── text
        │   ├── emotion
        │   └── style (normal|shout|whisper|thought)
        ├── narration
        ├── sfx[]
        │   ├── text
        │   └── intensity
        └── image (populated by generate)
```

## Development

```bash
npm install
npm test          # 3 tests
npm run typecheck # No errors
```

### Testing the parser

```bash
# Quick test
echo '---
title: Test
---

# Page 1

A dog

DOG
Woof!' | npm run parse /dev/stdin
```

## Existing Tools We Leverage

- **[AI Comic Factory](https://github.com/jbilcke-hf/ai-comic-factory)** - Open source reference for LLM+SDXL comic generation
- **[Stability AI](https://platform.stability.ai)** - High-quality image generation API
- **[AJV](https://ajv.js.org)** - JSON Schema validation

## Future

- [ ] Web UI with live preview
- [ ] More AI providers (Stability, local SD)
- [ ] PDF export
- [ ] Character consistency (IP-Adapter)

## License

MIT
