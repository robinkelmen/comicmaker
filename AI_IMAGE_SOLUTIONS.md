# AI Image Generation Solutions for ComicMaker

## Problem 1: Text in Images

Current models (DALL-E 3, Stability SDXL) **cannot reliably render readable text** within generated images.

### Solutions

#### Option A: Text-Capable AI Models (RECOMMENDED)

**1. Replicate FLUX.1 [schnell]** ⭐ BEST FOR TEXT
- **Pros:** Excellent text rendering, fast, affordable
- **API:** `replicate.com/black-forest-labs/flux-schnell`
- **Cost:** ~$0.003 per image
- **Example:**
```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "FLUX.1-schnell",
    input: {
      prompt: "Comic panel: Hero saying 'I will find you!' in a speech bubble, manga style",
      num_inference_steps: 4,
      guidance_scale: 0, // FLUX.1-schnell works best with guidance_scale=0
    }
  })
})
```

**2. Ideogram AI** ⭐ SPECIALIZED FOR TEXT
- **Pros:** Built specifically for text-in-image generation
- **API:** `ideogram.ai/api`
- **Cost:** ~$0.08 per image
- **Example:**
```javascript
const response = await fetch('https://api.ideogram.ai/generate', {
  method: 'POST',
  headers: {
    'Api-Key': apiKey,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image_request: {
      prompt: "Comic panel with speech bubble containing 'Hello World', superhero style",
      model: "V_2",
      magic_prompt_option: "AUTO"
    }
  })
})
```

**3. DALL-E 3 with Enhanced Prompts**
- **Pros:** Already integrated
- **Cons:** Inconsistent text quality
- **Tip:** Be very explicit about text content
```javascript
prompt: "Comic book panel in manga style. Large speech bubble at top with the EXACT TEXT: 'I can't believe it!' Character with surprised expression."
```

#### Option B: Hybrid Approach (Keep Current + Improvements)

Generate images with **empty speech bubbles** and overlay text programmatically:

```javascript
const prompt = `${style} comic panel: ${scene}.
IMPORTANT: Include ${dialogueCount} empty white speech bubbles positioned at: ${positions}.
Do NOT include any text in the bubbles.`
```

Then use CSS/SVG to overlay crisp text on top.

---

## Problem 2: Better Panel Control & Serialization

Current prompt is too simple. We need **structured serialization** for precise control.

### Enhanced Panel Data Structure

```typescript
// Add to types.ts
export interface EnhancedPanel extends Panel {
  // Visual composition
  composition?: {
    cameraAngle?: 'eye-level' | 'high-angle' | 'low-angle' | 'dutch-angle' | 'over-shoulder'
    shot?: 'extreme-close-up' | 'close-up' | 'medium' | 'full' | 'long' | 'extreme-long'
    focus?: 'character' | 'background' | 'action' | 'object'
  }

  // Character details
  characters?: Array<{
    name: string
    position: 'left' | 'center' | 'right' | 'foreground' | 'background'
    pose?: string
    expression?: Emotion
    clothing?: string
  }>

  // Environment
  environment?: {
    setting: string
    lighting: 'bright' | 'dim' | 'dramatic' | 'natural' | 'neon'
    weather?: string
    timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night'
  }

  // Technical
  rendering?: {
    style: Style
    colorPalette?: string[]
    mood?: string
    effectsLayer?: string[] // Speed lines, impact stars, etc.
  }

  // Speech bubbles (for text-in-image models)
  speechBubbles?: Array<{
    text: string
    character: string
    position: { x: number, y: number } // Relative 0-1
    style: DialogueStyle
    tailDirection?: 'up' | 'down' | 'left' | 'right'
  }>
}
```

### Structured Prompt Builder

