import type { Comic, Page, Panel, Dialogue, SoundEffect, Style, Emotion, DialogueStyle } from '../schema/types';

type ParseResult =
  | { ok: true; comic: Comic }
  | { ok: false; errors: string[] };

const STYLES: Style[] = ['manga', 'superhero', 'cartoon', 'webcomic', 'noir', 'chibi'];
const EMOTIONS: Emotion[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'scared', 'excited'];

export function parse(input: string): ParseResult {
  const lines = input.split('\n');
  const errors: string[] = [];

  // Parse frontmatter
  const { frontmatter, bodyStart } = parseFrontmatter(lines);

  if (!frontmatter.title) {
    errors.push('Missing required field: title');
  }

  // Parse body into pages
  const bodyLines = lines.slice(bodyStart);
  const pages = parsePages(bodyLines, errors);

  if (pages.length === 0) {
    errors.push('Comic must have at least one page');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    comic: {
      title: frontmatter.title!,
      author: frontmatter.author,
      style: frontmatter.style as Style,
      pages
    }
  };
}

function parseFrontmatter(lines: string[]): { frontmatter: Record<string, string>; bodyStart: number } {
  const frontmatter: Record<string, string> = {};
  let bodyStart = 0;

  // Check for --- delimiters
  if (lines[0]?.trim() === '---') {
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        endIndex = i;
        break;
      }
      // Parse key: value
      const match = lines[i].match(/^(\w+):\s*(.+)$/);
      if (match) {
        frontmatter[match[1]] = match[2].trim();
      }
    }
    bodyStart = endIndex + 1;
  }

  return { frontmatter, bodyStart };
}

function parsePages(lines: string[], errors: string[]): Page[] {
  const pages: Page[] = [];
  let currentPage: Page | null = null;
  let currentPanel: Panel | null = null;
  let currentPanelLines: string[] = [];

  const flushPanel = () => {
    if (currentPanelLines.length > 0 && currentPage) {
      const panel = parsePanel(currentPanelLines);
      if (panel) {
        currentPage.panels.push(panel);
      }
      currentPanelLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith('//')) continue;

    // Page header: # Page N
    if (trimmed.match(/^#\s*[Pp]age\s*\d*$/)) {
      flushPanel();
      currentPage = { panels: [] };
      pages.push(currentPage);
      continue;
    }

    // Layout hint: [2x2]
    if (trimmed.match(/^\[.+\]$/) && currentPage) {
      const layout = trimmed.slice(1, -1).trim();
      currentPage.layout = layout as Page['layout'];
      continue;
    }

    // Panel separator: ---
    if (trimmed === '---') {
      flushPanel();
      continue;
    }

    // Accumulate panel content
    if (currentPage) {
      currentPanelLines.push(line);
    }
  }

  // Flush last panel
  flushPanel();

  // If no explicit pages, create one from all content
  if (pages.length === 0 && currentPanelLines.length > 0) {
    const panel = parsePanel(currentPanelLines);
    if (panel) {
      pages.push({ panels: [panel] });
    }
  }

  return pages;
}

function parsePanel(lines: string[]): Panel | null {
  const dialogue: Dialogue[] = [];
  const sfx: SoundEffect[] = [];
  let description = '';
  let narration = '';

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Sound effect: *BOOM* or *crash*
    const sfxMatch = line.match(/^\*([^*]+)\*$/);
    if (sfxMatch) {
      const text = sfxMatch[1];
      const intensity = text === text.toUpperCase() ? 'loud' :
                       text === text.toLowerCase() ? 'subtle' : 'medium';
      sfx.push({ text, intensity });
      i++;
      continue;
    }

    // Narration: > text
    if (line.startsWith('>')) {
      narration = line.slice(1).trim();
      i++;
      continue;
    }

    // Thought: ~ text
    if (line.startsWith('~')) {
      // Treat as dialogue with thought style
      dialogue.push({
        character: 'narrator',
        text: line.slice(1).trim(),
        style: 'thought'
      });
      i++;
      continue;
    }

    // Character dialogue: CHARACTER (emotion) \n text
    const charMatch = line.match(/^([A-Z][A-Z0-9 _]+)(?:\s*\((\w+)\))?$/);
    if (charMatch && i + 1 < lines.length) {
      const character = charMatch[1].trim();
      const emotion = charMatch[2] as Emotion | undefined;

      // Get dialogue text from next line(s)
      i++;
      let text = '';
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        // Stop at empty line, another character, sfx, or narration
        if (!nextLine || nextLine.match(/^[A-Z][A-Z0-9 _]+(\s*\(\w+\))?$/) ||
            nextLine.startsWith('*') || nextLine.startsWith('>') || nextLine.startsWith('~')) {
          break;
        }
        text += (text ? ' ' : '') + nextLine;
        i++;
      }

      if (text) {
        // Detect style from text
        let style: DialogueStyle = 'normal';
        if (text.startsWith('*') && text.endsWith('*')) {
          style = 'whisper';
          text = text.slice(1, -1);
        } else if (text.endsWith('!') || text.endsWith('!!')) {
          style = 'shout';
        }

        dialogue.push({ character, text, emotion, style });
      }
      continue;
    }

    // Default: description
    if (!description) {
      description = line;
    } else {
      description += ' ' + line;
    }
    i++;
  }

  // Must have at least a description
  if (!description && dialogue.length === 0) {
    return null;
  }

  const panel: Panel = { description: description || 'Empty panel' };
  if (dialogue.length > 0) panel.dialogue = dialogue;
  if (narration) panel.narration = narration;
  if (sfx.length > 0) panel.sfx = sfx;

  return panel;
}

// CLI entry point
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('parse.ts')) {
  const fs = await import('fs');
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npx tsx src/parser/parse.ts <file.md>');
    process.exit(1);
  }
  const content = fs.readFileSync(file, 'utf-8');
  const result = parse(content);
  console.log(JSON.stringify(result, null, 2));
}
