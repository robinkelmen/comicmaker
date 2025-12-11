# Enhanced Prompt System - Usage Guide

## What's New

Your ComicMaker now has a **structured prompt system** that gives AI models much more precise instructions. This results in better image generation with proper composition, lighting, and text rendering.

## Features Implemented

### 1. Enhanced Panel Data Structure ✅
- **Composition Controls**: Camera angles, shot types, focus
- **Character Details**: Position, pose, expression, clothing
- **Environment**: Setting, lighting, weather, time of day
- **Rendering Preferences**: Style, color palette, mood, effects
- **Speech Bubble Positioning**: For text-in-image models

### 2. Structured Prompt Builder ✅
Converts rich panel data into detailed prompts like:

```
superhero style comic panel. medium shot from low-angle angle.
Hero positioned center, angry expression, standing defiantly, wearing torn cape and armor.
Setting: abandoned city street. dramatic lighting at night. Weather: rain.
Hero confronting villain in rain
Speech bubbles with EXACT TEXT:
Bubble 1: "THIS ENDS NOW!" (jagged edges, tail pointing down)
Visual effects: rain streaks, lightning flash.
Overall mood: intense.
```

### 3. UI Composition Controls ✅
Each panel now has a ⚙️ button to access:
- **Shot Type**: Extreme close-up, Close-up, Medium, Full, Long, Extreme long
- **Camera Angle**: Eye level, High angle, Low angle, Dutch angle, Over shoulder
- **Lighting**: Bright, Dim, Dramatic, Natural, Neon, Silhouette
- **Time of Day**: Dawn, Day, Dusk, Night

### 4. Background System Prompt ✅
Custom prompt templates for page background generation with `{title}` and `{style}` placeholders.

### 5. Smart Parser ✅
Automatically extracts composition hints from your natural language:
- "close-up of hero at night with dramatic lighting" → Parsed automatically!

---

## How to Use

### Method 1: Natural Language (Auto-Detection)

Write naturally and the parser will detect composition:

```
Hero's Journey

Close-up of a lone hero at night on a cliff overlooking a burning city.
He says "I can't believe they're gone..." WHOOSH! The wind howls.

Medium shot from low angle. The hero's determined face in dramatic lighting.
He shouts "I will find whoever did this!"

Long shot at dusk. The hero walks down a dusty road.
He thinks "Where do I even begin?"
```

The parser will automatically extract:
- "Close-up" → `composition.shot = 'close-up'`
- "at night" → `environment.timeOfDay = 'night'`
- "low angle" → `composition.cameraAngle = 'low-angle'`
- "dramatic lighting" → `environment.lighting = 'dramatic'`

### Method 2: UI Controls (Manual Fine-Tuning)

1. Click the **⚙️** button on any panel
2. Select composition options from dropdowns
3. Settings save automatically
4. Click **🎨 Generate Image** to use enhanced prompts

### Method 3: Programmatic (Advanced)

Edit the comic JSON directly with full control:

```typescript
const panel: Panel = {
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
  environment: {
    setting: 'abandoned city street',
    lighting: 'dramatic',
    weather: 'rain',
    timeOfDay: 'night'
  },
  rendering: {
    style: 'superhero',
    mood: 'intense',
    effects: ['rain streaks', 'lightning flash']
  }
}
```

---

## Text-in-Image Support

The system now explicitly instructs AI models to render text:

```
Speech bubbles with EXACT TEXT:
Bubble 1: "I can't believe it!" (standard, tail pointing down)
Bubble 2: "WATCH OUT!" (jagged edges, tail pointing left)

Sound effect text:
"BOOM" (loud intensity)
```

This works best with text-capable models like:
- **FLUX.1** (Replicate) - Best quality, cheapest
- **Ideogram AI** - Purpose-built for text
- **DALL-E 3** - Improved with explicit instructions

---

## Background System Prompt Examples

In **⚙️ AI Settings**, you can customize background generation:

