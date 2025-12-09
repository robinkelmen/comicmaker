import React, { useState, useEffect } from 'react'
import { parseNatural } from './naturalParser'
import { ComicPreview } from './ComicPreview'
import { GenerationStatus } from './ProgressBar'
import { saveComic, loadComics, updateComic, deleteComic, SavedComic } from './supabase'
import { generatePanelImage, saveAISettings, loadAISettings, AISettings } from './ai'
import type { Comic } from './types'

const EXAMPLE_STORY = `Hero's Journey

A lone hero stands on a cliff overlooking a burning city. He says "I can't believe they're gone..." WHOOSH! The wind howls.

Close-up of the hero's determined face. He shouts "I will find whoever did this!"

Meanwhile, the hero walks down a dusty road at sunset. He thinks "Where do I even begin?"

Suddenly, a mysterious figure appears from the shadows. The stranger asks "Looking for answers?" The hero replies "Who are you?!" CRACK!
`

export default function App() {
  const [script, setScript] = useState(EXAMPLE_STORY)
  const [currentComicId, setCurrentComicId] = useState<string | null>(null)
  const [savedComics, setSavedComics] = useState<SavedComic[]>([])
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // AI generation state
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [aiSettings, setAISettings] = useState<AISettings | null>(() => loadAISettings())
  const [generatingAll, setGeneratingAll] = useState(false)
  const [currentGenerating, setCurrentGenerating] = useState(0)
  const [totalToGenerate, setTotalToGenerate] = useState(0)
  const [comic, setComic] = useState<Comic | null>(null)

  // Parse using natural language parser
  const result = parseNatural(script)

  // Update comic state when script changes
  useEffect(() => {
    if (result.ok) {
      setComic(result.comic)
    }
  }, [result])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleSave = async () => {
    if (!saveTitle.trim()) {
      setMessage({ type: 'error', text: 'Please enter a title' })
      return
    }

    setSaving(true)
    try {
      if (currentComicId) {
        const { error } = await updateComic(currentComicId, saveTitle, script, comic || undefined)
        if (error) {
          setMessage({ type: 'error', text: error })
        } else {
          setMessage({ type: 'success', text: 'Comic updated!' })
          setShowSaveModal(false)
        }
      } else {
        const { data, error } = await saveComic(saveTitle, script, comic || undefined)
        if (error) {
          setMessage({ type: 'error', text: error })
        } else if (data) {
          setCurrentComicId(data.id)
          setMessage({ type: 'success', text: 'Comic saved!' })
          setShowSaveModal(false)
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save comic' })
    }
    setSaving(false)
  }

  const handleLoadClick = async () => {
    setLoading(true)
    const { data, error } = await loadComics()
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setSavedComics(data || [])
      setShowLoadModal(true)
    }
    setLoading(false)
  }

  const handleLoadComic = (savedComic: SavedComic) => {
    setScript(savedComic.script)
    setCurrentComicId(savedComic.id)
    setSaveTitle(savedComic.title)
    // Restore comic data if it exists (includes generated images)
    if (savedComic.data) {
      setComic(savedComic.data)
    }
    setShowLoadModal(false)
    setMessage({ type: 'success', text: `Loaded "${savedComic.title}"` })
  }

  const handleDeleteComic = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this comic?')) return

    const { error } = await deleteComic(id)
    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setSavedComics(savedComics.filter(c => c.id !== id))
      if (currentComicId === id) {
        setCurrentComicId(null)
        setSaveTitle('')
      }
      setMessage({ type: 'success', text: 'Comic deleted' })
    }
  }

  const handleNewComic = () => {
    setScript(EXAMPLE_STORY)
    setCurrentComicId(null)
    setSaveTitle('')
    setMessage({ type: 'success', text: 'Started new comic' })
  }

  const openSaveModal = () => {
    if (result.ok && result.comic.title) {
      setSaveTitle(result.comic.title)
    }
    setShowSaveModal(true)
  }

  const handleSaveAISettings = (settings: AISettings) => {
    setAISettings(settings)
    saveAISettings(settings)
    setShowSettingsModal(false)
    setMessage({ type: 'success', text: 'AI settings saved!' })
  }

  const handleGeneratePanel = async (pageIndex: number, panelIndex: number) => {
    if (!aiSettings) {
      setMessage({ type: 'error', text: 'Please configure AI settings first' })
      setShowSettingsModal(true)
      return
    }

    if (!comic) return

    // Set panel as generating
    const updatedComic = { ...comic }
    updatedComic.pages[pageIndex].panels[panelIndex].generating = true
    setComic(updatedComic)

    try {
      const panel = comic.pages[pageIndex].panels[panelIndex]
      const imageUrl = await generatePanelImage(panel, aiSettings)

      // Update panel with generated image
      const finalComic = { ...comic }
      finalComic.pages[pageIndex].panels[panelIndex].imageUrl = imageUrl
      finalComic.pages[pageIndex].panels[panelIndex].generating = false
      setComic(finalComic)

      setMessage({ type: 'success', text: 'Panel generated!' })

      // Auto-save if comic is already saved
      if (currentComicId) {
        await updateComic(currentComicId, saveTitle, script, comic || undefined)
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Generation failed: ${error}` })

      // Clear generating state
      const errorComic = { ...comic }
      errorComic.pages[pageIndex].panels[panelIndex].generating = false
      setComic(errorComic)
    }
  }

  const handleGenerateAll = async () => {
    if (!aiSettings) {
      setMessage({ type: 'error', text: 'Please configure AI settings first' })
      setShowSettingsModal(true)
      return
    }

    if (!comic) return

    // Count total panels to generate
    let totalPanels = 0
    for (const page of comic.pages) {
      for (const panel of page.panels) {
        if (!panel.imageUrl) totalPanels++
      }
    }

    if (totalPanels === 0) {
      setMessage({ type: 'success', text: 'All panels already have images!' })
      return
    }

    setGeneratingAll(true)
    setTotalToGenerate(totalPanels)
    setCurrentGenerating(0)

    let successCount = 0
    let failCount = 0

    for (let pageIndex = 0; pageIndex < comic.pages.length; pageIndex++) {
      for (let panelIndex = 0; panelIndex < comic.pages[pageIndex].panels.length; panelIndex++) {
        const panel = comic.pages[pageIndex].panels[panelIndex]

        // Skip panels that already have images
        if (panel.imageUrl) continue

        setCurrentGenerating(successCount + failCount + 1)

        try {
          const imageUrl = await generatePanelImage(panel, aiSettings)

          // Update panel with generated image
          const updatedComic = { ...comic }
          updatedComic.pages[pageIndex].panels[panelIndex].imageUrl = imageUrl
          setComic(updatedComic)

          successCount++
        } catch (error) {
          console.error(`Failed to generate panel ${pageIndex}-${panelIndex}:`, error)
          failCount++
        }
      }
    }

    setGeneratingAll(false)
    setCurrentGenerating(0)
    setTotalToGenerate(0)

    if (failCount === 0) {
      setMessage({ type: 'success', text: `✅ Generated ${successCount} panels!` })
    } else {
      setMessage({ type: 'error', text: `Generated ${successCount} panels, ${failCount} failed` })
    }

    // Auto-save if comic is already saved
    if (currentComicId) {
      await updateComic(currentComicId, saveTitle, script, comic || undefined)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>ComicMaker</h1>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleNewComic}>New</button>
          <button className="btn btn-secondary" onClick={handleLoadClick} disabled={loading}>
            {loading ? 'Loading...' : 'Load'}
          </button>
          <button className="btn btn-primary" onClick={openSaveModal}>Save</button>
          <button className="btn btn-secondary" onClick={() => setShowSettingsModal(true)}>⚙️ AI Settings</button>
          <button
            className="btn btn-primary"
            onClick={handleGenerateAll}
            disabled={generatingAll || !result.ok}
          >
            {generatingAll ? '⏳ Generating...' : '🎨 Generate All'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {generatingAll && (
        <GenerationStatus
          isGenerating={generatingAll}
          currentPanel={currentGenerating}
          totalPanels={totalToGenerate}
        />
      )}

      <div className="editor-pane">
        <div className="editor-header">
          Script Editor
          {currentComicId && <span className="current-doc">Editing: {saveTitle}</span>}
        </div>
        <div className="syntax-guide">
          <strong>✍️ Write naturally:</strong>
          <span>Start with your title</span> •
          <span>Describe scenes in plain English</span> •
          <span>Write dialogue like: He says "Hello"</span> •
          <span>Use CAPS for sound effects</span> •
          <span>Use "Meanwhile" or "Suddenly" to break scenes</span>
        </div>
        <div className="editor">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your comic story naturally... Start with a title, then describe scenes and dialogue in plain English."
            spellCheck={false}
          />
        </div>
      </div>
      
      <div className="preview-pane">
        <div className="editor-header">Preview</div>
        <div className="preview">
          {result.ok ? (
            <ComicPreview
              comic={comic || result.comic}
              onGeneratePanel={handleGeneratePanel}
              generating={generatingAll}
            />
          ) : (
            <div className="error-display">
              <strong>Parse Errors:</strong>
              <ul>
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{currentComicId ? 'Update Comic' : 'Save Comic'}</h2>
            <input
              type="text"
              placeholder="Comic title..."
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (currentComicId ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <h2>Load Comic</h2>
            {savedComics.length === 0 ? (
              <p className="empty-state">No saved comics yet. Create and save your first comic!</p>
            ) : (
              <ul className="comic-list">
                {savedComics.map(comic => (
                  <li key={comic.id} onClick={() => handleLoadComic(comic)}>
                    <div className="comic-info">
                      <strong>{comic.title}</strong>
                      <span className="comic-date">
                        {new Date(comic.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={(e) => handleDeleteComic(comic.id, e)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowLoadModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && <AISettingsModal
        currentSettings={aiSettings}
        onSave={handleSaveAISettings}
        onClose={() => setShowSettingsModal(false)}
      />}
    </div>
  )
}

function AISettingsModal({ currentSettings, onSave, onClose }: {
  currentSettings: AISettings | null
  onSave: (settings: AISettings) => void
  onClose: () => void
}) {
  const [provider, setProvider] = useState<'stability' | 'openai'>(currentSettings?.provider || 'stability')
  const [apiKey, setApiKey] = useState(currentSettings?.apiKey || '')
  const [style, setStyle] = useState(currentSettings?.style || 'comic book')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      alert('Please enter an API key')
      return
    }
    onSave({ provider, apiKey: apiKey.trim(), style: style.trim() })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>AI Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>AI Provider</label>
            <select value={provider} onChange={(e) => setProvider(e.target.value as 'stability' | 'openai')}>
              <option value="stability">Stability AI (Recommended)</option>
              <option value="openai">OpenAI (DALL-E 3)</option>
            </select>
          </div>

          <div className="form-group">
            <label>API Key</label>
            <input
              type="password"
              placeholder={provider === 'stability' ? 'sk-...' : 'sk-...'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoFocus
            />
            <small>
              {provider === 'stability' ? (
                <>Get your key at <a href="https://platform.stability.ai" target="_blank" rel="noopener noreferrer">platform.stability.ai</a></>
              ) : (
                <>Get your key at <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">platform.openai.com</a></>
              )}
            </small>
          </div>

          <div className="form-group">
            <label>Style Prefix (Optional)</label>
            <input
              type="text"
              placeholder="e.g., comic book, manga, watercolor"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
            <small>Add a style prefix to all prompts (e.g., "manga style comic panel")</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  )
}
