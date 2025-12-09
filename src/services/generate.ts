import type { Comic, Panel, Style } from '../schema/types.js';

// AI provider configuration - data-driven
const PROVIDERS = {
  replicate: {
    endpoint: 'https://api.replicate.com/v1/predictions',
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    getHeaders: (token: string) => ({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    }),
  },
} as const;

// Style to prompt modifier mapping
const STYLE_PROMPTS: Record<Style, string> = {
  manga: 'manga style, anime art, clean lines, screentone shading',
  superhero: 'comic book style, bold colors, dynamic poses, american comics',
  cartoon: 'cartoon style, simple shapes, bright colors, friendly',
  webcomic: 'digital art, clean lines, modern webcomic style',
  noir: 'noir style, high contrast, black and white, dramatic shadows',
  chibi: 'chibi style, cute, super deformed, kawaii',
};

export interface GenerateOptions {
  provider?: keyof typeof PROVIDERS;
  apiKey?: string;
  width?: number;
  height?: number;
}

export type GenerateResult =
  | { ok: true; url: string; prompt: string }
  | { ok: false; error: string };

/**
 * Build prompt from panel description and comic style
 */
export function buildPrompt(panel: Panel, style?: Style): string {
  const styleModifier = style ? STYLE_PROMPTS[style] : STYLE_PROMPTS.cartoon;
  const base = `${panel.description}, ${styleModifier}, comic panel, high quality`;

  // Add character context if dialogue exists
  if (panel.dialogue?.length) {
    const chars = [...new Set(panel.dialogue.map(d => d.character))];
    const emotions = panel.dialogue
      .filter(d => d.emotion)
      .map(d => `${d.character} looking ${d.emotion}`)
      .join(', ');

    if (emotions) {
      return `${base}, ${emotions}`;
    }
  }

  return base;
}

/**
 * Generate image for a single panel using Replicate API
 */
export async function generatePanelImage(
  panel: Panel,
  style?: Style,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const {
    provider = 'replicate',
    apiKey = process.env.REPLICATE_API_TOKEN,
    width = 1024,
    height = 1024,
  } = options;

  if (!apiKey) {
    return { ok: false, error: 'Missing API key. Set REPLICATE_API_TOKEN env var.' };
  }

  const config = PROVIDERS[provider];
  const prompt = buildPrompt(panel, style);

  try {
    // Start prediction
    const startRes = await fetch(config.endpoint, {
      method: 'POST',
      headers: config.getHeaders(apiKey),
      body: JSON.stringify({
        version: config.model.split(':')[1],
        input: {
          prompt,
          width,
          height,
          num_outputs: 1,
        },
      }),
    });

    if (!startRes.ok) {
      const err = await startRes.text();
      return { ok: false, error: `API error: ${err}` };
    }

    const prediction = await startRes.json();

    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(r => setTimeout(r, 1000));
      const pollRes = await fetch(result.urls.get, {
        headers: config.getHeaders(apiKey),
      });
      result = await pollRes.json();
    }

    if (result.status === 'succeeded' && result.output?.[0]) {
      return { ok: true, url: result.output[0], prompt };
    }

    return { ok: false, error: result.error || 'Generation failed' };
  } catch (e) {
    return { ok: false, error: `Network error: ${(e as Error).message}` };
  }
}

/**
 * Generate images for all panels in a comic
 */
export async function generateComic(
  comic: Comic,
  options: GenerateOptions = {}
): Promise<Comic> {
  const result = structuredClone(comic);

  for (const page of result.pages) {
    for (const panel of page.panels) {
      console.log(`Generating: ${panel.description.slice(0, 50)}...`);
      const genResult = await generatePanelImage(panel, comic.style, options);

      if (genResult.ok) {
        panel.image = {
          url: genResult.url,
          prompt: genResult.prompt,
        };
        console.log(`  Done: ${genResult.url.slice(0, 50)}...`);
      } else {
        console.error(`  Failed: ${genResult.error}`);
      }
    }
  }

  return result;
}

// CLI entry point
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('generate.ts')) {
  const fs = await import('fs');
  const { parse } = await import('../parser/parse.js');

  const file = process.argv[2];
  if (!file) {
    console.error('Usage: REPLICATE_API_TOKEN=xxx npx tsx src/services/generate.ts <file.md>');
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf-8');
  const parseResult = parse(content);

  if (!parseResult.ok) {
    console.error('Parse errors:', parseResult.errors);
    process.exit(1);
  }

  const result = await generateComic(parseResult.comic);
  console.log('\nGenerated comic:');
  console.log(JSON.stringify(result, null, 2));
}