```typescript
export function buildStructuredPrompt(panel: EnhancedPanel): string {
  const parts: string[] = []

  // 1. Style prefix
  const style = panel.rendering?.style || 'comic book'
  parts.push(`${style} style comic panel.`)

  // 2. Shot composition
  if (panel.composition) {
    const { cameraAngle, shot, focus } = panel.composition
    parts.push(`${shot || 'medium'} shot from ${cameraAngle || 'eye-level'} angle.`)
  }

  // 3. Characters with detailed description
  if (panel.characters && panel.characters.length > 0) {
    panel.characters.forEach(char => {
      parts.push(
        `${char.name} positioned ${char.position}, ` +
        `${char.expression || 'neutral'} expression` +
        (char.pose ? `, ${char.pose}` : '') +
        (char.clothing ? `, wearing ${char.clothing}` : '') +
        `.`
      )
    })
  }

  // 4. Environment
  if (panel.environment) {
    const { setting, lighting, timeOfDay } = panel.environment
    parts.push(`Setting: ${setting}.`)
    parts.push(`${lighting} lighting` + (timeOfDay ? ` at ${timeOfDay}` : '') + `.`)
  }

  // 5. Action/Scene description
  if (panel.scene) {
    parts.push(panel.scene)
  }

  // 6. Speech bubbles (for text-capable models)
  if (panel.speechBubbles && panel.speechBubbles.length > 0) {
    panel.speechBubbles.forEach((bubble, i) => {
      parts.push(
        `Speech bubble ${i + 1}: "${bubble.text}" ` +
        `(${bubble.style} style, tail pointing ${bubble.tailDirection || 'down'})`
      )
    })
  }

  // 7. Effects
  if (panel.rendering?.effectsLayer) {
    parts.push(`Effects: ${panel.rendering.effectsLayer.join(', ')}.`)
  }

  // 8. Mood
  if (panel.rendering?.mood) {
    parts.push(`Overall mood: ${panel.rendering.mood}.`)
  }

  return parts.join(' ')
}
```

### Example Usage

```typescript
const panel: EnhancedPanel = {
  scene: "Hero confronting villain in rain",
  elements: [
    {
      type: 'dialogue',
      character: 'Hero',
      text: "This ends now!",
      style: 'shout'
    }
  ],
  composition: {
    cameraAngle: 'low-angle',
    shot: 'medium',
    focus: 'character'
  },
  characters: [
    {
      name: 'Hero',
      position: 'center',
      pose: 'standing defiantly',
      expression: 'angry',
      clothing: 'torn cape and armor'
    }
  ],
  environment: {
    setting: 'abandoned city street',
    lighting: 'dramatic',
    weather: 'heavy rain',
    timeOfDay: 'night'
  },
  rendering: {
    style: 'superhero',
    mood: 'intense',
    effectsLayer: ['rain streaks', 'lightning flash']
  },
  speechBubbles: [
    {
      text: "THIS ENDS NOW!",
      character: 'Hero',
      position: { x: 0.5, y: 0.2 },
      style: 'shout',
      tailDirection: 'down'
    }
  ]
}

const prompt = buildStructuredPrompt(panel)
// Result: "superhero style comic panel. medium shot from low-angle angle. Hero positioned center, angry expression, standing defiantly, wearing torn cape and armor. Setting: abandoned city street. dramatic lighting at night. Hero confronting villain in rain Speech bubble 1: "THIS ENDS NOW!" (shout style, tail pointing down) Effects: rain streaks, lightning flash. Overall mood: intense."
```

---

## Recommended Implementation Path

### Phase 1: Add Text-in-Image Model Support (Quick Win)
1. Add Replicate FLUX.1 as a provider option
2. Update AI settings UI to include provider selection
3. Test with speech bubble generation

### Phase 2: Enhanced Serialization (Better Control)
1. Extend Panel interface with composition, characters, environment data
2. Create structured prompt builder
3. Update natural language parser to extract more details

### Phase 3: Visual Editor (Advanced)
1. Add panel composition controls in UI
2. Character library with reference images
3. Scene builder with drag-and-drop

---

## Cost Comparison

| Provider | Model | Cost/Image | Text Quality | Speed |
|----------|-------|-----------|--------------|-------|
| Replicate | FLUX.1-schnell | $0.003 | ⭐⭐⭐⭐⭐ | Fast (2s) |
| Ideogram | V_2 | $0.08 | ⭐⭐⭐⭐⭐ | Medium (8s) |
| OpenAI | DALL-E 3 | $0.04 | ⭐⭐ | Medium (10s) |
| Stability AI | SDXL | $0.02 | ⭐ | Fast (3s) |

**Recommendation:** Start with **FLUX.1-schnell** for best price/performance ratio.

---

## Next Steps

1. Choose text-in-image provider (recommend FLUX.1)
2. Implement enhanced panel data structure
3. Build structured prompt system
4. Add UI controls for composition settings
5. Test and iterate on prompt quality
