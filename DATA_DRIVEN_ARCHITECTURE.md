# Data-Driven Image Provider Architecture

## First Principles Design

This system is built from first principles:
1. **User wants to generate images** from text prompts
2. **Different APIs exist** with different formats
3. **Configuration = Data** that describes HOW to call each API
4. **One engine reads the config** and executes generically

## The Magic: Pure Data Configuration

### Single Source of Truth: `providers.config.json`

```json
{
  "fal-free": {
    "name": "Free (FLUX)",
    "icon": "⚡",
    "cost": "Free",
    "requiresKey": false,
    "url": "https://queue.fal.run/fal-ai/flux/schnell",
    "headers": { "Content-Type": "application/json" },
    "body": {
      "input": {
        "prompt": "${prompt}",
        "image_size": { "width": 1024, "height": 1024 }
      }
    },
    "extract": "images.0.url"
  }
}
```

### How It Works

1. **Config is pure data** - describes the API call
2. **${variables}** get substituted at runtime
3. **Extract path** tells where to find the image URL in response
4. **No provider-specific code** - one engine handles all

## The Engine: 3 Pure Functions

### 1. `substitute(obj, vars)` - Replace variables

```typescript
// Turns this:
{ "Authorization": "Bearer ${apiKey}" }

// Into this (at runtime):
{ "Authorization": "Bearer sk-abc123" }
```

### 2. `extract(obj, path)` - Get nested values

```typescript
// Turns this:
extract({ data: [{ url: "http://..." }] }, "data.0.url")

// Into this:
"http://..."
```

### 3. `generateImage(prompt, provider, keys)` - Execute

```typescript
// 1. Read config
// 2. Substitute variables
// 3. Call API
// 4. Extract result
```

## The UI: Renders from Config

```typescript
// UI code doesn't know about providers
Object.entries(providers).map(([id, provider]) => (
  <ProviderCard
    name={provider.name}
    icon={provider.icon}
    cost={provider.cost}
  />
))
```

## Adding a New Provider = Adding Data

Want to add Replicate? Just add this to `providers.config.json`:

```json
{
  "replicate": {
    "name": "SDXL",
    "icon": "🖼️",
    "cost": "$0.01",
    "requiresKey": true,
    "keyName": "replicate",
    "url": "https://api.replicate.com/v1/predictions",
    "headers": {
      "Authorization": "Token ${apiKey}",
      "Content-Type": "application/json"
    },
    "body": {
      "version": "stability-ai/sdxl:abc123",
      "input": { "prompt": "${prompt}" }
    },
    "extract": "output.0"
  }
}
```

**That's it.** No code changes needed. The engine handles it automatically.

## Benefits

### For Development
- ✅ **No if/else chains** for different providers
- ✅ **Add providers in seconds** by editing JSON
- ✅ **UI auto-updates** from config
- ✅ **One bug fix** fixes all providers
- ✅ **Easy to test** - just data transformations

### For Users
- ✅ **Free tier** - FAL.ai FLUX Schnell (no cost to you)
- ✅ **BYOK** - users bring their own API keys
- ✅ **No vendor lock-in** - switch providers anytime
- ✅ **Visual selection** - cards show cost, speed, quality

### For Monetization
- ✅ **Zero AI costs** on free tier
- ✅ **Zero AI costs** on BYOK tier
- ✅ **Charge for features** not API access
- ✅ **Users with ChatGPT** can use DALL-E immediately

## File Structure

```
web/src/
├── providers.config.json     # PURE DATA - all provider configs
├── imageEngine.ts            # PURE LOGIC - reads config, executes
├── ProviderSettings.tsx      # PURE UI - renders from config
├── ai.ts                     # Builds prompts, calls engine
└── App.tsx                   # Uses everything
```

## How It All Connects

```
User types prompt
    ↓
ai.ts builds structured prompt from panel data
    ↓
imageEngine.ts loads config from JSON
    ↓
Substitutes variables (${prompt}, ${apiKey})
    ↓
Calls API with substituted data
    ↓
Extracts image URL from response
    ↓
Returns image URL to UI
```

## No Code Approach

### Before (Provider-Specific Code):
```typescript
if (provider === 'openai') {
  return await generateWithOpenAI(prompt, key)
} else if (provider === 'stability') {
  return await generateWithStability(prompt, key)
} else if (provider === 'fal') {
  return await generateWithFAL(prompt, key)
}
// Add new provider = write new function
```

### After (Data-Driven):
```typescript
const config = providers[provider]  // Read data
const headers = substitute(config.headers, { apiKey })
const body = substitute(config.body, { prompt })
const response = await fetch(config.url, { headers, body })
const imageUrl = extract(response, config.extract)
return imageUrl
// Add new provider = add JSON entry
```

## Testing the Free Tier

To test without spending money:

1. **Open the app**
2. **Click "AI Settings"**
3. **Select "Free (FLUX)" provider** ⚡
4. **No API key needed**
5. **Generate images** - totally free

The free provider uses FAL.ai's FLUX Schnell model which has:
- ✅ No cost
- ✅ Good quality
- ✅ Fast generation (2-3 seconds)
- ✅ No credit card required

## Using BYOK (Bring Your Own Key)

For users who already have ChatGPT Plus or other subscriptions:

1. **Click "AI Settings"**
2. **Select "DALL-E 3"** 🎨 or other provider
3. **Paste your OpenAI API key**
4. **Generate images** using your own quota

Their costs, their limits, your app stays free to run.

## The Artist's Brush Analogy

The UI is the **artist's brush** - simple, elegant, intuitive.

The config system is the **canvas** - provides structure and foundation.

The data-driven engine is the **paint** - transforms ideas into reality.

All three work together, but each is pure in its purpose:
- **UI**: Present choices, gather input
- **Config**: Describe the "what" and "where"
- **Engine**: Execute the "how"

No mixing, no coupling, no complexity.

## Future: Infinitely Extensible

Want to add:
- **Midjourney**? Add JSON config.
- **Leonardo AI**? Add JSON config.
- **Local Stable Diffusion**? Add JSON config.
- **Your own API**? Add JSON config.

The system doesn't care. It just reads data and executes.

That's the power of data-driven design.
