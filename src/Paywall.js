import React, { useState } from 'react';

const UNLOCK_CODE = 'ONEVIEW2026';
const GUMROAD_LINK = 'https://gumroad.com'; // Update with real link when ready

export default function Paywall({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);

  function handleUnlock() {
    if (code.trim().toUpperCase() === UNLOCK_CODE) {
      onUnlock();
    } else {
      setError('That code doesn\'t match. Please check your purchase email and try again.');
      setTimeout(() => setError(''), 3000);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--bg) 0%, var(--rose-pale) 50%, var(--gold-pale) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      fontFamily: "'Jost', sans-serif",
    }}>
      {/* Ornament */}
      <div style={{ color: 'var(--rose)', fontSize: '0.8rem', letterSpacing: 14, opacity: 0.4, marginBottom: 16 }}>✦ ✦ ✦</div>

      {/* Logo */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(2rem, 6vw, 2.8rem)',
        fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 6, textAlign: 'center'
      }}>
        OneView <em style={{ fontStyle: 'italic', color: 'var(--rose)', fontWeight: 300 }}>Bible Study</em>
      </h1>
      <p style={{ fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ink-lt)', marginBottom: 40 }}>
        Your Word · Your Study · Every Day
      </p>

      {/* Feature highlights */}
      <div style={{
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '28px 28px', maxWidth: 480, width: '100%',
        marginBottom: 24, boxShadow: '0 4px 24px rgba(196,135,154,0.08)'
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--ink)', marginBottom: 6, textAlign: 'center' }}>
          A beautiful space for your faith journey
        </div>
        <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--rose), var(--gold))', margin: '0 auto 20px' }}/>

        {[
          ['📖', 'Customizable reading plans', 'OT + NT, Psalms & Proverbs, Gospels and more'],
          ['✏️', 'Personal study notes', 'Capture what God is saying to YOU, not just what the Bible says'],
          ['🏷️', 'Tags & custom labels', 'Organize by Bible Study, Devotion, Sermon, Prayer, Gratitude'],
          ['🖍️', 'Rich text formatting', 'Bold, italic, underline and color highlighting for deeper study'],
          ['📎', 'Attachments', 'Add photos of handwritten notes, sermon bulletins, anything'],
          ['🔍', 'Powerful search', 'Find any note by title, scripture, tag or keyword instantly'],
          ['🔒', 'Private & secure', 'Your notes never leave your device — no accounts, no data collection'],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--ink-lt)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 6, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--rose)', marginBottom: 2 }}>$19.99</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--ink-lt)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>One-time purchase · Yours forever</div>
          <a href={GUMROAD_LINK} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', width: '100%', padding: '13px',
            background: 'var(--rose)', color: 'white', border: 'none', borderRadius: 4,
            fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic',
            cursor: 'pointer', textDecoration: 'none', textAlign: 'center', marginBottom: 8
          }}>
            ✦ Purchase on Gumroad
          </a>
          <div style={{ fontSize: '0.65rem', color: 'var(--ink-lt)' }}>
            After purchase you'll receive an unlock code by email
          </div>
        </div>
      </div>

      {/* Unlock code entry */}
      <div style={{
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '22px 24px', maxWidth: 480, width: '100%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-lt)', marginBottom: 12, textAlign: 'center' }}>
          Already purchased? Enter your code
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type={showCode ? 'text' : 'password'}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            placeholder="Enter unlock code"
            style={{
              flex: 1, padding: '10px 14px', border: `1px solid ${error ? '#C47A7A' : 'var(--border)'}`,
              borderRadius: 4, fontSize: '0.85rem', color: 'var(--ink)',
              background: 'var(--bg)', outline: 'none', fontFamily: "'Jost', sans-serif",
              letterSpacing: '0.1em',
            }}
          />
          <button onClick={handleUnlock} style={{
            background: 'var(--ink)', color: 'white', border: 'none',
            borderRadius: 4, padding: '10px 20px', fontSize: '0.78rem',
            cursor: 'pointer', fontFamily: "'Jost', sans-serif", letterSpacing: '0.08em',
            whiteSpace: 'nowrap'
          }}>Unlock</button>
        </div>
        {error && (
          <div style={{ fontSize: '0.72rem', color: '#C47A7A', marginTop: 8, textAlign: 'center' }}>{error}</div>
        )}
        <button onClick={() => setShowCode(!showCode)} style={{
          background: 'none', border: 'none', fontSize: '0.65rem', color: 'var(--ink-lt)',
          cursor: 'pointer', marginTop: 8, display: 'block', width: '100%', textAlign: 'center',
          fontFamily: "'Jost', sans-serif", letterSpacing: '0.06em'
        }}>
          {showCode ? 'Hide code' : 'Show code'}
        </button>
      </div>

      <div style={{ marginTop: 24, fontSize: '0.6rem', color: 'var(--ink-lt)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
        by OneView Studio · Simple Tools. Big Clarity.
      </div>
    </div>
  );
}
