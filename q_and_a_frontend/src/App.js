import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/**
 * Helper to read backend base URL from environment with a sensible default.
 * CRA exposes env variables prefixed with REACT_APP_.
 */
const getBackendBaseUrl = () => {
  // If provided, use env var. Otherwise default to same-origin relative path.
  // In deployment, you can set REACT_APP_BACKEND_BASE_URL to the backend URL.
  return process.env.REACT_APP_BACKEND_BASE_URL || '';
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [question, setQuestion] = useState('');
  const [lastQA, setLastQA] = useState({ question: null, answer: null });
  const [loading, setLoading] = useState(false);
  const [fetchingLast, setFetchingLast] = useState(false);
  const [error, setError] = useState(null);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch the last Q/A on mount
  useEffect(() => {
    const fetchLast = async () => {
      setFetchingLast(true);
      setError(null);
      try {
        const resp = await fetch(`${getBackendBaseUrl()}/answer`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!resp.ok) {
          throw new Error(`Failed to fetch last answer (status ${resp.status})`);
        }
        const data = await resp.json();
        setLastQA({ question: data.question ?? null, answer: data.answer ?? null });
      } catch (e) {
        setError(e.message || 'Unknown error while fetching last answer.');
      } finally {
        setFetchingLast(false);
      }
    };
    fetchLast();
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = question.trim();
    if (!trimmed) {
      setError('Please enter a question before submitting.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${getBackendBaseUrl()}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ question: trimmed })
      });
      if (!resp.ok) {
        let msg = `Request failed (status ${resp.status})`;
        try {
          const errData = await resp.json();
          if (errData && errData.message) msg = errData.message;
        } catch {
          // ignore json parse error
        }
        throw new Error(msg);
      }
      const data = await resp.json();
      setLastQA({ question: data.question ?? trimmed, answer: data.answer ?? '' });
      setQuestion('');
    } catch (e) {
      setError(e.message || 'Unknown error submitting question.');
    } finally {
      setLoading(false);
    }
  }, [question]);

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div style={{ maxWidth: 900, width: '90%', margin: '0 auto', textAlign: 'left' }}>
          <h1 style={{ marginBottom: 8 }}>Q&A Assistant</h1>
          <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
            Ask a question and receive an answer from the backend service.
          </p>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: 12,
            alignItems: 'stretch',
            marginTop: 16,
            background: 'var(--bg-primary)',
            padding: 12,
            borderRadius: 12,
            border: '1px solid var(--border-color)'
          }}>
            <label htmlFor="question-input" style={{ display: 'none' }}>Question</label>
            <input
              id="question-input"
              type="text"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              aria-disabled={loading}
              aria-label="Question input"
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: 16,
                background: 'transparent',
                color: 'var(--text-primary)'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--button-text)',
                border: 'none',
                borderRadius: 8,
                padding: '12px 18px',
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              aria-busy={loading}
            >
              {loading ? 'Submitting…' : 'Ask'}
            </button>
          </form>

          {error && (
            <div role="alert" style={{
              marginTop: 12,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #e07b7b',
              background: 'rgba(224, 123, 123, 0.1)',
              color: '#ff6b6b'
            }}>
              {error}
            </div>
          )}

          <section style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 8 }}>Latest</h2>
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              padding: 16,
              background: 'var(--bg-secondary)'
            }}>
              {fetchingLast ? (
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Loading last question and answer…</p>
              ) : (lastQA.question || lastQA.answer) ? (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Question</div>
                    <div>{lastQA.question}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Answer</div>
                    <div>{lastQA.answer}</div>
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  No question asked yet. Be the first to ask!
                </p>
              )}
            </div>
          </section>

          <footer style={{ marginTop: 28, fontSize: 12, color: 'var(--text-secondary)' }}>
            Backend base URL: {getBackendBaseUrl() || '(same origin)'}
          </footer>
        </div>
      </header>
    </div>
  );
}

export default App;
