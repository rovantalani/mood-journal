import React, { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { MoodEntry, MOODS } from '../types';
import { getApiKey, saveApiKey } from '../utils/storage';

interface Props {
  entries: MoodEntry[];
}

export default function AIReflection({ entries }: Props) {
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState('');
  const [error, setError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyDraft, setKeyDraft] = useState('');

  const handleSaveKey = () => {
    saveApiKey(keyDraft.trim());
    setShowKeyInput(false);
    setKeyDraft('');
  };

  const handleReflect = async () => {
    const key = getApiKey() || (import.meta.env.VITE_ANTHROPIC_API_KEY ?? '');
    if (!key) {
      setShowKeyInput(true);
      return;
    }
    if (!entries.length) {
      setError('Log at least one mood entry to get a reflection.');
      return;
    }

    setLoading(true);
    setReflection('');
    setError('');

    try {
      const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });

      const entryLines = [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(e => {
          const emoji = MOODS.find(m => m.level === e.mood)?.emoji ?? '';
          const noteText = e.note.trim() ? ` — "${e.note.trim()}"` : '';
          return `${e.date}: ${emoji} ${e.mood}${noteText}`;
        })
        .join('\n');

      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system:
          'You are a warm, empathetic journaling companion. Reflect on the user\'s mood patterns with genuine care, specificity, and gentle encouragement. Be personal and human — never clinical.',
        messages: [
          {
            role: 'user',
            content: `Here are my recent mood journal entries:\n\n${entryLines}\n\nPlease share a warm, thoughtful reflection on my emotional patterns. Notice any trends, acknowledge the hard days with compassion, and celebrate the good ones. Keep it to 2–3 cozy paragraphs.`,
          },
        ],
      });

      for await (const text of stream.textStream) {
        setReflection(prev => prev + text);
      }

      await stream.finalMessage();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      if (msg.includes('401') || msg.toLowerCase().includes('auth') || msg.includes('api_key')) {
        setError('API key looks invalid — double-check it and try again.');
        setShowKeyInput(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card reflection-card">
      <div className="reflection-header">
        <h2 className="section-title">
          <span>✨</span> AI Reflection
        </h2>
        <button
          className="key-toggle"
          onClick={() => setShowKeyInput(v => !v)}
          title="Configure API key"
          aria-label="Configure API key"
        >
          ⚙️
        </button>
      </div>

      {showKeyInput && (
        <div className="api-key-form">
          <p className="api-key-hint">
            Paste your{' '}
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
              Anthropic API key
            </a>{' '}
            — saved locally, never sent anywhere except Anthropic.
          </p>
          <div className="api-key-row">
            <input
              type="password"
              className="api-key-input"
              placeholder="sk-ant-..."
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
              autoFocus
            />
            <button className="api-key-save" onClick={handleSaveKey}>
              Save
            </button>
          </div>
        </div>
      )}

      <p className="reflection-hint">
        Let Claude read your last {Math.min(entries.length || 7, 7)} entries and share a warm, personal reflection on how you've been feeling.
      </p>

      <button
        className={`reflect-btn${loading ? ' reflect-btn--loading' : ''}`}
        onClick={handleReflect}
        disabled={loading}
      >
        {loading ? (
          <span className="btn-inner">
            <span className="spinner" />
            Reflecting…
          </span>
        ) : (
          '✨ Reflect on My Week'
        )}
      </button>

      {error && <p className="reflection-error">{error}</p>}

      {reflection && (
        <div className="reflection-text">
          {reflection}
        </div>
      )}
    </div>
  );
}
