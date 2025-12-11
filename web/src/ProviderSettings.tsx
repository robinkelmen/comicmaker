/**
 * Data-driven provider settings UI
 * Renders from config - no hardcoded UI
 */

import { useState } from 'react';
import { providers, loadConfig, saveConfig } from './imageEngine';

export function ProviderSettings() {
  const [config, setConfig] = useState(loadConfig());
  const [showKeys, setShowKeys] = useState(false);

  const currentProvider = providers[config.provider as keyof typeof providers];

  const updateProvider = (provider: string) => {
    const newConfig = { ...config, provider };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const updateApiKey = (keyName: string, value: string) => {
    const newKeys = { ...config.apiKeys, [keyName]: value };
    const newConfig = { ...config, apiKeys: newKeys };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  return (
    <div className="provider-settings">
      <h3>Image Provider</h3>

      {/* Render providers from config */}
      <div className="providers-grid">
        {Object.entries(providers).map(([id, provider]) => {
          const isSelected = id === config.provider;
          const hasKey = !provider.requiresKey || config.apiKeys[provider.keyName || ''];
          const isReady = !provider.requiresKey || hasKey;

          return (
            <button
              key={id}
              className={`provider-card ${isSelected ? 'selected' : ''} ${!isReady ? 'needs-key' : ''}`}
              onClick={() => updateProvider(id)}
              style={{ borderColor: isSelected ? provider.color : '#ccc' }}
            >
              <div className="provider-icon">{provider.icon}</div>
              <div className="provider-name">{provider.name}</div>
              <div className="provider-meta">
                <span>{provider.cost}</span>
                <span>{provider.speed}</span>
              </div>
              {!isReady && <div className="needs-key-badge">🔑 Needs API Key</div>}
            </button>
          );
        })}
      </div>

      {/* API Key input - only show if current provider needs it */}
      {currentProvider?.requiresKey && currentProvider.keyName && (
        <div className="api-key-section">
          <label>
            <strong>{currentProvider.name} API Key</strong>
            <input
              type={showKeys ? 'text' : 'password'}
              value={config.apiKeys[currentProvider.keyName] || ''}
              onChange={(e) => updateApiKey(currentProvider.keyName!, e.target.value)}
              placeholder={`Enter your ${currentProvider.keyName} API key`}
            />
          </label>
          <button onClick={() => setShowKeys(!showKeys)}>
            {showKeys ? '👁️ Hide' : '👁️ Show'}
          </button>

          {/* Provider-specific help */}
          <div className="provider-help">
            {currentProvider.keyName === 'fal' && (
              <small>
                Get your free FAL.ai API key:
                <br />
                1. Sign up at <a href="https://fal.ai" target="_blank" rel="noopener noreferrer">fal.ai</a>
                <br />
                2. Free tier includes generous credits for testing
                <br />
                3. FLUX Schnell is fast and affordable (~$0.003/image)
              </small>
            )}
            {currentProvider.keyName === 'openai' && (
              <small>
                Get your OpenAI API key:
                <br />
                1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a>
                <br />
                2. If you have ChatGPT Plus, you can use the same account
                <br />
                3. DALL-E 3 costs ~$0.04 per image
              </small>
            )}
          </div>
        </div>
      )}

      <style>{`
        .provider-settings {
          padding: 20px;
          max-width: 800px;
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          margin: 16px 0;
        }

        .provider-card {
          padding: 16px;
          border: 2px solid #ccc;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .provider-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .provider-card.selected {
          background: #f0f9ff;
        }

        .provider-card.needs-key {
          opacity: 0.7;
        }

        .provider-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .provider-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .provider-meta {
          display: flex;
          gap: 8px;
          justify-content: center;
          font-size: 12px;
          color: #666;
        }

        .needs-key-badge {
          margin-top: 8px;
          font-size: 11px;
          color: #f59e0b;
        }

        .api-key-section {
          margin-top: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .api-key-section label {
          display: block;
          margin-bottom: 8px;
        }

        .api-key-section input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-top: 4px;
          font-family: monospace;
        }

        .api-key-section button {
          margin-top: 8px;
          padding: 6px 12px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .provider-help {
          margin-top: 12px;
          padding: 12px;
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          border-radius: 4px;
        }

        .provider-help small {
          display: block;
          color: #1e40af;
          line-height: 1.6;
        }

        .provider-help a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }

        .provider-help a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
