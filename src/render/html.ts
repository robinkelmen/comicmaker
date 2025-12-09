import type { Comic, Panel, Dialogue, SoundEffect } from '../schema/types.js';

/**
 * Render comic to standalone HTML string
 */
export function renderToHtml(comic: Comic): string {
  const pages = comic.pages.map((page, i) => renderPage(page.panels, page.layout, i + 1)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(comic.title)}</title>
  <style>${CSS}</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(comic.title)}</h1>
    ${comic.author ? `<p class="author">by ${escapeHtml(comic.author)}</p>` : ''}
  </header>
  <main>
    ${pages}
  </main>
</body>
</html>`;
}

function renderPage(panels: Panel[], layout: string | undefined, pageNum: number): string {
  const layoutClass = layout ? `layout-${layout.replace('x', '-')}` : 'layout-auto';
  const panelHtml = panels.map(renderPanel).join('\n');

  return `
  <section class="page ${layoutClass}" data-page="${pageNum}">
    <div class="page-number">Page ${pageNum}</div>
    <div class="panels">
      ${panelHtml}
    </div>
  </section>`;
}

function renderPanel(panel: Panel): string {
  const imageStyle = panel.image?.url
    ? `background-image: url('${panel.image.url}')`
    : '';

  const elements = [
    panel.narration ? `<div class="narration">${escapeHtml(panel.narration)}</div>` : '',
    ...(panel.dialogue || []).map(renderDialogue),
    ...(panel.sfx || []).map(renderSfx),
  ].filter(Boolean).join('\n');

  return `
    <div class="panel" style="${imageStyle}">
      ${!panel.image?.url ? `<div class="placeholder">${escapeHtml(panel.description)}</div>` : ''}
      <div class="elements">
        ${elements}
      </div>
    </div>`;
}

function renderDialogue(d: Dialogue): string {
  const classes = ['balloon', d.style || 'normal', d.emotion || ''].filter(Boolean).join(' ');
  return `
    <div class="${classes}">
      <span class="character">${escapeHtml(d.character)}</span>
      <p>${escapeHtml(d.text)}</p>
    </div>`;
}

function renderSfx(sfx: SoundEffect): string {
  return `<div class="sfx intensity-${sfx.intensity || 'medium'}">${escapeHtml(sfx.text)}</div>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Comic Sans MS', sans-serif;
  background: #1a1a2e;
  color: #eee;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 { font-size: 2rem; }
.author { opacity: 0.7; margin-top: 0.5rem; }

.page {
  background: white;
  color: #111;
  margin: 2rem auto;
  max-width: 800px;
  padding: 1rem;
  border-radius: 4px;
  position: relative;
}

.page-number {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.5;
}

.panels {
  display: grid;
  gap: 0.5rem;
  min-height: 600px;
}

/* Layout presets */
.layout-auto .panels { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.layout-single .panels,
.layout-splash .panels { grid-template-columns: 1fr; }
.layout-1-2 .panels { grid-template-columns: repeat(2, 1fr); }
.layout-2-1 .panels { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
.layout-2-2 .panels { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); }
.layout-3-3 .panels { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); }

.panel {
  background: #f5f5f5;
  border: 2px solid #111;
  border-radius: 2px;
  min-height: 200px;
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
}

.placeholder {
  background: linear-gradient(135deg, #ddd 25%, #ccc 50%, #ddd 75%);
  padding: 1rem;
  text-align: center;
  font-style: italic;
  color: #666;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.elements {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.balloon {
  background: white;
  border: 2px solid #111;
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;
  max-width: 80%;
  position: relative;
}

.balloon .character {
  font-weight: bold;
  font-size: 0.7rem;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.25rem;
  color: #666;
}

.balloon.shout {
  border-width: 3px;
  border-style: solid;
  border-radius: 0;
  clip-path: polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%);
}

.balloon.whisper {
  border-style: dashed;
  opacity: 0.8;
  font-size: 0.9em;
}

.balloon.thought {
  border-radius: 50%;
  background: #f0f0f0;
}

.narration {
  background: #fffacd;
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-style: italic;
  font-size: 0.9rem;
}

.sfx {
  font-weight: bold;
  font-family: Impact, sans-serif;
  color: #ff4444;
  text-shadow: 2px 2px 0 #000;
  transform: rotate(-5deg);
}

.sfx.intensity-subtle { font-size: 1rem; opacity: 0.7; }
.sfx.intensity-medium { font-size: 1.5rem; }
.sfx.intensity-loud { font-size: 2rem; }
`;

// CLI entry point
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('html.ts')) {
  const fs = await import('fs');
  const { parse } = await import('../parser/parse.js');

  const file = process.argv[2];
  const output = process.argv[3] || 'comic.html';

  if (!file) {
    console.error('Usage: npx tsx src/render/html.ts <file.md> [output.html]');
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf-8');
  const result = parse(content);

  if (!result.ok) {
    console.error('Parse errors:', result.errors);
    process.exit(1);
  }

  const html = renderToHtml(result.comic);
  fs.writeFileSync(output, html);
  console.log(`Rendered to ${output}`);
}
