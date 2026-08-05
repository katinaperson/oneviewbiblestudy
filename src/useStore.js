import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ssbn-v1';
const UNLOCK_KEY = 'ssbn-unlocked';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { notes: {}, plan: null, checks: {} };
}

export function useStore() {
  const [store, setStore] = useState(loadFromStorage);
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem(UNLOCK_KEY) === 'true';
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch(e) {}
  }, [store]);

  const unlock = useCallback(() => {
    localStorage.setItem(UNLOCK_KEY, 'true');
    setUnlocked(true);
  }, []);

  const saveNote = useCallback((key, note) => {
    setStore(s => ({ ...s, notes: { ...s.notes, [key]: { ...note, updated: new Date().toISOString() } } }));
  }, []);

  const deleteNote = useCallback((key) => {
    setStore(s => { const notes = { ...s.notes }; delete notes[key]; return { ...s, notes }; });
  }, []);

  const savePlan = useCallback((plan) => {
    setStore(s => ({ ...s, plan }));
  }, []);

  const setCheck = useCallback((idx, val) => {
    setStore(s => ({ ...s, checks: { ...s.checks, [idx]: val } }));
  }, []);

  const resetChecks = useCallback(() => {
    setStore(s => ({ ...s, checks: {} }));
  }, []);

  const replaceAll = useCallback((newStore) => {
    setStore(newStore);
  }, []);

  return { store, unlocked, unlock, saveNote, deleteNote, savePlan, setCheck, resetChecks, replaceAll };
}
