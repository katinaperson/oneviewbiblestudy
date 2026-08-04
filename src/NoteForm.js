import React, { useState, useEffect, useRef } from 'react';
import { BOOKS, TAGS, MONTHS, DAYS_FULL, buildRefLabel, fmtSz } from './data';

export default function NoteForm({ noteKey, note, onSave, onDelete, onBack, isDesktop }) {
  const [book, setBook] = useState(note?.book || '');
  const [chapter, setChapter] = useState(note?.chapter || '');
  const [verse, setVerse] = useState(note?.verse || '');
  const [text, setText] = useState(note?.text || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [attachments, setAttachments] = useState(note?.attachments || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileRef = useRef();

  const d = new Date(noteKey+'T12:00:00');
  const dateLabel = `${DAYS_FULL[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const chapCount = book ? (BOOKS.find(b=>b.name===book)?.chapters || 0) : 0;

  function toggleTag(id) {
    setTags(t => t.includes(id) ? t.filter(x=>x!==id) : [...t,id]);
  }

  function handleSave() {
    const hasContent = text.trim() || tags.length || book || attachments.length;
    onSave(noteKey, hasContent ? { book, chapter, verse, text, tags, attachments, planReading: note?.planReading } : null);
  }

  function handleAttach(e) {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => setAttachments(a => [...a, {name:f.name,size:fmtSz(f.size),type:f.type,data:ev.target.result}]);
      r.readAsDataURL(f);
    });
    e.target.value='';
  }

  return (
    <div style={{padding: isDesktop ? '28px 32px 40px' : '16px 16px 100px', maxWidth:700, margin:'0 auto'}}>
      {/* Back */}
      <button onClick={onBack} style={{
        background:'none',border:'1px solid var(--border)',borderRadius:4,
        padding:'6px 14px',fontSize:'0.68rem',color:'var(--ink-lt)',
        letterSpacing:'0.08em',marginBottom:14,cursor:'pointer'
      }}>← Back</button>

      <div style={{background:'var(--white)',borderRadius:6,padding:'24px 20px',border:'1px solid var(--border)'}}>
        {/* Date */}
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.6rem',fontWeight:400,color:'var(--ink)',marginBottom:2}}>{dateLabel}</div>
        <div style={{fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--ink-lt)',marginBottom:16}}>Personal Bible Study Note</div>
        <div style={{width:40,height:1,background:'linear-gradient(90deg,var(--rose),var(--gold))',marginBottom:20}}/>

        {/* Plan reading badge */}
        {note?.planReading && (
          <div style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background:'var(--gold-pale)',border:'1px solid var(--gold-lt)',
            borderRadius:4,padding:'6px 14px',fontSize:'0.7rem',
            color:'var(--gold)',letterSpacing:'0.08em',marginBottom:20
          }}>✦ {note.planReading}</div>
        )}

        {/* Scripture Reference */}
        <div style={{marginBottom:20}}>
          <div style={labelStyle}>Scripture Reference</div>
          {/* Stack vertically on mobile */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div>
              <div style={{...labelStyle,marginBottom:4}}>Book</div>
              <select value={book} onChange={e=>{setBook(e.target.value);setChapter('');}} style={selectStyle}>
                <option value="">Select a book…</option>
                <optgroup label="Old Testament">
                  {BOOKS.filter(b=>b.t==='OT').map(b=><option key={b.name} value={b.name}>{b.name}</option>)}
                </optgroup>
                <optgroup label="New Testament">
                  {BOOKS.filter(b=>b.t==='NT').map(b=><option key={b.name} value={b.name}>{b.name}</option>)}
                </optgroup>
              </select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:10}}>
              <div>
                <div style={{...labelStyle,marginBottom:4}}>Chapter</div>
                <select value={chapter} onChange={e=>setChapter(e.target.value)} style={selectStyle} disabled={!book}>
                  <option value="">Ch.</option>
                  {Array.from({length:chapCount},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div>
                <div style={{...labelStyle,marginBottom:4}}>Verse(s)</div>
                <input
                  value={verse} onChange={e=>setVerse(e.target.value)}
                  placeholder="e.g. 3–5 or 3, 7"
                  style={{...selectStyle,backgroundImage:'none',width:'100%'}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{marginBottom:20}}>
          <div style={labelStyle}>Tag this note</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {TAGS.map(t=>(
              <button key={t.id} onClick={()=>toggleTag(t.id)} style={{
                display:'flex',alignItems:'center',gap:5,padding:'6px 14px',
                borderRadius:20,border:`1px solid ${tags.includes(t.id)?t.color:'var(--border)'}`,
                background:tags.includes(t.id)?t.color:'var(--white)',
                color:tags.includes(t.id)?'white':'var(--ink-lt)',
                fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',
                cursor:'pointer',transition:'all 0.2s'
              }}>
                <div style={{width:5,height:5,borderRadius:'50%',background:tags.includes(t.id)?'rgba(255,255,255,0.7)':t.color,flexShrink:0}}/>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{marginBottom:20}}>
          <div style={labelStyle}>Notes & Reflection</div>
          <textarea
            value={text} onChange={e=>setText(e.target.value)}
            placeholder="Write freely — observations, questions, what God is speaking, how it applies to your life…"
            style={{
              width:'100%',minHeight:200,background:'var(--bg)',border:'1px solid var(--border)',
              borderRadius:4,padding:'14px 16px',fontSize:'0.86rem',fontWeight:300,
              color:'var(--ink)',lineHeight:1.85,resize:'vertical',outline:'none',
              transition:'border-color 0.2s',fontFamily:"'Jost',sans-serif"
            }}
          />
        </div>

        {/* Attachments */}
        <div style={{marginBottom:22}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={labelStyle}>Attachments</div>
            <button onClick={()=>fileRef.current.click()} style={{
              background:'none',border:'none',fontSize:'0.7rem',color:'var(--rose)',
              letterSpacing:'0.06em',textTransform:'uppercase',cursor:'pointer'
            }}>+ Attach</button>
            <input ref={fileRef} type="file" multiple style={{display:'none'}} onChange={handleAttach}/>
          </div>
          {attachments.length===0
            ? <div style={{fontSize:'0.76rem',color:'var(--ink-lt)',fontStyle:'italic'}}>No attachments yet.</div>
            : attachments.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',background:'var(--bg)',borderRadius:3,marginBottom:5,fontSize:'0.76rem'}}>
                <span>{['jpg','jpeg','png','gif','webp'].includes(a.name.split('.').pop().toLowerCase())?'🖼️':a.name.endsWith('.pdf')?'📄':'📎'}</span>
                <span style={{flex:1,color:'var(--ink-md)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</span>
                <span style={{color:'var(--ink-lt)',fontSize:'0.68rem'}}>{a.size}</span>
                <button onClick={()=>setAttachments(a=>a.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'var(--ink-lt)',cursor:'pointer',fontSize:'0.76rem'}}>✕</button>
              </div>
            ))
          }
        </div>

        {/* Save row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:18,borderTop:'1px solid var(--border-lt)'}}>
          {note ? (
            <button onClick={()=>setShowDeleteModal(true)} style={{background:'none',border:'none',fontSize:'0.7rem',color:'var(--ink-lt)',letterSpacing:'0.06em',cursor:'pointer'}}>
              Delete note
            </button>
          ) : <div/>}
          <div style={{display:'flex',gap:10}}>
            <button onClick={onBack} style={{
              background:'none',border:'1px solid var(--border)',borderRadius:3,
              padding:'9px 18px',fontSize:'0.73rem',color:'var(--ink-lt)',
              letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'
            }}>Cancel</button>
            <button onClick={handleSave} style={{
              background:'var(--rose)',color:'white',border:'none',borderRadius:3,
              padding:'9px 24px',fontSize:'0.73rem',letterSpacing:'0.12em',
              textTransform:'uppercase',cursor:'pointer'
            }}>Save Note</button>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(42,36,32,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:400,padding:20,backdropFilter:'blur(2px)'}}>
          <div style={{background:'var(--white)',borderRadius:6,padding:'28px 30px',maxWidth:360,width:'100%',boxShadow:'0 16px 48px rgba(0,0,0,0.12)'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',color:'var(--ink)',marginBottom:10}}>Delete this note?</div>
            <div style={{fontSize:'0.78rem',color:'var(--ink-lt)',lineHeight:1.65,fontStyle:'italic',marginBottom:20}}>This cannot be undone. Export your notes first if you want a backup.</div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowDeleteModal(false)} style={{background:'none',border:'1px solid var(--border)',borderRadius:3,padding:'8px 16px',fontSize:'0.72rem',color:'var(--ink-lt)',cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{onDelete(noteKey);setShowDeleteModal(false);}} style={{background:'#C47A7A',color:'white',border:'none',borderRadius:3,padding:'8px 16px',fontSize:'0.72rem',cursor:'pointer'}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display:'block',fontSize:'0.6rem',letterSpacing:'0.22em',
  textTransform:'uppercase',color:'var(--ink-lt)',marginBottom:7,fontWeight:400
};
const selectStyle = {
  width:'100%',padding:'9px 12px',border:'1px solid var(--border)',
  borderRadius:4,background:'var(--bg)',fontSize:'0.83rem',
  color:'var(--ink)',appearance:'none',cursor:'pointer',outline:'none',
  backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23A0928A'/%3E%3C/svg%3E\")",
  backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center'
};
