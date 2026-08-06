import React, { useRef, useCallback, useEffect } from 'react';

const HIGHLIGHT_COLORS = [
  { color: '#FFF176', label: 'Key Verse', name: 'yellow' },
  { color: '#F48FB1', label: 'Conviction', name: 'rose' },
  { color: '#A5D6A7', label: 'Promise', name: 'green' },
  { color: '#90CAF9', label: 'Prayer', name: 'blue' },
  { color: '#CE93D8', label: 'Revelation', name: 'purple' },
];

const FONTS = [
  { label: 'Default', value: "'Jost', sans-serif" },
  { label: 'Serif', value: "'Cormorant Garamond', serif" },
  { label: 'Classic', value: "Georgia, serif" },
  { label: 'Modern', value: "'Arial', sans-serif" },
];

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const isComposing = useRef(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  // Use onMouseDown + preventDefault to preserve text selection
  function handleFormat(e, cmd, val = null) {
    e.preventDefault(); // keeps selection alive
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  }

  function handleHighlight(e, color) {
    e.preventDefault();
    editorRef.current.focus();
    document.execCommand('hiliteColor', false, color);
    onChange(editorRef.current.innerHTML);
  }

  function handleFont(e, fontFamily) {
    e.preventDefault();
    editorRef.current.focus();
    document.execCommand('fontName', false, fontFamily);
    onChange(editorRef.current.innerHTML);
  }

  const handleInput = useCallback(() => {
    if (!isComposing.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Backspace') {
      e.stopPropagation();
    }
  }, []);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2, padding: '8px 12px',
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap'
      }}>
        {/* Bold Italic Underline */}
        <div style={{ display: 'flex', gap: 2, marginRight: 8 }}>
          <ToolBtn onMouseDown={e => handleFormat(e, 'bold')} title="Bold"><strong>B</strong></ToolBtn>
          <ToolBtn onMouseDown={e => handleFormat(e, 'italic')} title="Italic"><em>I</em></ToolBtn>
          <ToolBtn onMouseDown={e => handleFormat(e, 'underline')} title="Underline"><u>U</u></ToolBtn>
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)', marginRight: 8 }}/>

        {/* Highlight colors */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginRight: 8 }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--ink-lt)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Highlight</span>
          {HIGHLIGHT_COLORS.map(h => (
            <button
              key={h.name}
              onMouseDown={e => handleHighlight(e, h.color)}
              title={h.label}
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: h.color, border: '1.5px solid var(--border)',
                cursor: 'pointer', flexShrink: 0
              }}
            />
          ))}
          <button
            onMouseDown={e => handleHighlight(e, 'transparent')}
            title="Remove highlight"
            style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'white', border: '1.5px solid var(--border)',
              cursor: 'pointer', fontSize: '0.6rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--ink-lt)'
            }}
          >✕</button>
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)', marginRight: 8 }}/>

        {/* Font selector */}
        <select
          onMouseDown={e => e.stopPropagation()}
          onChange={e => {
            editorRef.current.focus();
            document.execCommand('fontName', false, e.target.value);
            onChange(editorRef.current.innerHTML);
          }}
          defaultValue=""
          style={{
            fontSize: '0.7rem', padding: '3px 6px', border: '1px solid var(--border)',
            borderRadius: 4, background: 'var(--bg)', color: 'var(--ink)',
            cursor: 'pointer', outline: 'none', fontFamily: "'Jost', sans-serif"
          }}
        >
          <option value="" disabled>Font</option>
          {FONTS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Clear formatting */}
        <button
          onMouseDown={e => handleFormat(e, 'removeFormat')}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 4,
            padding: '3px 8px', fontSize: '0.62rem', color: 'var(--ink-lt)',
            cursor: 'pointer', marginLeft: 4, fontFamily: "'Jost', sans-serif"
          }}
        >Clear</button>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; onChange(editorRef.current.innerHTML); }}
        data-placeholder={placeholder}
        dir="ltr"
        style={{
          minHeight: 220, padding: '14px 16px',
          fontSize: '0.87rem', fontWeight: 300, color: 'var(--ink)',
          lineHeight: 1.85, outline: 'none', background: 'var(--bg)',
          fontFamily: "'Jost', sans-serif", direction: 'ltr',
          textAlign: 'left', wordBreak: 'break-word', overflowWrap: 'break-word',
        }}
      />

      {/* Color legend */}
      <div style={{
        padding: '8px 12px', borderTop: '1px solid var(--border)',
        background: 'var(--white)', display: 'flex', gap: 12, flexWrap: 'wrap'
      }}>
        {HIGHLIGHT_COLORS.map(h => (
          <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: h.color, border: '1px solid var(--border)' }}/>
            <span style={{ fontSize: '0.58rem', color: 'var(--ink-lt)', letterSpacing: '0.06em' }}>{h.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolBtn({ onMouseDown, children, title }) {
  return (
    <button
      onMouseDown={onMouseDown}
      title={title}
      style={{
        width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 4,
        background: 'var(--bg)', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem',
        color: 'var(--ink)', transition: 'all 0.15s', fontFamily: "'Jost', sans-serif"
      }}
    >{children}</button>
  );
}