**Example 1: Vintage Comic**
```
{style} full page background for '{title}', aged paper texture,
coffee stains, torn edges, vintage 1960s comic aesthetic,
faded colors, halftone dots, space for 4-6 panels
```

**Example 2: Modern Digital**
```
{style} digital comic page background for '{title}',
clean white background, subtle gradient, modern minimalist design,
professional layout grid visible
```

**Example 3: Themed**
```
{style} comic page for '{title}' set in cyberpunk city,
neon-lit background, rain-slicked streets visible around panel edges,
futuristic aesthetic
```

---

## Testing the Enhanced Prompts

### Test Script

Try this example to see all features in action:

```
Cyberpunk Detective

[NEW PANEL]
Extreme close-up at night with neon lighting.
Detective's face illuminated by holographic display.
She says "I've found the killer."

[NEW PANEL]
Medium shot from high angle. The rain-soaked city street at night.
Detective standing in dramatic lighting, wearing a long coat.
BUZZ! Her phone vibrates.

[NEW PANEL]
Over shoulder shot. Looking at a holographic screen with data.
Bright lighting from the screen.
She thinks "This doesn't add up..."

[NEW PANEL]
Long shot at night. Silhouette of detective walking into foggy alley.
Neon signs reflecting in puddles.
Caption: The truth was closer than she thought.
```

### What You Should See

1. **Parser automatically extracts**:
   - Shot types (extreme close-up, medium, over shoulder, long)
   - Camera angles (high angle, over shoulder)
   - Lighting (neon, dramatic, bright, silhouette)
   - Time of day (night)
   - Weather (rain, fog)

2. **UI shows composition controls** with values pre-filled

3. **Generated prompts include all details**:
   - Camera composition
   - Lighting & atmosphere
   - Character positioning
   - EXACT speech bubble text
   - Sound effects

---

## Before & After Comparison

### OLD Prompt (Basic)
```
comic book style comic panel: Detective standing in rain featuring Detective
```

### NEW Prompt (Enhanced)
```
cyberpunk style comic panel. medium shot from high-angle angle.
Detective positioned center, neutral expression, wearing a long coat.
Setting: rain-soaked city street. dramatic lighting at night. Weather: rain.
Detective standing in dramatic lighting, wearing a long coat.
Sound effect text:
"BUZZ!" (medium intensity)
Overall mood: dark and atmospheric.
```

---

## Tips for Best Results

1. **Be Specific**: Mention camera angles and lighting in your scene descriptions
2. **Use UI Controls**: Fine-tune after writing if auto-detection misses something
3. **Include Text**: Explicitly write dialogue and SFX for text-in-image models
4. **Test & Iterate**: Try different compositions to see what works best
5. **Save Often**: Composition settings are saved with your comic

---

## Next Steps

1. **Try the new system** with your existing comics
2. **Experiment with composition controls** on each panel
3. **Test different AI providers** (especially FLUX.1 for text rendering)
4. **Customize background prompts** for your comic's aesthetic
5. **Share feedback** on what works and what could be improved

---

## Technical Details

### Type Definitions

All new types are in `web/src/types.ts`:

```typescript
export type CameraAngle = 'eye-level' | 'high-angle' | 'low-angle' | 'dutch-angle' | 'over-shoulder'
export type ShotType = 'extreme-close-up' | 'close-up' | 'medium' | 'full' | 'long' | 'extreme-long'
export type FocusType = 'character' | 'background' | 'action' | 'object'
export type LightingType = 'bright' | 'dim' | 'dramatic' | 'natural' | 'neon' | 'silhouette'
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'
```

### Prompt Builder

Located in `web/src/ai.ts`:
- `buildStructuredPrompt()` - Main prompt builder
- Converts Panel with composition data → Detailed AI prompt
- Handles fallbacks for backward compatibility

### Parser Enhancements

Located in `web/src/naturalParser.ts`:
- `extractComposition()` - Detects camera/shot keywords
- `extractEnvironment()` - Detects lighting/time/weather
- Automatic extraction during panel parsing

---

## Enjoy your enhanced comic creation! 🎨
