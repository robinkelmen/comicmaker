/**
 * Single image generation engine - pure data-driven
 * Reads provider config and executes. No provider-specific code.
 */

import providersConfig from './providers.config.json';

// First principle: substitute variables in any data structure
function substitute(obj: any, vars: Record<string, any>): any {
  if (typeof obj === 'string') {
    return obj.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? '');
  }
  if (Array.isArray(obj)) {
    return obj.map(item => substitute(item, vars));
  }
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = substitute(value, vars);
    }
    return result;
  }
  return obj;
}

// First principle: extract value from nested object by path
function extract(obj: any, path: string): any {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}

// First principle: generate image from pure data config
export async function generateImage(
  prompt: string,
  provider: keyof typeof providersConfig,
  apiKeys: Record<string, string> = {}
): Promise<string> {
  const config = providersConfig[provider];

  // Get API key if needed
  const apiKey = config.requiresKey && config.keyName
    ? apiKeys[config.keyName]
    : undefined;

  // Check if key is required but missing
  if (config.requiresKey && !apiKey) {
    throw new Error(`API key required for ${config.name}`);
  }

  // Build request from config + data
  const vars = { prompt, apiKey };
  const headers = substitute(config.headers, vars);
  const body = substitute(config.body, vars);

  // Call API
  const response = await fetch(config.url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${config.name} error: ${error}`);
  }

  const data = await response.json();

  // Extract image URL from response
  const imageUrl = extract(data, config.extract);

  if (!imageUrl) {
    throw new Error(`No image URL found in response from ${config.name}`);
  }

  return imageUrl;
}

// Storage: pure data in/out
export function loadConfig() {
  return {
    provider: localStorage.getItem('provider') || 'fal-free',
    apiKeys: JSON.parse(localStorage.getItem('apiKeys') || '{}'),
  };
}

export function saveConfig(config: { provider?: string; apiKeys?: Record<string, string> }) {
  if (config.provider) localStorage.setItem('provider', config.provider);
  if (config.apiKeys) localStorage.setItem('apiKeys', JSON.stringify(config.apiKeys));
}

// Export providers for UI to render
export const providers = providersConfig;
