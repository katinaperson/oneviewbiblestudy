import React from 'react';

const TABS = [
  { id: 'plan',   label: 'Plan',   icon: '📖' },
  { id: 'notes',  label: 'Notes',  icon: '✏️' },
  { id: 'search', label: 'Search', icon: '🔍' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--white)', borderTop: '1px solid var(--border)',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1, padding: '10px 4px 8px', border: 'none',
            background: 'none', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
            borderTop: `2px solid ${active === t.id ? 'var(--rose)' : 'transparent'}`,
            transition: 'border-color 0.2s',
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{t.icon}</span>
          <span style={{
            fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: active === t.id ? 'var(--rose)' : 'var(--ink-lt)',
            fontWeight: active === t.id ? 500 : 300, transition: 'color 0.2s'
          }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
