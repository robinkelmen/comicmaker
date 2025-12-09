import type { Panel } from './types'

export interface AISettings {
  provider: 'stability' | 'openai'
  apiKey: string
  style?: string
}

export async function generatePanelImage(
  panel: Panel,
  settings: AISettings
): Promise<string> {
  if (!settings.apiKey) {
    throw new Error('API key is required')
  }

  const prompt = buildPrompt(panel, settings.style)

  if (settings.provider === 'stability') {
    return generateWithStability(prompt, settings.apiKey)
  } else {
    return generateWithOpenAI(prompt, settings.apiKey)
  }
}

function buildPrompt(panel: Panel, style?: string): string {
  const parts: string[] = []

  // Add style prefix
  if (style) {
    parts.push(`${style} style comic panel:`)
  }

  // Add scene description
  if (panel.scene) {
    parts.push(panel.scene)
  }

  // Add character info from dialogue
  const characters = panel.elements
    .filter(el => el.type === 'dialogue')
    .map(el => el.character)

  if (characters.length > 0) {
    parts.push(`featuring ${characters.join(', ')}`)
  }

  return parts.join(' ')
}

async function generateWithStability(
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Stability AI error: ${error}`)
  }

  const data = await response.json()
  const base64Image = data.artifacts[0].base64

  // Convert to blob URL for display
  const blob = base64ToBlob(base64Image, 'image/png')
  return URL.createObjectURL(blob)
}

async function generateWithOpenAI(
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI error: ${error}`)
  }

  const data = await response.json()
  return data.data[0].url
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64)
  const byteArrays = []

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i))
  }

  return new Blob([new Uint8Array(byteArrays)], { type: mimeType })
}

// Save AI settings to localStorage
export function saveAISettings(settings: AISettings): void {
  localStorage.setItem('ai_settings', JSON.stringify(settings))
}

export function loadAISettings(): AISettings | null {
  const saved = localStorage.getItem('ai_settings')
  return saved ? JSON.parse(saved) : null
}
