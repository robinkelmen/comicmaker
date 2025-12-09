import type { Comic, Page, Panel, PanelElement, Dialogue, SoundEffect, Narration, Style, Emotion, DialogueStyle } from './types'

interface ParseSuccess {
  ok: true
  comic: Comic
}

interface ParseError {
  ok: false
  errors: string[]
}

type ParseResult = ParseSuccess | ParseError

const STYLES: Style[] = ['manga', 'superhero', 'cartoon', 'webcomic', 'noir', 'chibi']
const EMOTIONS: Emotion[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'scared', 'excited', 'thinking']

export function parse(input: string): ParseResult {
  const lines = input.split('\n')
  const errors: string[] = []

  const { frontmatter, bodyStart } = parseFrontmatter(lines)
  
  if (!frontmatter.title) {
    frontmatter.title = 'Untitled Comic'
  }

  const pages = parsePages(lines.slice(bodyStart), errors)

  if (pages.length === 0) {
    errors.push('No pages found. Start a page with # Page 1')
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    comic: {
      title: frontmatter.title,
      author: frontmatter.author,
      style: frontmatter.style as Style | undefined,
      pages
    }
  }
}

function parseFrontmatter(lines: string[]): { frontmatter: Record<string, string>; bodyStart: number } {
  const frontmatter: Record<string, string> = {}
  let bodyStart = 0
  let inFrontmatter = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true
        continue
      } else {
        bodyStart = i + 1
        break
      }
    }

    if (inFrontmatter && line.includes(':')) {
      const [key, ...rest] = line.split(':')
      frontmatter[key.trim().toLowerCase()] = rest.join(':').trim()
    }
  }

  return { frontmatter, bodyStart }
}

function parsePages(lines: string[], errors: string[]): Page[] {
  const pages: Page[] = []
  let currentPage: Page | null = null
  let currentPanel: Panel | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.match(/^#\s+Page\s+(\d+)/i)) {
      const match = trimmed.match(/^#\s+Page\s+(\d+)/i)
      if (currentPage) {
        if (currentPanel && currentPanel.elements.length > 0) {
          currentPage.panels.push(currentPanel)
        }
        pages.push(currentPage)
      }
      currentPage = {
        number: parseInt(match![1]),
        panels: []
      }
      currentPanel = { elements: [] }
      continue
    }

    if (trimmed === '---' && currentPage) {
      if (currentPanel && (currentPanel.scene || currentPanel.elements.length > 0)) {
        currentPage.panels.push(currentPanel)
      }
      currentPanel = { elements: [] }
      continue
    }

    if (!currentPage || !currentPanel) continue
    if (trimmed === '') continue

    const element = parseLine(trimmed, lines, i)
    if (element) {
      if (element.type === 'scene') {
        currentPanel.scene = element.text
      } else {
        currentPanel.elements.push(element as PanelElement)
      }
      if (element.skipNext) {
        i++
      }
    }
  }

  if (currentPage) {
    if (currentPanel && (currentPanel.scene || currentPanel.elements.length > 0)) {
      currentPage.panels.push(currentPanel)
    }
    pages.push(currentPage)
  }

  return pages
}

interface ParsedElement {
  type: 'dialogue' | 'sfx' | 'narration' | 'scene'
  text?: string
  character?: string
  emotion?: Emotion
  style?: DialogueStyle
  intensity?: 'subtle' | 'medium' | 'loud'
  skipNext?: boolean
}

function parseLine(line: string, lines: string[], index: number): ParsedElement | null {
  if (line.startsWith('*') && line.endsWith('*')) {
    const sfxText = line.slice(1, -1)
    let intensity: 'subtle' | 'medium' | 'loud' = 'medium'
    if (sfxText === sfxText.toUpperCase() && sfxText.length > 5) {
      intensity = 'loud'
    } else if (sfxText === sfxText.toLowerCase()) {
      intensity = 'subtle'
    }
    return { type: 'sfx', text: sfxText, intensity }
  }

  if (line.startsWith('>')) {
    return { type: 'narration', text: line.slice(1).trim() }
  }

  const dialogueMatch = line.match(/^([A-Z][A-Z\s]+)(?:\s*\(([^)]+)\))?$/)
  if (dialogueMatch) {
    const character = dialogueMatch[1].trim()
    const modifier = dialogueMatch[2]?.toLowerCase()
    
    const nextLine = lines[index + 1]?.trim()
    if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('*') && 
        !nextLine.startsWith('>') && nextLine !== '---' &&
        !nextLine.match(/^[A-Z][A-Z\s]+(?:\s*\([^)]+\))?$/)) {
      
      let emotion: Emotion | undefined
      let style: DialogueStyle = 'normal'
      
      if (modifier) {
        if (EMOTIONS.includes(modifier as Emotion)) {
          emotion = modifier as Emotion
        }
        if (modifier === 'thinking' || modifier === 'thought') {
          style = 'thought'
        } else if (modifier === 'shouting' || modifier === 'yelling' || modifier === 'angry') {
          style = 'shout'
        } else if (modifier === 'whispering' || modifier === 'quiet') {
          style = 'whisper'
        }
      }

      return {
        type: 'dialogue',
        character,
        text: nextLine,
        emotion,
        style,
        skipNext: true
      }
    }
    return null
  }

  if (!line.startsWith('#') && !line.match(/^[A-Z][A-Z\s]+/)) {
    return { type: 'scene', text: line }
  }

  return null
}
