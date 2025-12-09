// Generated from comic.schema.json - keep in sync

export type Style = 'manga' | 'superhero' | 'cartoon' | 'webcomic' | 'noir' | 'chibi';
export type Layout = 'auto' | 'single' | 'splash' | '1x2' | '2x1' | '2x2' | '3x3';
export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'scared' | 'excited';
export type DialogueStyle = 'normal' | 'shout' | 'whisper' | 'thought';
export type SfxIntensity = 'subtle' | 'medium' | 'loud';

export interface Comic {
  title: string;
  author?: string;
  style?: Style;
  pages: Page[];
}

export interface Page {
  layout?: Layout;
  panels: Panel[];
}

export interface Panel {
  description: string;
  dialogue?: Dialogue[];
  narration?: string;
  sfx?: SoundEffect[];
  image?: GeneratedImage;
}

export interface Dialogue {
  character: string;
  text: string;
  emotion?: Emotion;
  style?: DialogueStyle;
}

export interface SoundEffect {
  text: string;
  intensity?: SfxIntensity;
}

export interface GeneratedImage {
  url?: string;
  prompt?: string;
  seed?: number;
}
