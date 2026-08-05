import React, { useState, useEffect } from 'react';
import Header from './Header';
import DesktopHeader from './DesktopHeader';
import DesktopSidebar from './DesktopSidebar';
import BottomNav from './BottomNav';
import ReadingPlan from './ReadingPlan';
import NotesList from './NotesList';
import NoteForm from './NoteForm';
import Search from './Search';
import Paywall from './Paywall';
import { useStore } from './useStore';
import { midnight, dk } from './data';

const DESKTOP_BREAKPOINT = 768;

export default function App() {
  const { store, unlocked, unlock, saveNote, deleteNote, savePlan, setCheck, resetChecks, replaceAll } = useStore();
  const [activeTab, setActiveTab] = useState('plan');
  const [noteKey, setNoteKey] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Show paywall if not unlocked
  if (!unlocked) {
    return <Paywall onUnlock={unlock} />;
  }

  function openNote(key) {
    setNoteKey(key);
    setActiveTab('notes');
  }

  function openNoteFromPlan(dateStr, reading) {
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

  function handleExport() {
    const b = new Blob([JSON.stringify(store,null,2)],{type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(b);
    a.download=`oneview-bible-study-${new Date().toISOString().split('T')[0]}.json`; a.click();
  }

  function handleImport(e) {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try { replaceAll(JSON.parse(ev.target.result)); }
      catch(err) { alert('Could not read file.'); }
    };
    r.readAsText(f); e.target.value='';
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setNoteKey(null);
  }

  const notesContent = noteKey ? (
    <NoteForm
      noteKey={noteKey}
      note={store.notes[noteKey]}
      onSave={handleSaveNote}
      onDelete={handleDeleteNote}
      onBack={() => setNoteKey(null)}
      isDesktop={isDesktop}
    />
  ) : (
    <NotesList
      store={store}
      onOpenNote={openNote}
      onNewNote={openNewNote}
      isDesktop={isDesktop}
    />
  );

  if (isDesktop) {
    return (
      <div style={{
        display: 'flex', height: '100vh', overflow: 'hidden',
        background: 'var(--bg)', fontFamily: "'Jost', sans-serif"
      }}>
        <DesktopSidebar active={activeTab} onChange={handleTabChange} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DesktopHeader onExport={handleExport} onImport={handleImport} />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'plan' && (
              <ReadingPlan store={store} savePlan={savePlan} setCheck={setCheck}
                resetChecks={resetChecks} onOpenNote={openNoteFromPlan} isDesktop={isDesktop}/>
            )}
            {activeTab === 'notes' && notesContent}
            {activeTab === 'search' && (
              <Search store={store} onOpenNote={openNote} isDesktop={isDesktop}/>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:64 }}>
      <Header onExport={handleExport} onImport={handleImport} />
      {activeTab === 'plan' && (
        <ReadingPlan store={store} savePlan={savePlan} setCheck={setCheck}
          resetChecks={resetChecks} onOpenNote={openNoteFromPlan} isDesktop={false}/>
      )}
      {activeTab === 'notes' && notesContent}
      {activeTab === 'search' && (
        <Search store={store} onOpenNote={openNote} isDesktop={false}/>
      )}
      <BottomNav active={activeTab} onChange={handleTabChange} />
    </div>
  );
}
