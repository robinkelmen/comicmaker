# Quick Start Guide: Testing Image Generation

## Option 1: FAL.ai Free Tier (Fastest & Cheapest)

FAL.ai offers generous free credits when you sign up - perfect for testing!

1. **Sign up at https://fal.ai** (free account)
2. **Get your API key** from the dashboard
3. In your ComicMaker app:
   - Click **"AI Settings"** button
   - Select **"FLUX Schnell (FAL)" ⚡**
   - Paste your FAL.ai API key
4. Generate your first comic panel!

### Why FAL.ai?
- **Free credits** when you sign up
- **Super fast** (2-3 seconds per image)
- **Very affordable** after free tier (~$0.003 per image)
- **Good quality** for comic panels
- **Best for testing and production**

### Limits
- Free tier: Generous credits for testing
- After free tier: ~$0.003 per image (333 images per $1)
- Perfect for MVP and scaling

---

## Option 2: BYOK - Use ChatGPT Plus Key (Better Quality)

If you have ChatGPT Plus, you already have access to DALL-E 3:

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key
4. In ComicMaker:
   - Click **"AI Settings"**
   - Select **"DALL-E 3" 🎨**
   - Paste your API key
   - Click outside to save
5. Generate panels!

**Cost:**
- Uses your OpenAI quota (~$0.04 per image)
- You control the cost
- Better quality than free tier

---

## Option 3: FAL.ai Pro (Best for Production)

For production with best speed/cost ratio:

1. Sign up at https://fal.ai
2. Get API key from dashboard
3. In ComicMaker:
   - Click **"AI Settings"**
   - Select **"FLUX Pro" ✨**
   - Paste your FAL.ai API key
4. Generate!

**Cost:** ~$0.025 per image

**Benefits:**
- Fast generation
- Great quality
- Affordable
- Reliable API

---

## How to Add New Providers (Data-Driven!)

Want to add a new provider? Just edit `web/src/providers.config.json`:

```json
{
  "your-provider": {
    "name": "Your Provider Name",
    "icon": "🎨",
    "color": "#yourcolor",
    "cost": "$X.XX",
    "speed": "Fast",
    "requiresKey": true,
    "keyName": "yourprovider",
    "url": "https://api.yourprovider.com/generate",
    "headers": {
      "Authorization": "Bearer ${apiKey}",
      "Content-Type": "application/json"
    },
    "body": {
      "prompt": "${prompt}",
      "width": 1024,
      "height": 1024
    },
    "extract": "result.image_url"
  }
}
```

That's it! No code changes. The UI and engine automatically support it.

---

## Testing Checklist

### Before pushing to production:

- [ ] Test free tier (should work immediately)
- [ ] Test with your own OpenAI key (if you have one)
- [ ] Generate a few panels to verify quality
- [ ] Check that API keys are saved locally
- [ ] Try switching between providers
- [ ] Generate a full comic (test batch generation)

### For users:

- [ ] Add clear pricing info in UI
- [ ] Link to provider signup pages
- [ ] Show usage/cost estimates
- [ ] Add error messages for failed generations
- [ ] Show provider status (free/paid/needs-key)

---

## Monetization Paths

### Path 1: Free Forever (Lowest Cost)
- Everyone uses free tier
- You charge for features (templates, exports, storage)
- Your cost: $0/month for AI

### Path 2: Freemium
- Free users: 10 panels/day on free tier
- Pro users ($9.99/mo): Unlimited + premium features
- Your cost: $0/month for AI (they use their keys or free tier)

### Path 3: Full Service
- Free tier: 5 panels/month
- Pro tier: $19.99/mo - you provide API access
- Use cheapest provider (FLUX Schnell on FAL ~$0.025/image)
- 100 images/month = $2.50 cost, $19.99 revenue = $17.49 profit
- Scale from there

---

## Next Steps

1. **Test it locally:**
   ```bash
   npm run dev
   ```

2. **Test free tier** (no setup needed)

3. **Test with your OpenAI key** (if you have ChatGPT Plus)

4. **Add more providers** to providers.config.json

5. **Deploy and share** with beta users

6. **Collect feedback** on which providers they prefer

7. **Add premium features** (not just image generation)

---

## Support

If you run into issues:

1. Check browser console for errors
2. Verify API keys are entered correctly
3. Check provider documentation for API changes
4. Test with free tier first (eliminates key issues)

The data-driven architecture makes debugging easy:
- Config issue? Check JSON
- API issue? Check network tab
- UI issue? Check React components

Everything is separated and testable independently!
