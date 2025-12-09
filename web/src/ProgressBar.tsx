import React from 'react'

interface ProgressBarProps {
  current: number
  total: number
  message?: string
}

export function ProgressBar({ current, total, message }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-text">
        {message || `Generating ${current} of ${total} panels...`} ({percentage}%)
      </div>
    </div>
  )
}

interface GenerationStatusProps {
  isGenerating: boolean
  currentPanel?: number
  totalPanels?: number
  success?: boolean
  message?: string
}

export function GenerationStatus({
  isGenerating,
  currentPanel = 0,
  totalPanels = 0,
  success,
  message
}: GenerationStatusProps) {
  if (!isGenerating && !success && !message) {
    return null
  }

  return (
    <div className={`generation-status ${success ? 'success' : ''}`}>
      {isGenerating && (
        <>
          <div className="spinner" />
          <ProgressBar current={currentPanel} total={totalPanels} />
        </>
      )}
      {!isGenerating && message && (
        <div className="status-message">{message}</div>
      )}
    </div>
  )
}
