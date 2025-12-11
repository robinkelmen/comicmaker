/**
 * Data-driven image provider configuration
 * Pure data - no logic. The engine reads this config.
 */

export const IMAGE_PROVIDERS = {
  'fal-free': {
    name: 'Free (FLUX Schnell)',
    description: 'Fast, free AI image generation',

    // API config
    api: {
      endpoint: 'https://queue.fal.run/fal-ai/flux/schnell',
      method: 'POST',
      requiresKey: false,
    },

    // Request mapping (data → API format)
    requestMap: {
      prompt: 'input.prompt',
      width: 'input.image_size.width',
      height: 'input.image_size.height',
      num_images: 'input.num_images',
    },

    // Response mapping (API → our format)
    responseMap: {
      imageUrl: 'images[0].url',
    },

    // UI metadata
    ui: {
      cost: 'Free',
      speed: 'fast',
      quality: 'good',
      badge: 'FREE',
      color: '#10b981',
      icon: '⚡',
    },

    // Default parameters
    defaults: {
      width: 1024,
      height: 1024,
      num_images: 1,
    },
  },

  'fal-pro': {
    name: 'FLUX Pro',
    description: 'Higher quality FLUX model',

    api: {
      endpoint: 'https://queue.fal.run/fal-ai/flux/dev',
      method: 'POST',
      requiresKey: true,
      keyName: 'fal',
      headers: {
        'Authorization': 'Key {apiKey}',
        'Content-Type': 'application/json',
      },
    },

    requestMap: {
      prompt: 'input.prompt',
      width: 'input.image_size.width',
      height: 'input.image_size.height',
    },

    responseMap: {
      imageUrl: 'images[0].url',
    },

    ui: {
      cost: '$0.025/image',
      speed: 'fast',
      quality: 'great',
      badge: 'PRO',
      color: '#8b5cf6',
      icon: '✨',
    },

    defaults: {
      width: 1024,
      height: 1024,
    },
  },

  'openai': {
    name: 'DALL-E 3',
    description: 'OpenAI DALL-E 3 (ChatGPT Plus users)',

    api: {
      endpoint: 'https://api.openai.com/v1/images/generations',
      method: 'POST',
      requiresKey: true,
      keyName: 'openai',
      headers: {
        'Authorization': 'Bearer {apiKey}',
        'Content-Type': 'application/json',
      },
    },

    requestMap: {
      prompt: 'prompt',
      size: 'size',
      quality: 'quality',
      model: 'model',
    },

    responseMap: {
      imageUrl: 'data[0].url',
    },

    ui: {
      cost: '$0.04/image',
      speed: 'medium',
      quality: 'excellent',
      badge: 'DALL-E',
      color: '#10a37f',
      icon: '🎨',
    },

    defaults: {
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
    },
  },

  'replicate': {
    name: 'SDXL',
    description: 'Stable Diffusion XL via Replicate',

    api: {
      endpoint: 'https://api.replicate.com/v1/predictions',
      method: 'POST',
      requiresKey: true,
      keyName: 'replicate',
      headers: {
        'Authorization': 'Token {apiKey}',
        'Content-Type': 'application/json',
      },
    },

    requestMap: {
      version: 'version',
      prompt: 'input.prompt',
      width: 'input.width',
      height: 'input.height',
    },

    responseMap: {
      imageUrl: 'output[0]',
      pollUrl: 'urls.get',
    },

    ui: {
      cost: '$0.01/image',
      speed: 'slow',
      quality: 'great',
      badge: 'SDXL',
      color: '#6366f1',
      icon: '🖼️',
    },

    defaults: {
      version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      width: 1024,
      height: 1024,
    },
  },
} as const;

export type ProviderId = keyof typeof IMAGE_PROVIDERS;

// Storage keys (data-driven)
export const STORAGE = {
  provider: 'comicmaker_provider',
  apiKeys: 'comicmaker_keys',
} as const;

// Helper to set nested value from path like "input.prompt"
export function setPath(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

// Helper to get nested value from path like "data[0].url"
export function getPath(obj: any, path: string): any {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}
