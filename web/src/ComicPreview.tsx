import type { Comic, Panel, Dialogue, SoundEffect, Narration, PanelElement } from './types'

interface Props {
  comic: Comic
}

export function ComicPreview({ comic }: Props) {
  const getLayoutClass = (panelCount: number) => {
    if (panelCount === 1) return 'layout-single'
    if (panelCount === 2) return 'layout-2x1'
    if (panelCount <= 4) return 'layout-2x2'
    return 'layout-3x3'
  }

  return (
    <div className="comic-page">
      <h2 className="comic-title">{comic.title}</h2>
      {comic.author && <div className="comic-meta">by {comic.author}</div>}
      {comic.style && <div className="comic-meta">Style: {comic.style}</div>}

      {comic.pages.map((page) => (
        <div key={page.number} className="page-container">
          <div className="page-label">Page {page.number}</div>
          <div className={`panels-grid ${getLayoutClass(page.panels.length)}`}>
            {page.panels.map((panel, panelIndex) => (
              <PanelView key={panelIndex} panel={panel} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PanelView({ panel }: { panel: Panel }) {
  return (
    <div className="panel">
      {panel.scene && <div className="panel-scene">{panel.scene}</div>}
      {panel.elements.map((element, i) => (
        <ElementView key={i} element={element} />
      ))}
    </div>
  )
}

function ElementView({ element }: { element: PanelElement }) {
  if (element.type === 'dialogue') {
    const d = element as Dialogue
    return (
      <div className="dialogue">
        <span className="dialogue-character">{d.character}</span>
        <div className={`dialogue-text style-${d.style || 'normal'}`}>
          {d.text}
        </div>
      </div>
    )
  }

  if (element.type === 'sfx') {
    const s = element as SoundEffect
    return (
      <div className={`sfx intensity-${s.intensity || 'medium'}`}>
        {s.text}
      </div>
    )
  }

  if (element.type === 'narration') {
    const n = element as Narration
    return <div className="narration">{n.text}</div>
  }

  return null
}
