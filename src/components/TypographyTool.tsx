import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TypoTarget {
  id: string;
  label: string;
  el: HTMLElement;
}

interface TypoValues {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  fontWeight: string;
}

const DEFAULT_TYPO: TypoValues = {
  fontSize: 14,
  letterSpacing: 0,
  lineHeight: 1.6,
  fontWeight: '300',
};

const WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

function readComputed(el: HTMLElement): TypoValues {
  const cs = window.getComputedStyle(el);
  const fs = parseFloat(cs.fontSize) || 14;
  const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) / fs;
  const lh = cs.lineHeight === 'normal' ? 1.5 : parseFloat(cs.lineHeight) / fs;
  return {
    fontSize: Math.round(fs * 10) / 10,
    letterSpacing: Math.round(ls * 10000) / 10000,
    lineHeight: Math.round(lh * 100) / 100,
    fontWeight: cs.fontWeight,
  };
}

function applyStyles(el: HTMLElement, v: TypoValues) {
  el.style.fontSize = `${v.fontSize}px`;
  el.style.letterSpacing = `${v.letterSpacing}em`;
  el.style.lineHeight = `${v.lineHeight}`;
  el.style.fontWeight = v.fontWeight;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  decimals: number;
  onChange: (v: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, value, min, max, step, unit, decimals, onChange }) => {
  const [inputVal, setInputVal] = useState(value.toFixed(decimals));

  useEffect(() => {
    setInputVal(value.toFixed(decimals));
  }, [value, decimals]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputVal(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A89060', fontFamily: 'monospace' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="text"
            value={inputVal}
            onChange={handleInput}
            style={{
              width: '52px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(214,181,133,0.25)',
              color: '#F4F5F8',
              fontSize: '11px',
              padding: '2px 4px',
              fontFamily: 'monospace',
              textAlign: 'right',
            }}
          />
          <span style={{ fontSize: '10px', color: '#888', fontFamily: 'monospace' }}>{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#D6B585', height: '2px', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
        <span style={{ fontSize: '9px', color: '#555', fontFamily: 'monospace' }}>{min}</span>
        <span style={{ fontSize: '9px', color: '#555', fontFamily: 'monospace' }}>{max}</span>
      </div>
    </div>
  );
};

export const TypographyTool: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [targets, setTargets] = useState<TypoTarget[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [typo, setTypo] = useState<TypoValues>(DEFAULT_TYPO);
  const [allValues, setAllValues] = useState<Record<string, TypoValues>>({});
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 120 });
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Keyboard shortcut Ctrl+Shift+T
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Discover data-typo-id elements on the page
  const refreshTargets = useCallback(() => {
    const els = Array.from(document.querySelectorAll('[data-typo-id]')) as HTMLElement[];
    const found: TypoTarget[] = els.map(el => ({
      id: el.getAttribute('data-typo-id')!,
      label: el.getAttribute('data-typo-label') || el.getAttribute('data-typo-id')!,
      el,
    }));
    setTargets(found);
    if (found.length > 0) {
      setSelectedId(prev => prev && found.find(f => f.id === prev) ? prev : found[0].id);
    }
  }, []);

  useEffect(() => {
    if (open) {
      refreshTargets();
    }
  }, [open, refreshTargets]);

  // When selection changes, read computed style (or restore saved)
  useEffect(() => {
    if (!selectedId || targets.length === 0) return;
    const t = targets.find(t => t.id === selectedId);
    if (!t) return;
    if (allValues[selectedId]) {
      setTypo(allValues[selectedId]);
    } else {
      setTypo(readComputed(t.el));
    }
  }, [selectedId, targets]); // eslint-disable-line

  // Apply live styles
  useEffect(() => {
    if (!selectedId || targets.length === 0) return;
    const t = targets.find(t => t.id === selectedId);
    if (!t) return;
    applyStyles(t.el, typo);
    setAllValues(prev => ({ ...prev, [selectedId]: typo }));
  }, [typo]); // eslint-disable-line

  const update = (key: keyof TypoValues, val: number | string) => {
    setTypo(prev => ({ ...prev, [key]: val }));
  };

  const generatePrompt = () => {
    const lines: string[] = [
      'Please lock down the following typography values in the codebase.\n',
      'For each element identified by its data-typo-id attribute, apply these exact styles using CSS `!important` via a shared class or inline style override:\n',
    ];
    Object.entries(allValues).forEach(([id, v]) => {
      const t = targets.find(t => t.id === id);
      lines.push(`• ${t?.label || id} [data-typo-id="${id}"]`);
      lines.push(`  font-size: ${v.fontSize}px`);
      lines.push(`  letter-spacing: ${v.letterSpacing >= 0 ? v.letterSpacing.toFixed(4) : v.letterSpacing.toFixed(4)}em`);
      lines.push(`  line-height: ${v.lineHeight}`);
      lines.push(`  font-weight: ${v.fontWeight}`);
      lines.push('');
    });
    lines.push('After applying, remove the data-typo-id attributes and replace with the locked CSS class. Then build and deploy.');
    return lines.join('\n');
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag support
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, initX: pos.x, initY: pos.y };
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(0, dragRef.current.initX + dx),
        y: Math.max(0, dragRef.current.initY + dy),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: `${pos.x}px`,
    top: `${pos.y}px`,
    zIndex: 99999,
    fontFamily: "'Sora', sans-serif",
  };

  const selectedTarget = targets.find(t => t.id === selectedId);

  // Collapsed: just a small trigger button
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Typography Tool (Ctrl+Shift+T)"
        style={{
          position: 'fixed',
          right: '18px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 99999,
          width: '34px',
          height: '34px',
          background: 'rgba(16,21,53,0.88)',
          border: '1px solid rgba(214,181,133,0.4)',
          color: '#D6B585',
          fontSize: '13px',
          fontWeight: '700',
          fontFamily: 'serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0',
          borderRadius: '2px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'opacity 0.2s',
          opacity: 0.5,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
      >
        Aa
      </button>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={{
        width: '300px',
        background: 'rgba(12,16,40,0.97)',
        border: '1px solid rgba(214,181,133,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        {/* Header / Drag Handle */}
        <div
          onMouseDown={onMouseDown}
          style={{
            background: 'rgba(214,181,133,0.08)',
            borderBottom: '1px solid rgba(214,181,133,0.15)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#D6B585', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Typography
            </span>
            <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              ⌃⇧T
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: '2px' }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '14px' }}>
          {/* Section Selector */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: '6px', fontFamily: 'monospace' }}>
              Target Element
            </div>
            {targets.length === 0 ? (
              <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic' }}>
                No elements with data-typo-id found on this page.
              </div>
            ) : (
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(214,181,133,0.2)',
                  color: '#F4F5F8',
                  fontSize: '11px',
                  padding: '6px 8px',
                  appearance: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {targets.map(t => (
                  <option key={t.id} value={t.id} style={{ background: '#0c1028' }}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedTarget && (
            <>
              {/* Font Size */}
              <SliderRow
                label="Font Size"
                value={typo.fontSize}
                min={7}
                max={72}
                step={0.5}
                unit="px"
                decimals={1}
                onChange={v => update('fontSize', v)}
              />

              {/* Letter Spacing */}
              <SliderRow
                label="Letter Spacing"
                value={typo.letterSpacing}
                min={-0.1}
                max={0.5}
                step={0.005}
                unit="em"
                decimals={4}
                onChange={v => update('letterSpacing', v)}
              />

              {/* Line Height */}
              <SliderRow
                label="Line Height"
                value={typo.lineHeight}
                min={0.8}
                max={3}
                step={0.05}
                unit=""
                decimals={2}
                onChange={v => update('lineHeight', v)}
              />

              {/* Font Weight */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A89060', marginBottom: '6px', fontFamily: 'monospace' }}>
                  Font Weight
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {WEIGHTS.map(w => (
                    <button
                      key={w}
                      onClick={() => update('fontWeight', w)}
                      style={{
                        padding: '3px 7px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        background: typo.fontWeight === w ? '#D6B585' : 'rgba(255,255,255,0.05)',
                        color: typo.fontWeight === w ? '#0c1028' : '#888',
                        border: `1px solid ${typo.fontWeight === w ? '#D6B585' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        fontWeight: w,
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Values Display */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '8px 10px',
                marginBottom: '14px',
                fontFamily: 'monospace',
              }}>
                <div style={{ fontSize: '9px', color: '#555', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current</div>
                <div style={{ fontSize: '10px', color: '#D6B585', lineHeight: 1.8 }}>
                  font-size: {typo.fontSize}px<br />
                  letter-spacing: {typo.letterSpacing >= 0 ? typo.letterSpacing.toFixed(4) : typo.letterSpacing.toFixed(4)}em<br />
                  line-height: {typo.lineHeight}<br />
                  font-weight: {typo.fontWeight}
                </div>
              </div>
            </>
          )}

          {/* Changed sections count */}
          {Object.keys(allValues).length > 0 && (
            <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>
              {Object.keys(allValues).length} section{Object.keys(allValues).length > 1 ? 's' : ''} modified
            </div>
          )}

          {/* Copy Prompt Button */}
          <button
            onClick={copyPrompt}
            disabled={Object.keys(allValues).length === 0}
            style={{
              width: '100%',
              padding: '9px',
              background: Object.keys(allValues).length === 0 ? 'rgba(214,181,133,0.1)' : copied ? 'rgba(72,200,120,0.15)' : 'rgba(214,181,133,0.12)',
              border: `1px solid ${copied ? 'rgba(72,200,120,0.4)' : 'rgba(214,181,133,0.3)'}`,
              color: copied ? '#48C878' : Object.keys(allValues).length === 0 ? '#444' : '#D6B585',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: Object.keys(allValues).length === 0 ? 'not-allowed' : 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied to Clipboard' : '⧉ Copy Fix Prompt'}
          </button>

          <div style={{ fontSize: '9px', color: '#3a3a4a', textAlign: 'center', marginTop: '8px', fontFamily: 'monospace' }}>
            Adjust values, then paste prompt into chat
          </div>
        </div>
      </div>
    </div>
  );
};
