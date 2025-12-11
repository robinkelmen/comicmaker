# Quick Reference: Enhanced ComicMaker Features

## 🎯 TL;DR

Your ComicMaker now has **professional composition controls** and **text-in-image support**!

---

## 🎨 How to Use Composition Controls

### Method 1: Click the ⚙️ Button
1. Find the ⚙️ button in the top-right corner of any panel
2. Select options from dropdowns:
   - **Shot Type**: How close/far the camera is
   - **Camera Angle**: Where the camera is positioned
   - **Lighting**: The mood/brightness
   - **Time of Day**: When the scene takes place
3. Settings auto-save ✅
4. Click **🎨 Generate Image** to use the enhanced prompt

### Method 2: Write Naturally
Just write your scene description with composition hints:

```
Close-up of detective at night with dramatic lighting.
She says "I found the killer."
```

The parser automatically detects:
- "Close-up" → Shot type
- "at night" → Time of day
- "dramatic lighting" → Lighting

---

## 📝 Composition Options Reference

### Shot Types
| Option | Description | Use When |
|--------|-------------|----------|
| **Extreme Close-up** | Eyes, hands, objects | Showing emotion/detail |
| **Close-up** | Face, upper body | Character focus |
| **Medium** | Waist up | Dialogue scenes |
| **Full** | Entire body | Showing action/pose |
| **Long** | Full scene, distant | Establishing shots |
| **Extreme Long** | Landscape, aerial | Epic scope |

### Camera Angles
| Option | Description | Effect |
|--------|-------------|--------|
| **Eye Level** | Standard view | Neutral, realistic |
| **High Angle** | Looking down | Character looks weak/small |
| **Low Angle** | Looking up | Character looks powerful/threatening |
| **Dutch Angle** | Tilted camera | Disorienting, tense |
| **Over Shoulder** | Behind character | POV, conversation |

### Lighting
| Option | Description | Mood |
|--------|-------------|------|
| **Bright** | Sunny, cheerful | Happy, optimistic |
| **Dim** | Low light, shadows | Mysterious, somber |
| **Dramatic** | High contrast, spotlight | Intense, theatrical |
| **Natural** | Realistic, balanced | Everyday, normal |
| **Neon** | Artificial, colorful | Cyberpunk, urban |
| **Silhouette** | Backlit, dark outline | Mystery, reveal |

### Time of Day
- **Dawn**: Sunrise, hopeful beginning
- **Day**: Bright, active, normal
- **Dusk**: Sunset, transition, reflection
- **Night**: Dark, mysterious, intimate

---

## 🤖 Text-in-Image AI Models

### Recommended: FLUX.1 (Replicate)
- **Best for**: Text rendering + Quality + Price
- **Cost**: $0.003 per image
- **Speed**: ~2 seconds
- **Setup**: Get API key from replicate.com

### Alternative: Ideogram AI
- **Best for**: Complex text layouts
- **Cost**: $0.08 per image
- **Speed**: ~8 seconds
- **Setup**: Get API key from ideogram.ai

### Current: DALL-E 3 / Stability AI
- **Text Quality**: ⭐⭐ (Limited)
- **Works better with**: Explicit "EXACT TEXT:" instructions
- **Already configured** ✅

---

## 🖼️ Custom Background Prompts

Go to **⚙️ AI Settings** → **Background System Prompt**

### Template Variables
- `{title}` - Your comic title
- `{style}` - Your comic style

### Example Templates

**Vintage Comic**
```
{style} aged paper background for '{title}', coffee stains,
torn edges, 1960s comic aesthetic, halftone dots
```

**Modern Clean**
```
{style} clean white background for '{title}', minimal design,
professional layout grid
```

**Themed**
```
{style} page for '{title}' in cyberpunk city, neon-lit background,
rain-slicked streets visible around panel edges
```

---

## 💡 Quick Tips

### For Better AI Results
1. ✅ Be specific about text you want in images
2. ✅ Use composition controls for precise framing
3. ✅ Mention lighting and time of day
4. ✅ Try different shot types for variety
5. ✅ Save settings before generating

### Natural Language Examples
```
Close-up at night: Detective's face in neon lighting.
She says "The truth is out there."

Medium shot from low angle: Hero standing defiantly in rain.
He shouts "This ends now!" CRACK!

Long shot at dusk: Silhouette walking into foggy alley.
```

### Manual Control
1. Write your scene first
2. Click ⚙️ to open controls
3. Fine-tune composition
4. Generate image
5. Adjust and regenerate if needed

---

## 📚 Full Documentation

- **[AI_IMAGE_SOLUTIONS.md](AI_IMAGE_SOLUTIONS.md)** - Text-in-image model guide
- **[ENHANCED_PROMPTS_GUIDE.md](ENHANCED_PROMPTS_GUIDE.md)** - Detailed user guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## 🚀 Try It Now!

### Quick Test
1. Create a new comic
2. Write: "Close-up of hero at night with dramatic lighting. He says 'I will find you.'"
3. Click ⚙️ on the panel
4. See the auto-detected composition ✨
5. Click 🎨 Generate Image

### Example Script
```
Cyberpunk Detective

[NEW PANEL]
Extreme close-up at night with neon lighting.
Detective's face illuminated by holographic display.
She says "I've found the killer."

[NEW PANEL]
Medium shot from high angle. Rain-soaked city street at night.
Detective in dramatic lighting, wearing long coat.
BUZZ! Her phone vibrates.
```

---

## 🎉 That's It!

You now have professional-grade comic composition controls. Enjoy creating! 🎨
