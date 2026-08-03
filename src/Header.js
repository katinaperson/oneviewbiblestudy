import React from 'react';

export default function Header({ onExport, onImport }) {
  return (
    <header style={{
      background: 'var(--white)', textAlign: 'center',
      padding: '28px 16px 0', borderBottom: '1px solid var(--border)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}>
        <button onClick={onExport} style={hdrBtn}>Export</button>
        <label style={{...hdrBtn, cursor:'pointer'}}>
          Import
          <input type="file" accept=".json" onChange={onImport} style={{display:'none'}} />
        </label>
      </div>
      <div style={{ color:'var(--rose)', fontSize:'0.75rem', letterSpacing:14, opacity:0.45, marginBottom:8 }}>✦ ✦ ✦</div>
      <h1 style={{
        fontFamily:"'Cormorant Garamond', serif", fontWeight:400,
        fontSize:'clamp(1.7rem, 6vw, 2.5rem)', color:'var(--ink)', lineHeight:1.1, marginBottom:4
      }}>
        OneView <em style={{fontStyle:'italic', color:'var(--rose)', fontWeight:300}}>Bible Study</em>
      </h1>
      <p style={{
        fontSize:'0.6rem', letterSpacing:'0.28em', textTransform:'uppercase',
        color:'var(--ink-lt)', paddingBottom:20
      }}>Your Word · Your Study · Every Day</p>
    </header>
  );
}

const hdrBtn = {
  background:'none', border:'1px solid var(--border)', borderRadius:20,
  padding:'5px 12px', fontSize:'0.67rem', color:'var(--ink-lt)',
  letterSpacing:'0.06em', transition:'all 0.2s', display:'inline-block'
};
