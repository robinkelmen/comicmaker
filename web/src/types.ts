export type Style = 'manga' | 'superhero' | 'cartoon' | 'webcomic' | 'noir' | 'chibi'
export type Layout = 'single' | '1x2' | '2x1' | '2x2' | '3x3' | 'auto'
export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'scared' | 'excited' | 'thinking'
export type DialogueStyle = 'normal' | 'shout' | 'whisper' | 'thought'
export type SfxIntensity = 'subtle' | 'medium' | 'loud'

// Enhanced composition controls
export type CameraAngle = 'eye-level' | 'high-angle' | 'low-angle' | 'dutch-angle' | 'over-shoulder'
export type ShotType = 'extreme-close-up' | 'close-up' | 'medium' | 'full' | 'long' | 'extreme-long'
export type FocusType = 'character' | 'background' | 'action' | 'object'
export type CharacterPosition = 'left' | 'center' | 'right' | 'foreground' | 'background'
export type LightingType = 'bright' | 'dim' | 'dramatic' | 'natural' | 'neon' | 'silhouette'
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'

export interface Comic {
  title: string
  author?: string
  style?: Style
  pages: Page[]
  pageBackgroundUrl?: string
}

export interface Page {
  number: number
  layout?: Layout
  panels: Panel[]
}

export interface Panel {
  scene?: string
  elements: PanelElement[]
  imageUrl?: string
  generating?: boolean

  // Enhanced composition controls
  composition?: {
    cameraAngle?: CameraAngle
    shot?: ShotType
    focus?: FocusType
  }

  // Character positioning and details
  characters?: Array<{
    name: string
    position?: CharacterPosition
    pose?: string
    expression?: Emotion
    clothing?: string
  }>

  // Environment details
  environment?: {
    setting?: string
    lighting?: LightingType
    weather?: string
    timeOfDay?: TimeOfDay
  }

  // Rendering preferences
  rendering?: {
    style?: Style
    colorPalette?: string[]
    mood?: string
    effects?: string[] // Speed lines, impact stars, etc.
  }

  // Speech bubble positioning (for text-in-image models)
  speechBubbles?: Array<{
    text: string
    character: string
    position?: { x: number; y: number } // Relative 0-1
    style?: DialogueStyle
    tailDirection?: 'up' | 'down' | 'left' | 'right'
  }>
}

export type PanelElement = Dialogue | SoundEffect | Narration

export interface Dialogue {
  type: 'dialogue'
  character: string
  text: string
  emotion?: Emotion
  style?: DialogueStyle
}

export interface SoundEffect {
  type: 'sfx'
  text: string
  intensity?: SfxIntensity
}

export interface Narration {
  type: 'narration'
  text: string
}
