import type { Comic, Page, Panel, Dialogue, SoundEffect, Narration, CameraAngle, ShotType, FocusType, LightingType, TimeOfDay } from './types'

/**
 * Natural Language Parser
 *
 * Parses plain English stories into structured comic data.
 * No syntax required - just write naturally!
 *
 * Examples:
 * - "A hero stands on a cliff. He says 'I can't believe they're gone!'"
 * - "The city burns below. WHOOSH! The wind howls."
 * - "Caption: Meanwhile, at the villain's lair..."
 */

interface ParseResult {
  ok: boolean
  comic: Comic
  errors: string[]
}

// Patterns for detecting different elements
const DIALOGUE_PATTERNS = [
  /(?:he|she|they|the \w+|\w+) (?:says?|shouts?|whispers?|thinks?|yells?|asks?|replies?|exclaims?)[:\s]+["""']([^"""']+)["""']/gi,
  /(?:he|she|they|the \w+|\w+)[:\s]+["""']([^"""']+)["""']/gi,
  /(\w+)[:\s]+["""']([^"""']+)["""']/gi,
]

const SFX_PATTERN = /([A-Z]{2,}(?:[A-Z\s!]+)?)[!.]/g
const NARRATION_PATTERNS = [
  /(?:caption|narrator|narration)[:\s]+(.+?)(?:\.|$)/gi,
  /\[([^\]]+)\]/g,
  /\(([^)]+)\)/g,
]

// Scene break indicators
const SCENE_BREAKS = [
  'meanwhile',
  'later',
  'suddenly',
  'next panel',
  'cut to',
  'new panel',
  '---',
  'panel break',
]

// Explicit panel markers (case-insensitive)
const PANEL_START_MARKER = /\[NEW\s+PANEL\]/i

export function parseNatural(text: string): ParseResult {
  const errors: string[] = []

  if (!text || text.trim().length === 0) {
    return {
      ok: false,
      comic: createEmptyComic(),
      errors: ['Story text is empty']
    }
  }

  try {
    // Extract title from first line if it looks like a title
    const lines = text.split('\n').filter(l => l.trim())
    let title = 'Untitled Comic'
    let storyStart = 0

    if (lines.length > 0 && lines[0].length < 100 && !lines[0].match(/[.!?]$/)) {
      title = lines[0].trim()
      storyStart = 1
    }

    // Join remaining lines into story
    const story = lines.slice(storyStart).join('\n')

    // Split into panels based on natural breaks
    const panels = extractPanels(story)

    if (panels.length === 0) {
      return {
        ok: true,
        comic: {
          title,
          style: 'cartoon',
          pages: [{
            number: 1,
            panels: [{
              scene: story.substring(0, 200),
              elements: []
            }]
          }]
        },
        errors: []
      }
    }

    // Group panels into pages (4 panels per page is standard)
    const pages: Page[] = []
    const panelsPerPage = 4

    for (let i = 0; i < panels.length; i += panelsPerPage) {
      const pagePanels = panels.slice(i, i + panelsPerPage)
      pages.push({
        number: Math.floor(i / panelsPerPage) + 1,
        panels: pagePanels
      })
    }

    return {
      ok: true,
      comic: {
        title,
        style: 'cartoon',
        pages
      },
      errors
    }
  } catch (error) {
    return {
      ok: false,
      comic: createEmptyComic(),
      errors: [`Parse error: ${error}`]
    }
  }
}

function extractPanels(story: string): Panel[] {
  const panels: Panel[] = []

  // Split by paragraph or explicit scene breaks
  const segments = splitIntoSegments(story)

  for (const segment of segments) {
    if (segment.trim().length === 0) continue

    const panel = parseSegment(segment)
    panels.push(panel)
  }

  return panels
}

function splitIntoSegments(text: string): string[] {
  const segments: string[] = []

  // First, check for explicit [NEW PANEL] markers
  if (PANEL_START_MARKER.test(text)) {
    return extractExplicitPanels(text)
  }

  // Otherwise, use automatic segmentation
  let current = ''
  const lines = text.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()

    // Check for explicit scene break keywords
    const isBreak = SCENE_BREAKS.some(marker =>
      trimmed.toLowerCase().includes(marker)
    )

    if (isBreak && current.trim()) {
      segments.push(current.trim())
      current = trimmed.replace(/^(meanwhile|later|suddenly|cut to|next panel|new panel)[:\s]*/i, '')
    } else if (trimmed.length === 0 && current.trim()) {
      segments.push(current.trim())
      current = ''
    } else {
      current += (current ? ' ' : '') + trimmed
    }
  }

  if (current.trim()) {
    segments.push(current.trim())
  }

  return segments
}

function extractExplicitPanels(text: string): string[] {
  const segments: string[] = []
  const panelRegex = /\[NEW\s+PANEL\](.*?)(?:\[(?:END\s+PANEL|\/PANEL)\]|(?=\[NEW\s+PANEL\])|$)/gis

  let match
  while ((match = panelRegex.exec(text)) !== null) {
    const content = match[1].trim()
    if (content) {
      segments.push(content)
    }
  }

  // If no matches found, return original text as single segment
  return segments.length > 0 ? segments : [text]
}

