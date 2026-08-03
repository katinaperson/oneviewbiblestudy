import React, { useState } from 'react';
import { MONTHS, buildRefLabel } from './data';

export default function Search({ store, onOpenNote }) {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const results = q ? Object.entries(store.notes).filter(([k,n])=>
    (n.text||'').toLowerCase().includes(q) ||
    (n.book||'').toLowerCase().includes(q) ||
    (n.tags||[]).some(t=>t.includes(q)) ||
    (n.planReading||'').toLowerCase().includes(q)
  ).sort((a,b)=>b[0].localeCompare(a[0])) : [];

  function highlight(text) {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((p,i)=>
      p.toLowerCase()===q ? <mark key={i} style={{background:'rgba(196,135,154,0.18)',borderRadius:2,padding:'0 1px'}}>{p}</mark> : p
    );
  }

  return (
    <div style={{padding:'20px 16px 100px', maxWidth:700, margin:'0 auto'}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.55rem',fontWeight:400,color:'var(--ink)',marginBottom:16}}>
        Search <em style={{fontStyle:'italic',color:'var(--rose)'}}>Notes</em>
      </h2>
      <div style={{width:40,height:1,background:'linear-gradient(90deg,var(--rose),var(--gold))',marginBottom:20}}/>

      <input
        value={query} onChange={e=>setQuery(e.target.value)}
        placeholder="Search by reference, keyword, or tag…"
        autoFocus
        style={{
          width:'100%',padding:'11px 16px',border:'1px solid var(--border)',
          borderRadius:6,background:'var(--white)',fontSize:'0.87rem',
          color:'var(--ink)',outline:'none',marginBottom:22,
          fontFamily:"'Jost',sans-serif",transition:'border-color 0.2s'
        }}
      />

      {q && results.length===0 && (
        <div style={{fontSize:'0.8rem',color:'var(--ink-lt)',fontStyle:'italic'}}>No results found.</div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {results.map(([key,note])=>{
          const d = new Date(key+'T12:00:00');
          const ref = buildRefLabel(note.book,note.chapter,note.verse);
          const label = ref || `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
          const preview = (note.text||'').slice(0,200);
          return (
            <div key={key} onClick={()=>onOpenNote(key)} style={{
              background:'var(--white)',padding:'14px 18px',border:'1px solid var(--border)',
              borderRadius:6,cursor:'pointer',transition:'border-color 0.2s'
            }}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',color:'var(--rose)',marginBottom:4}}>{highlight(label)}</div>
              <div style={{fontSize:'0.78rem',color:'var(--ink-lt)',lineHeight:1.55,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                {highlight(preview)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
