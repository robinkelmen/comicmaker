import React, { useState, useEffect } from 'react'
import { parse } from './parser'
import { ComicPreview } from './ComicPreview'
import { saveComic, loadComics, updateComic, deleteComic, SavedComic } from './supabase'

const EXAMPLE_SCRIPT = `---
title: Hero's Journey
style: manga
---

# Page 1

A lone hero stands on a cliff overlooking a burning city

HERO
I can't believe they're gone...

*WHOOOOSH*

---

Close-up of the hero's determined face

HERO (angry)
I will find whoever did this!

> The wind carries the ashes of what was once home.

# Page 2

The hero walks down a dusty road at sunset

HERO (thinking)
Where do I even begin?

---

A mysterious figure appears from the shadows

STRANGER
Looking for answers?

HERO (surprised)
Who are you?!

*CRACK*
`

export default function App() {
  const [script, setScript] = useState(EXAMPLE_SCRIPT)
  const [currentComicId, setCurrentComicId] = useState<string | null>(null)
  const [savedComics, setSavedComics] = useState<SavedComic[]>([])
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const result = parse(script)

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
        const { error } = await updateComic(currentComicId, saveTitle, script)
        if (error) {
          setMessage({ type: 'error', text: error })
        } else {
          setMessage({ type: 'success', text: 'Comic updated!' })
          setShowSaveModal(false)
        }
      } else {
        const { data, error } = await saveComic(saveTitle, script)
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

  const handleLoadComic = (comic: SavedComic) => {
    setScript(comic.script)
    setCurrentComicId(comic.id)
    setSaveTitle(comic.title)
    setShowLoadModal(false)
    setMessage({ type: 'success', text: `Loaded "${comic.title}"` })
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
    setScript(EXAMPLE_SCRIPT)
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
        </div>
      </header>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="editor-pane">
        <div className="editor-header">
          Script Editor
          {currentComicId && <span className="current-doc">Editing: {saveTitle}</span>}
        </div>
        <div className="syntax-guide">
          <strong>Quick Guide:</strong>
          <span><code># Page 1</code> starts a page</span> •
          <span><code>---</code> separates panels (must be on its own line)</span> •
          <span><code>CHARACTER</code> then dialogue on next line</span> •
          <span><code>*SFX*</code> sound effects</span> •
          <span><code>&gt; text</code> narration</span>
        </div>
        <div className="editor">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your comic script here..."
            spellCheck={false}
          />
        </div>
      </div>
      
      <div className="preview-pane">
        <div className="editor-header">Preview</div>
        <div className="preview">
          {result.ok ? (
            <ComicPreview comic={result.comic} />
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
    </div>
  )
}