function parseSegment(segment: string): Panel {
  const elements: (Dialogue | SoundEffect | Narration)[] = []
  let remainingText = segment

  // Extract dialogue
  for (const pattern of DIALOGUE_PATTERNS) {
    const matches = [...segment.matchAll(pattern)]
    for (const match of matches) {
      const text = match[match.length - 1] // Last capture group is the dialogue
      const character = extractCharacter(match[0], text)

      elements.push({
        type: 'dialogue',
        character: character || 'Character',
        text: text.trim()
      })

      remainingText = remainingText.replace(match[0], '')
    }
  }

  // Extract sound effects
  const sfxMatches = [...segment.matchAll(SFX_PATTERN)]
  for (const match of sfxMatches) {
    elements.push({
      type: 'sfx',
      text: match[1].trim()
    })
    remainingText = remainingText.replace(match[0], '')
  }

  // Extract narration
  for (const pattern of NARRATION_PATTERNS) {
    const matches = [...segment.matchAll(pattern)]
    for (const match of matches) {
      const text = match[1]
      if (text && text.trim().length > 0) {
        elements.push({
          type: 'narration',
          text: text.trim()
        })
        remainingText = remainingText.replace(match[0], '')
      }
    }
  }

  // What's left is the scene description
  const scene = remainingText.trim() || segment.substring(0, 150)

  // Extract composition hints from scene description
  const composition = extractComposition(scene)
  const environment = extractEnvironment(scene)

  return {
    scene,
    elements,
    composition: Object.keys(composition).length > 0 ? composition : undefined,
    environment: Object.keys(environment).length > 0 ? environment : undefined
  }
}

// Extract camera composition from scene description
function extractComposition(scene: string): { shot?: ShotType; cameraAngle?: CameraAngle; focus?: FocusType } {
  const lower = scene.toLowerCase()
  const composition: { shot?: ShotType; cameraAngle?: CameraAngle; focus?: FocusType } = {}

  // Shot types
  if (lower.includes('extreme close-up') || lower.includes('extreme closeup')) {
    composition.shot = 'extreme-close-up'
  } else if (lower.includes('close-up') || lower.includes('closeup')) {
    composition.shot = 'close-up'
  } else if (lower.includes('medium shot')) {
    composition.shot = 'medium'
  } else if (lower.includes('full shot') || lower.includes('full body')) {
    composition.shot = 'full'
  } else if (lower.includes('long shot')) {
    composition.shot = 'long'
  } else if (lower.includes('extreme long')) {
    composition.shot = 'extreme-long'
  }

  // Camera angles
  if (lower.includes('high angle') || lower.includes('bird\'s eye')) {
    composition.cameraAngle = 'high-angle'
  } else if (lower.includes('low angle') || lower.includes('worm\'s eye')) {
    composition.cameraAngle = 'low-angle'
  } else if (lower.includes('dutch angle') || lower.includes('tilted')) {
    composition.cameraAngle = 'dutch-angle'
  } else if (lower.includes('over shoulder') || lower.includes('over-the-shoulder')) {
    composition.cameraAngle = 'over-shoulder'
  }

  return composition
}

// Extract environment details from scene description
function extractEnvironment(scene: string): { lighting?: LightingType; timeOfDay?: TimeOfDay; weather?: string } {
  const lower = scene.toLowerCase()
  const environment: { lighting?: LightingType; timeOfDay?: TimeOfDay; weather?: string } = {}

  // Lighting
  if (lower.includes('bright') || lower.includes('sunny')) {
    environment.lighting = 'bright'
  } else if (lower.includes('dim') || lower.includes('dark')) {
    environment.lighting = 'dim'
  } else if (lower.includes('dramatic') || lower.includes('spotlight')) {
    environment.lighting = 'dramatic'
  } else if (lower.includes('neon')) {
    environment.lighting = 'neon'
  } else if (lower.includes('silhouette')) {
    environment.lighting = 'silhouette'
  }

  // Time of day
  if (lower.includes('dawn') || lower.includes('sunrise')) {
    environment.timeOfDay = 'dawn'
  } else if (lower.includes('day') || lower.includes('noon') || lower.includes('afternoon')) {
    environment.timeOfDay = 'day'
  } else if (lower.includes('dusk') || lower.includes('sunset')) {
    environment.timeOfDay = 'dusk'
  } else if (lower.includes('night') || lower.includes('midnight')) {
    environment.timeOfDay = 'night'
  }

  // Weather
  if (lower.includes('rain') || lower.includes('storm')) {
    environment.weather = 'rain'
  } else if (lower.includes('snow')) {
    environment.weather = 'snow'
  } else if (lower.includes('fog') || lower.includes('mist')) {
    environment.weather = 'fog'
  }

  return environment
}

function extractCharacter(fullMatch: string, dialogue: string): string | null {
  // Try to find character name before the dialogue
  const beforeDialogue = fullMatch.split(dialogue)[0]

  // Look for capitalized words or "the X" patterns
  const characterMatch = beforeDialogue.match(/(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i)

  if (characterMatch) {
    return characterMatch[1].trim()
  }

  // Look for pronouns and try to infer
  if (/\b(he|him|his)\b/i.test(beforeDialogue)) {
    return 'Hero'
  }
  if (/\b(she|her|hers)\b/i.test(beforeDialogue)) {
    return 'Heroine'
  }
  if (/\b(they|them|their)\b/i.test(beforeDialogue)) {
    return 'Character'
  }

  return null
}

function createEmptyComic(): Comic {
  return {
    title: 'Empty Comic',
    style: 'cartoon',
    pages: [{
      number: 1,
      panels: []
    }]
  }
}

// Helper to convert back to natural text (for editing)
export function comicToNatural(comic: Comic): string {
  let text = `${comic.title}\n\n`

  for (const page of comic.pages) {
    for (const panel of page.panels) {
      // Scene description
      if (panel.scene) {
        text += panel.scene + ' '
      }

      // Elements
      for (const element of panel.elements) {
        if (element.type === 'dialogue') {
          text += `${element.character} says "${element.text}". `
        } else if (element.type === 'sfx') {
          text += `${element.text}! `
        } else if (element.type === 'narration') {
          text += `[${element.text}] `
        }
      }

      text += '\n\n'
    }
  }

  return text.trim()
}
