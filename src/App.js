import React, { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import ReadingPlan from './ReadingPlan';
import NotesList from './NotesList';
import NoteForm from './NoteForm';
import Search from './Search';
import { useStore } from './useStore';
import { midnight, dk } from './data';

export default function App() {
  const { store, saveNote, deleteNote, savePlan, setCheck, resetChecks, replaceAll } = useStore();
  const [activeTab, setActiveTab] = useState('plan');
  const [noteKey, setNoteKey] = useState(null); // null = list, string = form

  // Open a note by date key (from calendar, plan, or list)
  function openNote(key) {
    setNoteKey(key);
    setActiveTab('notes');
  }

  // Open note from plan with planReading pre-filled
  function openNoteFromPlan(dateStr, reading) {
    // Ensure planReading is stored if note doesn't exist yet
    if (!store.notes[dateStr]) {
      saveNote(dateStr, { planReading: reading, book:'', chapter:'', verse:'', text:'', tags:[], attachments:[] });
    }
    openNote(dateStr);
  }

  function openNewNote() {
    const key = dk(midnight(new Date()));
    openNote(key);
  }

  function handleSaveNote(key, noteData) {
    if (noteData) { saveNote(key, noteData); }
    else { deleteNote(key); }
    setNoteKey(null);
  }

  function handleDeleteNote(key) {
    deleteNote(key);
    setNoteKey(null);
  }

  // Export
  function handleExport() {
    const b = new Blob([JSON.stringify(store,null,2)],{type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(b);
    a.download=`oneview-bible-study-${new Date().toISOString().split('T')[0]}.json`; a.click();
  }

  // Import
  function handleImport(e) {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try { replaceAll(JSON.parse(ev.target.result)); }
      catch(err) { alert('Could not read file.'); }
    };
    r.readAsText(f); e.target.value='';
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:64}}>
      <Header onExport={handleExport} onImport={handleImport} />

      {/* PLAN TAB */}
      {activeTab==='plan' && (
        <ReadingPlan
          store={store}
          savePlan={savePlan}
          setCheck={setCheck}
          resetChecks={resetChecks}
          onOpenNote={openNoteFromPlan}
        />
      )}

      {/* NOTES TAB */}
      {activeTab==='notes' && (
        noteKey ? (
          <NoteForm
            noteKey={noteKey}
            note={store.notes[noteKey]}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onBack={()=>setNoteKey(null)}
          />
        ) : (
          <NotesList
            store={store}
            onOpenNote={openNote}
            onNewNote={openNewNote}
          />
        )
      )}

      {/* SEARCH TAB */}
      {activeTab==='search' && (
        <Search store={store} onOpenNote={openNote} />
      )}

      <BottomNav active={activeTab} onChange={tab=>{setActiveTab(tab);setNoteKey(null);}} />
    </div>
  );
}
