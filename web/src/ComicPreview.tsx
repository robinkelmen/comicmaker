import type { Comic, Panel, Dialogue, SoundEffect, Narration, PanelElement } from './types'

interface Props {
  comic: Comic
  onGeneratePanel?: (pageIndex: number, panelIndex: number) => void
  generating?: boolean
}

export function ComicPreview({ comic, onGeneratePanel, generating }: Props) {
  const getLayoutClass = (panelCount: number) => {
    if (panelCount === 1) return 'layout-single'
    if (panelCount === 2) return 'layout-2x1'
    if (panelCount <= 4) return 'layout-2x2'
    return 'layout-3x3'
  }

  const pageStyle = comic.pageBackgroundUrl
    ? {
        backgroundImage: `url(${comic.pageBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <div className="comic-page" style={pageStyle}>
      <h2 className="comic-title">{comic.title}</h2>
      {comic.author && <div className="comic-meta">by {comic.author}</div>}
      {comic.style && <div className="comic-meta">Style: {comic.style}</div>}

      {comic.pages.map((page, pageIndex) => (
        <div key={page.number} className="page-container">
          <div className="page-label">Page {page.number}</div>
          <div className={`panels-grid ${getLayoutClass(page.panels.length)}`}>
            {page.panels.map((panel, panelIndex) => (
              <PanelView
                key={panelIndex}
                panel={panel}
                onGenerate={onGeneratePanel ? () => onGeneratePanel(pageIndex, panelIndex) : undefined}
                generating={generating}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PanelView({ panel, onGenerate, generating }: {
  panel: Panel
  onGenerate?: () => void
  generating?: boolean
}) {
  const panelStyle = panel.imageUrl
    ? {
        backgroundImage: `url(${panel.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <div className="panel" style={panelStyle}>
      <div className="panel-content">
        {panel.scene && !panel.imageUrl && <div className="panel-scene">{panel.scene}</div>}
        {panel.elements.map((element, i) => (
          <ElementView key={i} element={element} />
        ))}
      </div>
      {onGenerate && (
        <button
          className={`btn ${panel.imageUrl ? 'btn-regenerate' : 'btn-generate'}`}
          onClick={onGenerate}
          disabled={generating || panel.generating}
        >
          {panel.generating ? '⏳ Generating...' : panel.imageUrl ? '🔄 Regenerate' : '🎨 Generate Image'}
        </button>
      )}
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
