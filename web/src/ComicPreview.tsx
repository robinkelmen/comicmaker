import { useState } from 'react'
import type { Comic, Panel, Dialogue, SoundEffect, Narration, PanelElement } from './types'

interface Props {
  comic: Comic
  onGeneratePanel?: (pageIndex: number, panelIndex: number) => void
  onUpdatePanel?: (pageIndex: number, panelIndex: number, panel: Panel) => void
  generating?: boolean
}

export function ComicPreview({ comic, onGeneratePanel, onUpdatePanel, generating }: Props) {
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
                onUpdate={onUpdatePanel ? (updatedPanel) => onUpdatePanel(pageIndex, panelIndex, updatedPanel) : undefined}
                generating={generating}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PanelView({ panel, onGenerate, onUpdate, generating }: {
  panel: Panel
  onGenerate?: () => void
  onUpdate?: (panel: Panel) => void
  generating?: boolean
}) {
  const [showCompositionControls, setShowCompositionControls] = useState(false)

  const panelStyle = panel.imageUrl
    ? {
        backgroundImage: `url(${panel.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  const handleCompositionChange = (field: string, value: any) => {
    if (!onUpdate) return

    const updatedPanel = {
      ...panel,
      composition: {
        ...panel.composition,
        [field]: value || undefined
      }
    }
    onUpdate(updatedPanel)
  }

  const handleEnvironmentChange = (field: string, value: any) => {
    if (!onUpdate) return

    const updatedPanel = {
      ...panel,
      environment: {
        ...panel.environment,
        [field]: value || undefined
      }
    }
    onUpdate(updatedPanel)
  }

  return (
    <div className="panel" style={panelStyle}>
      <div className="panel-content">
        {panel.scene && !panel.imageUrl && <div className="panel-scene">{panel.scene}</div>}
        {panel.elements.map((element, i) => (
          <ElementView key={i} element={element} />
        ))}
      </div>

      {onUpdate && (
        <button
          className="btn btn-secondary btn-small"
          onClick={() => setShowCompositionControls(!showCompositionControls)}
          style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '0.75em' }}
        >
          {showCompositionControls ? '✕' : '⚙️'}
        </button>
      )}

      {showCompositionControls && onUpdate && (
        <div className="composition-controls" style={{
          position: 'absolute',
          bottom: '40px',
          left: '5px',
          right: '5px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          fontSize: '0.75em',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '6px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '2px' }}>Shot Type:</label>
            <select
              value={panel.composition?.shot || ''}
              onChange={(e) => handleCompositionChange('shot', e.target.value)}
              style={{ width: '100%', padding: '2px' }}
            >
              <option value="">Default</option>
              <option value="extreme-close-up">Extreme Close-up</option>
              <option value="close-up">Close-up</option>
              <option value="medium">Medium</option>
              <option value="full">Full</option>
              <option value="long">Long</option>
              <option value="extreme-long">Extreme Long</option>
            </select>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '2px' }}>Camera Angle:</label>
            <select
              value={panel.composition?.cameraAngle || ''}
              onChange={(e) => handleCompositionChange('cameraAngle', e.target.value)}
              style={{ width: '100%', padding: '2px' }}
            >
              <option value="">Default</option>
              <option value="eye-level">Eye Level</option>
              <option value="high-angle">High Angle</option>
              <option value="low-angle">Low Angle</option>
              <option value="dutch-angle">Dutch Angle</option>
              <option value="over-shoulder">Over Shoulder</option>
            </select>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '2px' }}>Lighting:</label>
            <select
              value={panel.environment?.lighting || ''}
              onChange={(e) => handleEnvironmentChange('lighting', e.target.value)}
              style={{ width: '100%', padding: '2px' }}
            >
              <option value="">Default</option>
              <option value="bright">Bright</option>
              <option value="dim">Dim</option>
              <option value="dramatic">Dramatic</option>
              <option value="natural">Natural</option>
              <option value="neon">Neon</option>
              <option value="silhouette">Silhouette</option>
            </select>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '2px' }}>Time of Day:</label>
            <select
              value={panel.environment?.timeOfDay || ''}
              onChange={(e) => handleEnvironmentChange('timeOfDay', e.target.value)}
              style={{ width: '100%', padding: '2px' }}
            >
              <option value="">Default</option>
              <option value="dawn">Dawn</option>
              <option value="day">Day</option>
              <option value="dusk">Dusk</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>
      )}

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
