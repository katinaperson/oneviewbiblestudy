import React from 'react';

const NAV_ITEMS = [
  { id:'plan',   label:'Reading Plan',  icon:'📖', desc:'Your daily reading' },
  { id:'notes',  label:'My Notes',      icon:'✏️',  desc:'Study & reflection' },
  { id:'search', label:'Search',        icon:'🔍', desc:'Find anything' },
];

export default function DesktopSidebar({ active, onChange }) {
  return (
    <div style={{
      width: 240, minWidth: 240,
      background: 'var(--white)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 22px 22px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ color:'var(--rose)', fontSize:'0.7rem', letterSpacing:10, opacity:0.4, marginBottom:10 }}>✦ ✦ ✦</div>
        <div style={{
          fontFamily:"'Cormorant Garamond', serif",
          fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.15, marginBottom: 6
        }}>
          OneView<br/>
          <em style={{ fontStyle:'italic', color:'var(--rose)', fontWeight:300 }}>Bible Study</em>
        </div>
        <div style={{
          fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--ink-lt)', marginBottom: 0
        }}>
          Your Word · Your Study · Every Day
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 6, border: 'none',
              background: active === item.id ? 'var(--rose-pale)' : 'transparent',
              borderLeft: `3px solid ${active === item.id ? 'var(--rose)' : 'transparent'}`,
              cursor: 'pointer', marginBottom: 3, transition: 'all 0.15s', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.05rem', width: 24, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{
                fontSize: '0.78rem', fontWeight: active === item.id ? 500 : 400,
                color: active === item.id ? 'var(--rose)' : 'var(--ink-md)',
                letterSpacing: '0.02em', marginBottom: 1,
                fontFamily: "'Jost', sans-serif",
              }}>{item.label}</div>
              <div style={{
                fontSize: '0.58rem', color: 'var(--ink-lt)',
                letterSpacing: '0.06em', fontFamily: "'Jost', sans-serif",
              }}>{item.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          width: 32, height: 1,
          background: 'linear-gradient(90deg, var(--rose), var(--gold))',
          marginBottom: 10
        }}/>
        <div style={{
          fontSize: '0.56rem', color: 'var(--ink-lt)',
          letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.6
        }}>
          Your notes stay<br/>on your device
        </div>
      </div>
    </div>
  );
}
