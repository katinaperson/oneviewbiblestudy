import React, { useState } from 'react';
import { TAGS, MONTHS, DAYS_FULL, DAYS_SHORT2, buildRefLabel, midnight, dk } from './data';

export default function NotesList({ store, onOpenNote, onNewNote }) {
  const [filterTag, setFilterTag] = useState(null);
  const [calY, setCalY] = useState(new Date().getFullYear());
  const [calM, setCalM] = useState(new Date().getMonth());

  const today = midnight(new Date());
  const todayKey = dk(today);

  let entries = Object.entries(store.notes).sort((a,b)=>b[0].localeCompare(a[0]));
  if (filterTag) entries = entries.filter(([k,n])=>n.tags&&n.tags.includes(filterTag));

  // Calendar
  const first = new Date(calY,calM,1).getDay();
  const dcount = new Date(calY,calM+1,0).getDate();
  const calDays = [];
  for(let i=0;i<first;i++) calDays.push(null);
  for(let d=1;d<=dcount;d++) calDays.push(d);

  return (
    <div style={{padding:'20px 16px 100px', maxWidth:700, margin:'0 auto'}}>
      {/* Title row */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:16}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.55rem',fontWeight:400,color:'var(--ink)'}}>
          {filterTag ? <><em style={{fontStyle:'italic',color:'var(--rose)'}}>{TAGS.find(t=>t.id===filterTag)?.name}</em> Notes</> : <>All <em style={{fontStyle:'italic',color:'var(--rose)'}}>Notes</em></>}
        </h2>
        <button onClick={onNewNote} style={{background:'none',border:'none',fontSize:'0.7rem',color:'var(--rose)',letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer'}}>+ New Note</button>
      </div>
      <div style={{width:40,height:1,background:'linear-gradient(90deg,var(--rose),var(--gold))',marginBottom:20}}/>

      {/* Mini calendar */}
      <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:6,padding:'16px 16px 14px',marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <button onClick={()=>{let m=calM-1,y=calY;if(m<0){m=11;y--;}setCalM(m);setCalY(y);}} style={{background:'none',border:'none',color:'var(--ink-lt)',fontSize:'1rem',cursor:'pointer',padding:'2px 6px'}}>‹</button>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',fontWeight:500}}>{MONTHS[calM]} {calY}</span>
          <button onClick={()=>{let m=calM+1,y=calY;if(m>11){m=0;y++;}setCalM(m);setCalY(y);}} style={{background:'none',border:'none',color:'var(--ink-lt)',fontSize:'1rem',cursor:'pointer',padding:'2px 6px'}}>›</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
          {DAYS_SHORT2.map(d=><div key={d} style={{fontSize:'0.56rem',textAlign:'center',color:'var(--ink-lt)',padding:'3px 0',letterSpacing:'0.04em',textTransform:'uppercase'}}>{d}</div>)}
          {calDays.map((d,i)=>{
            if(!d) return <div key={i}/>;
            const dt = new Date(calY,calM,d); dt.setHours(0,0,0,0);
            const key = dk(dt);
            const isToday = dt.getTime()===today.getTime();
            const hasNote = !!store.notes[key];
            return (
              <button key={i} onClick={()=>onOpenNote(key)} style={{
                fontSize:'0.68rem',textAlign:'center',borderRadius:'50%',
                color:isToday?'var(--rose)':'var(--ink-md)',border:'none',
                background:'transparent',width:28,height:28,
                display:'flex',alignItems:'center',justifyContent:'center',
                margin:'auto',cursor:'pointer',fontWeight:isToday?500:300,
                position:'relative'
              }}>
                {d}
                {hasNote && <span style={{position:'absolute',bottom:2,left:'50%',transform:'translateX(-50%)',width:3,height:3,borderRadius:'50%',background:'var(--gold)'}}/>}
              </button>
            );
          })}
        </div>
        <button onClick={()=>{setCalY(new Date().getFullYear());setCalM(new Date().getMonth());onOpenNote(todayKey);}} style={{
          display:'block',width:'100%',marginTop:12,padding:'7px',
          background:'none',border:'1px solid var(--border)',borderRadius:4,
          fontSize:'0.68rem',color:'var(--ink-lt)',letterSpacing:'0.1em',
          textTransform:'uppercase',cursor:'pointer'
        }}>Today</button>
      </div>

      {/* Tag filter pills */}
      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18}}>
        <button onClick={()=>setFilterTag(null)} style={{
          padding:'5px 12px',borderRadius:20,border:'1px solid var(--border)',
          background:!filterTag?'var(--rose)':'var(--white)',
          color:!filterTag?'white':'var(--ink-lt)',
          fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'
        }}>All</button>
        {TAGS.filter(t=>Object.values(store.notes).some(n=>n.tags?.includes(t.id))).map(t=>(
          <button key={t.id} onClick={()=>setFilterTag(filterTag===t.id?null:t.id)} style={{
            padding:'5px 12px',borderRadius:20,
            border:`1px solid ${filterTag===t.id?t.color:'var(--border)'}`,
            background:filterTag===t.id?t.color:'var(--white)',
            color:filterTag===t.id?'white':'var(--ink-lt)',
            fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'
          }}>{t.name}</button>
        ))}
      </div>

      {/* Notes list */}
      {entries.length===0 ? (
        <div style={{textAlign:'center',padding:'50px 0'}}>
          <div style={{fontSize:'1.6rem',opacity:0.2,marginBottom:14}}>✦</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',color:'var(--ink-md)',marginBottom:8}}>
            {filterTag ? 'No notes with this tag yet' : 'Your study space is ready'}
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--ink-lt)',fontStyle:'italic',marginBottom:20}}>
            {filterTag ? 'Write a note and tag it to see it here.' : 'Write your first note to begin.'}
          </div>
          <button onClick={onNewNote} style={{background:'var(--rose)',color:'white',border:'none',borderRadius:4,padding:'10px 24px',fontSize:'0.76rem',letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer'}}>
            Write First Note
          </button>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {entries.map(([key,note])=>{
            const d = new Date(key+'T12:00:00');
            const dateLabel = `${DAYS_FULL[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
            const ref = buildRefLabel(note.book, note.chapter, note.verse);
            return (
              <div key={key} onClick={()=>onOpenNote(key)} style={{
                background:'var(--white)',border:'1px solid var(--border)',
                borderRadius:6,padding:'16px 18px',cursor:'pointer',transition:'border-color 0.2s'
              }}>
                {note.planReading && (
                  <div style={{fontSize:'0.6rem',color:'var(--gold)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:4}}>✦ {note.planReading}</div>
                )}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:10,marginBottom:5}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontWeight:500,color:'var(--ink)'}}>
                    {ref || dateLabel}
                  </div>
                  {ref && <div style={{fontSize:'0.65rem',color:'var(--ink-lt)',whiteSpace:'nowrap',flexShrink:0}}>{MONTHS[d.getMonth()].slice(0,3)} {d.getDate()}</div>}
                </div>
                {note.tags?.length>0 && (
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:6}}>
                    {note.tags.map(id=>{
                      const t=TAGS.find(x=>x.id===id);
                      return t?<span key={id} style={{fontSize:'0.58rem',letterSpacing:'0.12em',textTransform:'uppercase',padding:'2px 8px',borderRadius:20,border:`1px solid ${t.color}`,color:t.color}}>{t.name}</span>:null;
                    })}
                  </div>
                )}
                <div style={{fontSize:'0.79rem',color:'var(--ink-lt)',lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',fontStyle:'italic'}}>
                  {note.text || 'No text written yet.'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
