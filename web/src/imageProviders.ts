/**
 * Image Provider Configuration
 * Supports multiple AI image generation providers with BYOK (Bring Your Own Key)
 */

export type ImageProvider = 'fal-free' | 'fal-pro' | 'openai' | 'replicate' | 'stabilityai';

export interface ProviderConfig {
  id: ImageProvider;
  name: string;
  description: string;
  model: string;
  requiresKey: boolean;
  cost: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'great' | 'excellent';
  features: string[];
}

export const IMAGE_PROVIDERS: Record<ImageProvider, ProviderConfig> = {
  'fal-free': {
    id: 'fal-free',
    name: 'Free (FLUX Schnell)',
    description: 'Fast, free AI image generation. Perfect for testing and quick comics.',
    model: 'fal-ai/flux/schnell',
    requiresKey: false,
    cost: 'Free',
    speed: 'fast',
    quality: 'good',
    features: ['No API key needed', 'Fast generation', 'Good quality', 'Rate limited'],
  },
  'fal-pro': {
    id: 'fal-pro',
    name: 'FLUX Pro (Your Key)',
    description: 'Higher quality FLUX model. Requires FAL.ai API key.',
    model: 'fal-ai/flux/dev',
    requiresKey: true,
    cost: '~$0.025 per image',
    speed: 'fast',
    quality: 'great',
    features: ['Better quality', 'Fast generation', 'Requires FAL.ai key'],
  },
  openai: {
    id: 'openai',
    name: 'DALL-E 3 (Your Key)',
    description: 'OpenAI\'s DALL-E 3. Great for detailed, artistic images. Many users already have ChatGPT Plus.',
    model: 'dall-e-3',
    requiresKey: true,
    cost: '~$0.04 per image',
    speed: 'medium',
    quality: 'excellent',
    features: ['Excellent quality', 'Good at text', 'Use ChatGPT Plus key'],
  },
  replicate: {
    id: 'replicate',
    name: 'SDXL (Your Key)',
    description: 'Stable Diffusion XL via Replicate. Good balance of quality and cost.',
    model: 'stability-ai/sdxl',
    requiresKey: true,
    cost: '~$0.01 per image',
    speed: 'slow',
    quality: 'great',
    features: ['Good quality', 'Low cost', 'Requires Replicate key'],
  },
  stabilityai: {
    id: 'stabilityai',
    name: 'Stability AI (Your Key)',
    description: 'Direct Stability AI access. Multiple models available.',
    model: 'stable-diffusion-xl-1024-v1-0',
    requiresKey: true,
    cost: '~$0.02 per image',
    speed: 'medium',
    quality: 'great',
    features: ['Multiple models', 'Good quality', 'Requires Stability key'],
  },
};

export interface UserAPIKeys {
  openai?: string;
  fal?: string;
  replicate?: string;
  stabilityai?: string;
}

export interface ImageGenerationConfig {
  provider: ImageProvider;
  apiKeys: UserAPIKeys;
}

// LocalStorage keys
const STORAGE_KEYS = {
  PROVIDER: 'comicmaker_image_provider',
  API_KEYS: 'comicmaker_api_keys',
};

/**
 * Get saved image generation configuration
 */
export function getImageConfig(): ImageGenerationConfig {
  const provider = (localStorage.getItem(STORAGE_KEYS.PROVIDER) as ImageProvider) || 'fal-free';
  const apiKeysStr = localStorage.getItem(STORAGE_KEYS.API_KEYS);
  const apiKeys: UserAPIKeys = apiKeysStr ? JSON.parse(apiKeysStr) : {};

  return { provider, apiKeys };
}

/**
 * Save image generation configuration
 */
export function saveImageConfig(config: Partial<ImageGenerationConfig>): void {
  if (config.provider) {
    localStorage.setItem(STORAGE_KEYS.PROVIDER, config.provider);
  }
  if (config.apiKeys) {
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(config.apiKeys));
  }
}

/**
 * Check if current provider is ready to use
 */
export function isProviderReady(provider: ImageProvider, apiKeys: UserAPIKeys): boolean {
  const config = IMAGE_PROVIDERS[provider];

  if (!config.requiresKey) {
    return true; // Free providers are always ready
  }

  // Check if required API key is present
  switch (provider) {
    case 'openai':
      return !!apiKeys.openai;
    case 'fal-pro':
      return !!apiKeys.fal;
    case 'replicate':
      return !!apiKeys.replicate;
    case 'stabilityai':
      return !!apiKeys.stabilityai;
    default:
      return false;
  }
}

/**
 * Get available providers (including those without keys for info)
 */
export function getAvailableProviders(): ProviderConfig[] {
  return Object.values(IMAGE_PROVIDERS);
}

/**
 * Get ready-to-use providers
 */
export function getReadyProviders(apiKeys: UserAPIKeys): ProviderConfig[] {
  return Object.values(IMAGE_PROVIDERS).filter(config =>
    isProviderReady(config.id, apiKeys)
  );
}
