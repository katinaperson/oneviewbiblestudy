import React, { useState, useEffect } from 'react';
import { BOOKS, STYLE_BOOKS, STYLE_NAMES, MONTHS, DAYS_SHORT3, OT, NT, dk } from './data';

export default function ReadingPlan({ store, savePlan, setCheck, resetChecks, onOpenNote }) {
  const [style, setStyle] = useState(store.plan?.style || 'psalms-proverbs');
  const [chaptersPerDay, setChaptersPerDay] = useState(store.plan?.chaptersPerDay || 2);
  const [startDate, setStartDate] = useState(store.plan?.startDate || new Date().toISOString().split('T')[0]);
  const [startBook, setStartBook] = useState(store.plan?.startBook || 'Genesis');
  const [readingList, setReadingList] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (store.plan) { restorePlan(); }
  }, []);

  function buildReadingList(s, cpd, sd, sb) {
    let list = [];
    if (s === 'balanced') {
      let otIdx=0,otCh=1,ntIdx=0,ntCh=1;
      const days = Math.min(Math.ceil((OT.reduce((a,b)=>a+b.chapters,0)+NT.reduce((a,b)=>a+b.chapters,0))/2),365);
      for(let i=0;i<days;i++){
        const ob=OT[otIdx],nb=NT[ntIdx]; if(!ob||!nb) break;
        list.push(`${ob.name} ${otCh} + ${nb.name} ${ntCh}`);
        otCh++; if(otCh>ob.chapters){otIdx++;otCh=1;}
        ntCh++; if(ntCh>nb.chapters){ntIdx++;ntCh=1;}
      }
    } else {
      let bookList;
      if(s==='book'){const idx=BOOKS.findIndex(b=>b.name===sb);bookList=BOOKS.slice(idx);}
      else if(s==='chronological'){bookList=STYLE_BOOKS.chronological.map(n=>BOOKS.find(b=>b.name===n)).filter(Boolean);}
      else{bookList=STYLE_BOOKS[s].map(n=>BOOKS.find(b=>b.name===n)).filter(Boolean);}
      let queue=[];
      bookList.forEach(book=>{for(let ch=1;ch<=book.chapters;ch++) queue.push(`${book.name} ${ch}`);});
      for(let i=0;i<queue.length;i+=cpd) list.push(queue.slice(i,i+cpd).join(' + '));
    }
    return list.slice(0,180);
  }

  function handleGenerate() {
    const list = buildReadingList(style, chaptersPerDay, startDate, startBook);
    setReadingList(list);
    setGenerated(true);
    savePlan({ style, chaptersPerDay, startDate, startBook });
  }

  function restorePlan() {
    const p = store.plan;
    setStyle(p.style); setChaptersPerDay(p.chaptersPerDay);
    setStartDate(p.startDate); setStartBook(p.startBook);
    const list = buildReadingList(p.style, p.chaptersPerDay, p.startDate, p.startBook);
    setReadingList(list); setGenerated(true);
  }

  function handleCheck(i) {
    setCheck(i, !store.checks[i]);
    setSavedFlash(true);
    setTimeout(()=>setSavedFlash(false), 1800);
  }

  function handleReset() {
    if(!window.confirm('Reset all checkboxes?')) return;
    resetChecks();
  }

  const done = Object.values(store.checks).filter(Boolean).length;
  const total = readingList.length;
  const pct = total > 0 ? Math.round((done/total)*100) : 0;

  // Group into weeks
  const weeks = [];
  for(let i=0;i<readingList.length;i+=7) weeks.push(readingList.slice(i,i+7).map((r,j)=>({reading:r,idx:i+j})));

  return (
    <div style={{padding:'24px 16px 100px', maxWidth:700, margin:'0 auto'}}>
      {/* Verse strip */}
      <div style={{
        background:'linear-gradient(135deg, var(--rose-pale), var(--gold-pale))',
        border:'1px solid var(--border)', borderRadius:6,
        padding:'20px 22px', textAlign:'center', marginBottom:22
      }}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'1rem',color:'var(--ink-md)',lineHeight:1.7,marginBottom:6}}>
          "Your word is a lamp to my feet and a light to my path."
        </p>
        <cite style={{fontSize:'0.72rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',fontStyle:'normal'}}>
          Psalm 119:105
        </cite>
      </div>

      {/* Setup card */}
      <div style={{background:'var(--white)',borderRadius:6,padding:22,marginBottom:20,border:'1px solid var(--border)'}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',color:'var(--ink)',marginBottom:18,display:'flex',alignItems:'center',gap:10}}>
          Build Your Reading Plan
          <div style={{flex:1,height:1,background:'var(--border)'}}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
          <div>
            <label style={labelStyle}>Reading Style</label>
            <select value={style} onChange={e=>setStyle(e.target.value)} style={selectStyle}>
              <option value="book">Book-at-a-Time</option>
              <option value="balanced">OT + NT Daily</option>
              <option value="chronological">Chronological</option>
              <option value="psalms-proverbs">Psalms + Proverbs</option>
              <option value="gospels">Gospels Focus</option>
              <option value="epistles">Epistles</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Chapters / Day</label>
            <select value={chaptersPerDay} onChange={e=>setChaptersPerDay(Number(e.target.value))} style={selectStyle}>
              <option value={1}>1 chapter</option>
              <option value={2}>2 chapters</option>
              <option value={3}>3 chapters</option>
              <option value={4}>4 chapters</option>
            </select>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{...selectStyle,backgroundImage:'none'}}/>
          </div>
          <div>
            <label style={labelStyle}>Starting Book</label>
            <select value={startBook} onChange={e=>setStartBook(e.target.value)} style={selectStyle}>
              {BOOKS.map(b=><option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} style={{
          width:'100%', padding:'13px', background:'var(--rose)', color:'white',
          border:'none', borderRadius:4, fontFamily:"'Cormorant Garamond',serif",
          fontSize:'1.05rem', fontStyle:'italic', letterSpacing:'0.5px', cursor:'pointer'
        }}>✦ Generate My Reading Plan</button>
      </div>

      {/* Plan output */}
      {generated && (
        <>
          {/* Plan header */}
          <div style={{
            background:'linear-gradient(135deg,var(--rose-pale),var(--gold-pale))',
            borderRadius:'6px 6px 0 0', padding:'18px 20px',
            border:'1px solid var(--border)', borderBottom:'none'
          }}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.35rem',color:'var(--ink)',marginBottom:2}}>
              {STYLE_NAMES[style]} Plan
            </div>
            <div style={{fontSize:'0.77rem',color:'var(--ink-lt)',letterSpacing:'0.06em'}}>
              Starting {new Date(startDate+'T00:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} · {readingList.length} days
            </div>
          </div>

          {/* Progress */}
          <div style={{
            background:'var(--white)',border:'1px solid var(--border)',borderTop:'none',
            padding:'12px 18px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'
          }}>
            <div style={{flex:1,height:5,background:'var(--border)',borderRadius:3,overflow:'hidden',minWidth:60}}>
              <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--rose),var(--gold))',borderRadius:3,transition:'width 0.4s'}}/>
            </div>
            <span style={{fontSize:'0.75rem',color:'var(--ink-lt)',whiteSpace:'nowrap'}}>{done} / {total} complete</span>
            {savedFlash && <span style={{fontSize:'0.7rem',color:'var(--rose)',letterSpacing:'0.06em'}}>✦ Saved</span>}
            <button onClick={handleReset} style={{
              fontSize:'0.68rem',color:'var(--ink-lt)',background:'none',
              border:'1px solid var(--border)',borderRadius:3,padding:'3px 9px',cursor:'pointer'
            }}>Reset</button>
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{background:'var(--white)',border:'1px solid var(--border)',borderTop:'none',overflow:'hidden',borderRadius: wi===weeks.length-1?'0 0 6px 6px':0}}>
              <div style={{background:'var(--bg2)',padding:'8px 18px',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.18em',color:'var(--ink-lt)',borderBottom:'1px solid var(--border)'}}>
                Week {wi+1}
              </div>
              {week.map(({reading, idx}) => {
                const d = new Date(startDate+'T00:00:00'); d.setDate(d.getDate()+idx);
                const dateStr = dk(d);
                const hasNote = !!store.notes[dateStr];
                return (
                  <div key={idx} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'11px 18px',borderBottom:'1px solid var(--border-lt)',background:'var(--white)'}}>
                    {/* Checkbox */}
                    <button onClick={()=>handleCheck(idx)} style={{
                      flexShrink:0,width:20,height:20,borderRadius:'50%',
                      border:`1.5px solid ${store.checks[idx]?'var(--rose)':'var(--rose)'}`,
                      background:store.checks[idx]?'var(--rose)':'transparent',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      marginTop:2,cursor:'pointer',transition:'all 0.2s'
                    }}>
                      {store.checks[idx] && <span style={{color:'white',fontSize:10,lineHeight:1}}>✓</span>}
                    </button>
                    {/* Info */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'0.65rem',color:'var(--ink-lt)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>
                        {DAYS_SHORT3[d.getDay()]} · {MONTHS[d.getMonth()]} {d.getDate()}
                      </div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',color:'var(--ink)',fontWeight:500,lineHeight:1.35}}>
                        {reading}
                      </div>
                    </div>
                    {/* Note button */}
                    <button onClick={()=>onOpenNote(dateStr, reading)} style={{
                      flexShrink:0,background:'none',
                      border:`1px solid ${hasNote?'var(--gold)':'var(--border)'}`,
                      borderRadius:4,padding:'4px 10px',
                      fontSize:'0.62rem',color:hasNote?'var(--gold)':'var(--ink-lt)',
                      letterSpacing:'0.06em',textTransform:'uppercase',
                      cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s'
                    }}>
                      {hasNote ? '📝 Note' : '+ Note'}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Tips */}
          <div style={{marginTop:22,background:'var(--white)',border:'1px solid var(--border)',borderRadius:6,padding:'20px 22px'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',color:'var(--ink)',marginBottom:12}}>Study Tips</div>
            {[
              ['Pray before you open.','Even 30 seconds of asking God to speak changes the experience completely.'],
              ['Write one thing.','Tap the note button on any day to capture what God is saying.'],
              ["Don't guilt-skip.",'If you miss a day, just pick up where you left off. The goal is a lifestyle, not a streak.'],
              ['Pair translations.','Read the same passage in two versions — the differences illuminate meaning beautifully.'],
            ].map(([strong,text],i)=>(
              <div key={i} style={{display:'flex',gap:8,marginBottom:9,fontSize:'0.82rem',color:'var(--ink-lt)',lineHeight:1.6}}>
                <span style={{color:'var(--rose)',flexShrink:0}}>✦</span>
                <span><strong style={{color:'var(--ink-md)'}}>{strong}</strong> {text}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const labelStyle = {
  display:'block',fontSize:'0.58rem',letterSpacing:'0.2em',
  textTransform:'uppercase',color:'var(--ink-lt)',marginBottom:5,fontWeight:400
};
const selectStyle = {
  width:'100%',padding:'9px 12px',border:'1px solid var(--border)',
  borderRadius:4,background:'var(--bg)',fontSize:'0.82rem',
  color:'var(--ink)',appearance:'none',cursor:'pointer',
  backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23A0928A'/%3E%3C/svg%3E\")",
  backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center',
  outline:'none'
};
