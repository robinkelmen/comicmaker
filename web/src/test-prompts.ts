/**
 * Test file to demonstrate enhanced prompt generation
 * Run with: npx tsx web/src/test-prompts.ts
 */

import type { Panel } from './types'

// Simplified version of buildStructuredPrompt for testing
function buildStructuredPrompt(panel: Panel, styleOverride?: string): string {
  const parts: string[] = []

  // 1. Style prefix
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
    }
    if (focus) {
      parts.push(`Focus on ${focus}.`)
    }
  }

  // 3. Characters
  if (panel.characters && panel.characters.length > 0) {
    panel.characters.forEach(char => {
      const charParts: string[] = []
      charParts.push(char.name)
      if (char.position) charParts.push(`positioned ${char.position}`)
      if (char.expression) charParts.push(`${char.expression} expression`)
      if (char.pose) charParts.push(char.pose)
      if (char.clothing) charParts.push(`wearing ${char.clothing}`)
      parts.push(charParts.join(', ') + '.')
    })
  }

  // 4. Environment
  if (panel.environment) {
    const { setting, lighting, weather, timeOfDay } = panel.environment
    if (setting) parts.push(`Setting: ${setting}.`)
    if (lighting || timeOfDay) {
      const lightDesc: string[] = []
      if (lighting) lightDesc.push(`${lighting} lighting`)
      if (timeOfDay) lightDesc.push(`at ${timeOfDay}`)
      parts.push(lightDesc.join(' ') + '.')
    }
    if (weather) parts.push(`Weather: ${weather}.`)
  }

  // 5. Scene description
  if (panel.scene) {
    parts.push(panel.scene)
  }

  // 6. Speech bubbles
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

  // 7. Sound effects
  const sfxElements = panel.elements.filter(el => el.type === 'sfx')
  if (sfxElements.length > 0) {
    parts.push('\nSound effect text:')
    sfxElements.forEach(sfx => {
      parts.push(`"${sfx.text}" (${sfx.intensity || 'medium'} intensity)`)
    })
  }

  // 8. Visual effects
  if (panel.rendering?.effects && panel.rendering.effects.length > 0) {
    parts.push(`\nVisual effects: ${panel.rendering.effects.join(', ')}.`)
  }

  // 9. Mood
  if (panel.rendering?.mood) {
    parts.push(`Overall mood: ${panel.rendering.mood}.`)
  }

  return parts.join(' ')
}

// Test panels
console.log('=== ENHANCED PROMPT GENERATION TEST ===\n')

// Test 1: Basic panel (backward compatible)
console.log('--- Test 1: Basic Panel (Backward Compatible) ---')
const basicPanel: Panel = {
  scene: 'A hero stands on a cliff',
  elements: [
    {
      type: 'dialogue',
      character: 'Hero',
      text: "I can't believe they're gone!",
    }
  ]
}
console.log(buildStructuredPrompt(basicPanel, 'manga'))
console.log('\n')

// Test 2: Enhanced panel with composition
console.log('--- Test 2: Enhanced Panel with Composition ---')
const enhancedPanel: Panel = {
  scene: 'Hero confronting villain in rain',
  elements: [
    {
      type: 'dialogue',
      character: 'Hero',
      text: 'This ends now!',
      style: 'shout'
    },
    {
      type: 'sfx',
      text: 'CRACK!',
      intensity: 'loud'
    }
  ],
  composition: {
    cameraAngle: 'low-angle',
    shot: 'medium',
    focus: 'character'
  },
  characters: [
    {
      name: 'Hero',
      position: 'center',
      pose: 'standing defiantly',
      expression: 'angry',
      clothing: 'torn cape and armor'
    }
  ],
  environment: {
    setting: 'abandoned city street',
    lighting: 'dramatic',
    weather: 'heavy rain',
    timeOfDay: 'night'
  },
  rendering: {
    style: 'superhero',
    mood: 'intense',
    effects: ['rain streaks', 'lightning flash']
  }
}
console.log(buildStructuredPrompt(enhancedPanel))
console.log('\n')

// Test 3: Close-up with minimal environment
console.log('--- Test 3: Close-up Shot ---')
const closeupPanel: Panel = {
  scene: "Detective's face illuminated by screen",
  elements: [
    {
      type: 'dialogue',
      character: 'Detective',
      text: "I've found the killer.",
    }
  ],
  composition: {
    shot: 'extreme-close-up',
    focus: 'character'
  },
  environment: {
    lighting: 'neon',
    timeOfDay: 'night'
  }
}
console.log(buildStructuredPrompt(closeupPanel, 'cyberpunk'))
console.log('\n')

// Test 4: Action scene with multiple characters
console.log('--- Test 4: Action Scene ---')
const actionPanel: Panel = {
  scene: 'Epic battle in the streets',
  elements: [
    {
      type: 'sfx',
      text: 'BOOM!',
      intensity: 'loud'
    },
    {
      type: 'sfx',
      text: 'CRASH!',
      intensity: 'loud'
    }
  ],
  composition: {
    shot: 'long',
    cameraAngle: 'high-angle',
    focus: 'action'
  },
  characters: [
    {
      name: 'Hero',
      position: 'left',
      expression: 'excited',
      pose: 'leaping through air'
    },
    {
      name: 'Villain',
      position: 'right',
      expression: 'angry',
      pose: 'defending'
    }
  ],
  environment: {
    setting: 'downtown city street',
    lighting: 'bright',
    timeOfDay: 'day'
  },
  rendering: {
    effects: ['speed lines', 'impact stars', 'debris'],
    mood: 'high energy'
  }
}
console.log(buildStructuredPrompt(actionPanel, 'superhero'))
console.log('\n')

console.log('=== All tests completed! ===')
