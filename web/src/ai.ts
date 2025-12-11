import type { Panel } from './types'
import { generateImage, loadConfig } from './imageEngine'

// Legacy interface - keeping for compatibility
export interface AISettings {
  provider: 'stability' | 'openai'
  apiKey: string
  style?: string
  backgroundSystemPrompt?: string
}

// Generate panel image using data-driven engine
export async function generatePanelImage(
  panel: Panel,
  settings?: AISettings
): Promise<string> {
  const prompt = buildPrompt(panel, settings?.style)
  const config = loadConfig()

  return generateImage(prompt, config.provider as any, config.apiKeys)
}

function buildPrompt(panel: Panel, style?: string): string {
  return buildStructuredPrompt(panel, style)
}

/**
 * Enhanced structured prompt builder with detailed composition control
 */
function buildStructuredPrompt(panel: Panel, styleOverride?: string): string {
  const parts: string[] = []

  // 1. Style prefix - use rendering style first, then override, then default
  const style = panel.rendering?.style || styleOverride || 'comic book'
  parts.push(`${style} style comic panel.`)

  // 2. Shot composition
  if (panel.composition) {
    const { cameraAngle, shot, focus } = panel.composition
    if (shot) {
      parts.push(`${shot} shot`)
      if (cameraAngle) {
        parts.push(`from ${cameraAngle} angle.`)
      } else {
        parts.push('.')
      }
    } else if (cameraAngle) {
      parts.push(`Shot from ${cameraAngle} angle.`)
    }
    if (focus) {
      parts.push(`Focus on ${focus}.`)
    }
  }

  // 3. Characters with detailed description
  if (panel.characters && panel.characters.length > 0) {
    panel.characters.forEach(char => {
      const charParts: string[] = []
      charParts.push(char.name)

      if (char.position) {
        charParts.push(`positioned ${char.position}`)
      }
      if (char.expression) {
        charParts.push(`${char.expression} expression`)
      }
      if (char.pose) {
        charParts.push(char.pose)
      }
      if (char.clothing) {
        charParts.push(`wearing ${char.clothing}`)
      }

      parts.push(charParts.join(', ') + '.')
    })
  } else {
    // Fallback: extract characters from dialogue elements
    const dialogueCharacters = panel.elements
      .filter(el => el.type === 'dialogue')
      .map(el => ({ name: el.character, expression: el.emotion }))

    if (dialogueCharacters.length > 0) {
      dialogueCharacters.forEach(char => {
        const charDesc = char.expression
          ? `${char.name} with ${char.expression} expression`
          : char.name
        parts.push(`featuring ${charDesc}.`)
      })
    }
  }

  // 4. Environment
  if (panel.environment) {
    const { setting, lighting, weather, timeOfDay } = panel.environment
    if (setting) {
      parts.push(`Setting: ${setting}.`)
    }
    if (lighting || timeOfDay) {
      const lightDesc: string[] = []
      if (lighting) lightDesc.push(`${lighting} lighting`)
      if (timeOfDay) lightDesc.push(`at ${timeOfDay}`)
      parts.push(lightDesc.join(' ') + '.')
    }
    if (weather) {
      parts.push(`Weather: ${weather}.`)
    }
  }

  // 5. Action/Scene description
  if (panel.scene) {
    parts.push(panel.scene)
  }

  // 6. Speech bubbles with EXACT TEXT (for text-capable models)
  if (panel.speechBubbles && panel.speechBubbles.length > 0) {
    parts.push('\nSpeech bubbles with EXACT TEXT:')
    panel.speechBubbles.forEach((bubble, i) => {
      const bubbleStyle = bubble.style === 'shout' ? 'jagged edges' :
                         bubble.style === 'whisper' ? 'dashed outline' :
                         bubble.style === 'thought' ? 'cloud shape' : 'standard'
      parts.push(`\nBubble ${i + 1}: "${bubble.text}" (${bubbleStyle}, tail pointing ${bubble.tailDirection || 'down'})`)
    })
  } else {
    // Fallback: create speech bubbles from dialogue elements
    const dialogueElements = panel.elements.filter(el => el.type === 'dialogue')
    if (dialogueElements.length > 0) {
      parts.push('\nSpeech bubbles with EXACT TEXT:')
      dialogueElements.forEach((el, i) => {
        const bubbleStyle = el.style === 'shout' ? 'jagged edges' :
                           el.style === 'whisper' ? 'dashed outline' :
                           el.style === 'thought' ? 'cloud shape' : 'standard'
        parts.push(`\nBubble ${i + 1}: "${el.text}" spoken by ${el.character} (${bubbleStyle})`)
      })
    }
  }

  // 7. Sound effects with specific text
  const sfxElements = panel.elements.filter(el => el.type === 'sfx')
  if (sfxElements.length > 0) {
    parts.push('\nSound effect text:')
    sfxElements.forEach(sfx => {
      const intensity = sfx.intensity || 'medium'
      parts.push(`"${sfx.text}" (${intensity} intensity)`)
    })
  }

  // 8. Visual effects
  if (panel.rendering?.effects && panel.rendering.effects.length > 0) {
    parts.push(`\nVisual effects: ${panel.rendering.effects.join(', ')}.`)
  }

  // 9. Color palette
  if (panel.rendering?.colorPalette && panel.rendering.colorPalette.length > 0) {
    parts.push(`Color palette: ${panel.rendering.colorPalette.join(', ')}.`)
  }

  // 10. Mood
  if (panel.rendering?.mood) {
    parts.push(`Overall mood: ${panel.rendering.mood}.`)
  }

  return parts.join(' ')
}

// Page background generation
export async function generatePageBackground(
  title: string,
  style: string,
  settings?: AISettings
): Promise<string> {
  const config = loadConfig()

  // Build prompt for page background
  const styleStr = settings?.style || style || 'comic book'
  const prompt = settings?.backgroundSystemPrompt
    ? settings.backgroundSystemPrompt
        .replace('{title}', title)
        .replace('{style}', styleStr)
    : `${styleStr} style full page background for a comic book page, title: "${title}", textured paper, vintage comic aesthetic, blank space for panels, professional comic book layout`

  return generateImage(prompt, config.provider as any, config.apiKeys)
}
