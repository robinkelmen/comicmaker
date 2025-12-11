# Get Started: Generate Your First Comic in 5 Minutes

## Step 1: Get a Free FAL.ai Account (2 minutes)

1. Go to **https://fal.ai**
2. Click **"Sign Up"** (use GitHub, Google, or email)
3. Verify your email
4. You'll get **free credits** to start testing!

## Step 2: Get Your API Key (1 minute)

1. Once logged in, go to your **Dashboard**
2. Look for **"API Keys"** section
3. Click **"Create New Key"**
4. Copy your key (starts with something like `fal_...`)
5. Keep it safe - you'll paste it in ComicMaker

## Step 3: Configure ComicMaker (1 minute)

1. Open your ComicMaker app
2. Click the **"AI Settings"** button (top right)
3. You'll see provider cards:
   - **FLUX Schnell (FAL) ⚡** - Select this one
   - DALL-E 3 - For later if you want
   - FLUX Pro - Higher quality option
4. After selecting FLUX Schnell, you'll see an API key input
5. Paste your FAL.ai API key
6. Close the settings (it auto-saves)

## Step 4: Generate Your First Comic! (1 minute)

1. The example story is already loaded
2. Look at the comic panels preview
3. Click **"Generate All"** button
4. Watch as your comic comes to life!
5. Each panel will show a loading state, then the generated image

## What You Get with FAL.ai Free Tier

✅ **Free credits** when you sign up (enough for testing)
✅ **Fast generation** (2-3 seconds per image)
✅ **Good quality** for comic panels
✅ **Very cheap** after free credits (~$0.003 per image = 333 images per $1)

## Cost Breakdown

| Images | Cost with FAL.ai | Your Cost (BYOK) |
|--------|------------------|------------------|
| 10     | ~$0.03          | $0               |
| 100    | ~$0.30          | $0               |
| 1000   | ~$3.00          | $0               |

**Why BYOK (Bring Your Own Key) rocks:**
- You pay $0 for API costs
- Users pay their own (very cheap) costs
- You can charge for features, not API access
- Users appreciate transparency

## Alternative: Use DALL-E if You Have ChatGPT Plus

If you already subscribe to ChatGPT Plus:

1. Go to **https://platform.openai.com/api-keys**
2. Create a new API key
3. In ComicMaker, select **"DALL-E 3"**
4. Paste your OpenAI API key
5. Higher quality, but more expensive (~$0.04 per image)

## What's Next?

### For Testing:
- Try different story prompts
- Generate individual panels vs. all at once
- Test the page background generator
- Experiment with different art styles in your prompts

### For Production:
- Add your own comic stories
- Export your comics (coming soon)
- Share with friends
- Consider premium features to monetize

### For Development:
- Add more providers (just edit `providers.config.json`)
- Customize the prompt builder in `ai.ts`
- Add features like character consistency
- Implement user accounts and storage

## Troubleshooting

### "API key required" error
- Make sure you pasted the key correctly
- Check that the key starts with `fal_` for FAL.ai
- Verify you selected the right provider

### "Authentication failed" error
- Your API key might be invalid
- Try creating a new key in FAL.ai dashboard
- Make sure you didn't include any extra spaces

### "Rate limit exceeded" error
- You've used up your free credits
- Add more credits to your FAL.ai account
- Or switch to a different provider temporarily

### Images not generating
- Check the browser console for errors
- Verify your internet connection
- Try a different provider to isolate the issue

## Need Help?

- **FAL.ai docs**: https://fal.ai/docs
- **OpenAI docs**: https://platform.openai.com/docs
- **ComicMaker repo**: Check the issues section

## Pro Tips

1. **Start with FAL.ai** - cheapest and fastest for testing
2. **Save your prompts** - you can reuse good prompts
3. **Use BYOK** - don't pay for users' API costs
4. **Charge for features** - templates, exports, storage, etc.
5. **Monitor usage** - add analytics to see what users generate

Happy comic making! 🎨📚
