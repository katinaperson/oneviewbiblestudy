import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ovbs-v1';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { notes: {}, plan: null, checks: {} };
}

function saveToStorage(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}

// NOTE: This hook is structured so that `notes`, `plan`, and `checks`
// can be swapped to Supabase calls in a future sync upgrade with minimal refactoring.
export function useStore() {
  const [store, setStore] = useState(loadFromStorage);

  useEffect(() => { saveToStorage(store); }, [store]);

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

  return { store, saveNote, deleteNote, savePlan, setCheck, resetChecks, replaceAll };
}
