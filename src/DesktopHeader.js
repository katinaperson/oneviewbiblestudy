import React from 'react';

export default function DesktopHeader({ onExport, onImport }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--ink-lt)', fontFamily: "'Jost', sans-serif"
      }}>
        by OneView Studio · Simple Tools. Big Clarity.
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onExport} style={hBtn}>Export</button>
        <label style={{ ...hBtn, cursor: 'pointer' }}>
          Import
          <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
}

const hBtn = {
  background: 'none', border: '1px solid var(--border)', borderRadius: 20,
  padding: '5px 14px', fontSize: '0.67rem', color: 'var(--ink-lt)',
  letterSpacing: '0.06em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
  fontFamily: "'Jost', sans-serif",
};
