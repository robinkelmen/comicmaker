export type Style = 'manga' | 'superhero' | 'cartoon' | 'webcomic' | 'noir' | 'chibi'
export type Layout = 'single' | '1x2' | '2x1' | '2x2' | '3x3' | 'auto'
export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'scared' | 'excited' | 'thinking'
export type DialogueStyle = 'normal' | 'shout' | 'whisper' | 'thought'
export type SfxIntensity = 'subtle' | 'medium' | 'loud'

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
