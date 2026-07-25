import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TypoValues {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  fontWeight: string;
  color: string;
  textTransform: string;
}

interface TargetItem {
  id: string;
  label: string;
  tagName: string;
  textPreview: string;
  el: HTMLElement;
}

const DEFAULT_TYPO: TypoValues = {
  fontSize: 14,
  letterSpacing: 0,
  lineHeight: 1.5,
  fontWeight: '400',
  color: '#101535',
  textTransform: 'none',
};

const WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
const TRANSFORMS = ['none', 'uppercase', 'lowercase', 'capitalize'];

function rgbToHex(rgb: string): string {
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const hex = (x: string) => ('0' + parseInt(x, 10).toString(16)).slice(-2);
  return '#' + hex(match[1]) + hex(match[2]) + hex(match[3]);
}

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
    color: rgbToHex(cs.color),
    textTransform: cs.textTransform || 'none',
  };
}

function applyStyles(el: HTMLElement, v: TypoValues) {
  el.style.fontSize = `${v.fontSize}px`;
  el.style.letterSpacing = `${v.letterSpacing}em`;
  el.style.lineHeight = `${v.lineHeight}`;
  el.style.fontWeight = v.fontWeight;
  if (v.color) el.style.color = v.color;
  if (v.textTransform) el.style.textTransform = v.textTransform;
}

// Detect human-readable section name for any element on the page
function detectSectionName(el: HTMLElement): string {
  // Check closest section/header/footer/nav
  const container = el.closest('section, header, footer, nav, [id]');
  if (!container) return 'General';

  const containerId = container.id;
  if (containerId) {
    return containerId
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) + ' Section';
  }

  const containerHeading = container.querySelector('h1, h2, h3');
  if (containerHeading && containerHeading !== el) {
    const headingText = (containerHeading.textContent || '').trim().replace(/\s+/g, ' ');
    if (headingText && headingText.length < 30) {
      return headingText.toUpperCase();
    }
  }

  if (container.tagName === 'HEADER' || container.className.includes('nav')) return 'Navbar Header';
  if (container.tagName === 'FOOTER') return 'Footer';
  if (container.className.includes('hero')) return 'Hero Section';

  return 'Section';
}

// Generate a CSS selector or ID for an element with a clean section label
function getUniqueSelector(el: HTMLElement, index: number): { id: string; label: string } {
  let typoId = el.getAttribute('data-typo-id');
  const customLabel = el.getAttribute('data-typo-label');

  if (customLabel) {
    return { id: typoId || `custom-${index}`, label: customLabel };
  }

  const tag = el.tagName.toLowerCase();
  const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
  const shortText = text.length > 25 ? text.substring(0, 25) + '...' : text;
  
  if (!typoId) {
    typoId = `auto-${tag}-${index}`;
    el.setAttribute('data-typo-id', typoId);
  }

  const sectionName = detectSectionName(el);
  const tagUpper = tag.toUpperCase();
  const label = `[${sectionName}] ${tagUpper}: "${shortText || tag}"`;

  return { id: typoId, label };
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
              width: '56px',
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
  const [pickerActive, setPickerActive] = useState(false);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [typo, setTypo] = useState<TypoValues>(DEFAULT_TYPO);
  const [allValues, setAllValues] = useState<Record<string, TypoValues>>({});
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 80 });
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  
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

  // Scan ALL text elements on the page
  const scanPageElements = useCallback(() => {
    const selector = 'h1, h2, h3, h4, h5, h6, p, button, a, span[class*="text"], [data-typo-id]';
    const rawEls = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    
    // Filter out elements inside typography tool panel
    const validEls = rawEls.filter(el => {
      if (el.closest('#typo-inspector-panel')) return false;
      const txt = (el.innerText || el.textContent || '').trim();
      return txt.length > 0;
    });

    const items: TargetItem[] = validEls.map((el, index) => {
      const { id, label } = getUniqueSelector(el, index);
      const text = (el.innerText || el.textContent || '').trim();
      return {
        id,
        label,
        tagName: el.tagName.toLowerCase(),
        textPreview: text.length > 30 ? text.substring(0, 30) + '...' : text,
        el,
      };
    });

    setTargets(items);
    if (items.length > 0 && !selectedId) {
      setSelectedId(items[0].id);
    }
  }, [selectedId]);

  useEffect(() => {
    if (open) {
      scanPageElements();
    }
  }, [open, scanPageElements]);

  // Click-to-Pick Element Mode
  useEffect(() => {
    if (!pickerActive) {
      if (hoveredEl) {
        hoveredEl.style.outline = '';
        setHoveredEl(null);
      }
      return;
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest('#typo-inspector-panel')) return;
      if (hoveredEl && hoveredEl !== target) {
        hoveredEl.style.outline = '';
      }
      target.style.outline = '2px solid #D6B585';
      target.style.outlineOffset = '2px';
      setHoveredEl(target);
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest('#typo-inspector-panel')) return;
      e.preventDefault();
      e.stopPropagation();

      target.style.outline = '';
      setHoveredEl(null);
      setPickerActive(false);

      // Check if target is already in list or add it
      const existing = targets.find(t => t.el === target);
      if (existing) {
        setSelectedId(existing.id);
      } else {
        const { id, label } = getUniqueSelector(target, targets.length);
        const newItem: TargetItem = {
          id,
          label,
          tagName: target.tagName.toLowerCase(),
          textPreview: (target.innerText || target.textContent || '').substring(0, 30),
          el: target,
        };
        setTargets(prev => [newItem, ...prev]);
        setSelectedId(id);
      }
    };

    window.addEventListener('mouseover', onMouseOver, true);
    window.addEventListener('click', onClick, true);

    return () => {
      window.removeEventListener('mouseover', onMouseOver, true);
      window.removeEventListener('click', onClick, true);
      if (hoveredEl) hoveredEl.style.outline = '';
    };
  }, [pickerActive, hoveredEl, targets]);

  // When selection changes, read computed style (or restore saved)
  useEffect(() => {
    if (!selectedId || targets.length === 0) return;
    const t = targets.find(t => t.id === selectedId);
    if (!t || !t.el) return;
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
    if (!t || !t.el) return;
    applyStyles(t.el, typo);
    setAllValues(prev => ({ ...prev, [selectedId]: typo }));
  }, [typo]); // eslint-disable-line

  const update = (key: keyof TypoValues, val: number | string) => {
    setTypo(prev => ({ ...prev, [key]: val }));
  };

  const generatePrompt = () => {
    const lines: string[] = [
      'Please lock down the following typography styles across the codebase:\n',
    ];
    Object.entries(allValues).forEach(([id, v]) => {
      const t = targets.find(t => t.id === id);
      const textPreview = t?.textPreview ? ` ("${t.textPreview}")` : '';
      const selectorOrId = id.startsWith('auto-') ? `<${t?.tagName || 'element'}> contain text "${t?.textPreview}"` : `[data-typo-id="${id}"]`;
      lines.push(`• Target: ${t?.label || id}${textPreview}`);
      lines.push(`  Selector/ID: ${selectorOrId}`);
      lines.push(`  font-size: ${v.fontSize}px !important;`);
      lines.push(`  letter-spacing: ${v.letterSpacing}em !important;`);
      lines.push(`  line-height: ${v.lineHeight} !important;`);
      lines.push(`  font-weight: ${v.fontWeight} !important;`);
      if (v.color) lines.push(`  color: ${v.color} !important;`);
      if (v.textTransform) lines.push(`  text-transform: ${v.textTransform} !important;`);
      lines.push('');
    });
    lines.push('Apply these styles using clean CSS classes or Tailwind overrides and deploy.');
    return lines.join('\n');
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag support
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'SELECT') return;
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
    zIndex: 999999,
    fontFamily: "'Sora', sans-serif",
  };

  const selectedTarget = targets.find(t => t.id === selectedId);

  // Collapsed Trigger Button
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
          zIndex: 999999,
          width: '36px',
          height: '36px',
          background: 'rgba(16,21,53,0.92)',
          border: '1px solid rgba(214,181,133,0.5)',
          color: '#D6B585',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'all 0.2s',
          opacity: 0.8,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
      >
        Aa
      </button>
    );
  }

  return (
    <div id="typo-inspector-panel" style={panelStyle}>
      <div style={{
        width: '320px',
        maxHeight: '88vh',
        background: 'rgba(12,16,40,0.98)',
        border: '1px solid rgba(214,181,133,0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header Bar */}
        <div
          onMouseDown={onMouseDown}
          style={{
            background: 'rgba(214,181,133,0.1)',
            borderBottom: '1px solid rgba(214,181,133,0.2)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#D6B585', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Typography Tool
            </span>
            <span style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace' }}>
              ({targets.length})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setPickerActive(v => !v)}
              title="Click any text on the page to select it"
              style={{
                background: pickerActive ? '#D6B585' : 'rgba(255,255,255,0.08)',
                color: pickerActive ? '#0c1028' : '#D6B585',
                border: '1px solid rgba(214,181,133,0.3)',
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: '600',
                borderRadius: '3px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              {pickerActive ? '🎯 Picking...' : '🔍 Pick Text'}
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div style={{ padding: '14px', overflowY: 'auto', flex: 1 }}>
          {/* Element Picker Dropdown */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', fontFamily: 'monospace' }}>
                Select Text Area
              </span>
              <button
                onClick={scanPageElements}
                style={{ background: 'none', border: 'none', color: '#D6B585', fontSize: '9px', cursor: 'pointer', fontFamily: 'monospace' }}
              >
                ↻ Rescan Page
              </button>
            </div>

            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(214,181,133,0.25)',
                color: '#F4F5F8',
                fontSize: '11px',
                padding: '6px 8px',
                appearance: 'none',
                cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
                borderRadius: '3px',
              }}
            >
              {targets.map(t => (
                <option key={t.id} value={t.id} style={{ background: '#0c1028' }}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {selectedTarget && (
            <>
              {/* Selected Element Preview */}
              <div style={{
                background: 'rgba(214,181,133,0.05)',
                borderLeft: '2px solid #D6B585',
                padding: '6px 10px',
                marginBottom: '14px',
                fontSize: '10px',
                color: '#aaa',
                fontFamily: 'monospace',
                wordBreak: 'break-word',
              }}>
                <span style={{ color: '#D6B585', fontWeight: 'bold' }}>{selectedTarget.tagName.toUpperCase()}</span>: "{selectedTarget.textPreview}"
              </div>

              {/* Font Size */}
              <SliderRow
                label="Font Size"
                value={typo.fontSize}
                min={6}
                max={96}
                step={0.5}
                unit="px"
                decimals={1}
                onChange={v => update('fontSize', v)}
              />

              {/* Letter Spacing (Supports Negative!) */}
              <SliderRow
                label="Letter Spacing"
                value={typo.letterSpacing}
                min={-0.15}
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
                min={0.7}
                max={3.0}
                step={0.05}
                unit=""
                decimals={2}
                onChange={v => update('lineHeight', v)}
              />

              {/* Text Color Input */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A89060', marginBottom: '4px', fontFamily: 'monospace' }}>
                  Text Color
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={typo.color.startsWith('#') && typo.color.length === 7 ? typo.color : '#101535'}
                    onChange={e => update('color', e.target.value)}
                    style={{ width: '28px', height: '28px', border: '1px solid rgba(255,255,255,0.2)', background: 'none', cursor: 'pointer', borderRadius: '3px' }}
                  />
                  <input
                    type="text"
                    value={typo.color}
                    onChange={e => update('color', e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(214,181,133,0.25)',
                      color: '#F4F5F8',
                      fontSize: '11px',
                      padding: '4px 8px',
                      fontFamily: 'monospace',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              {/* Text Transform Buttons */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A89060', marginBottom: '4px', fontFamily: 'monospace' }}>
                  Text Transform
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {TRANSFORMS.map(t => (
                    <button
                      key={t}
                      onClick={() => update('textTransform', t)}
                      style={{
                        flex: 1,
                        padding: '4px 2px',
                        fontSize: '9px',
                        fontFamily: 'monospace',
                        background: typo.textTransform === t ? '#D6B585' : 'rgba(255,255,255,0.05)',
                        color: typo.textTransform === t ? '#0c1028' : '#888',
                        border: `1px solid ${typo.textTransform === t ? '#D6B585' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        textTransform: t as any,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight Selector */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A89060', marginBottom: '4px', fontFamily: 'monospace' }}>
                  Font Weight
                </div>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {WEIGHTS.map(w => (
                    <button
                      key={w}
                      onClick={() => update('fontWeight', w)}
                      style={{
                        padding: '3px 6px',
                        fontSize: '9px',
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
            </>
          )}

          {/* Modified Elements Stats */}
          {Object.keys(allValues).length > 0 && (
            <div style={{ fontSize: '10px', color: '#888', marginBottom: '10px', fontFamily: 'monospace' }}>
              ✓ {Object.keys(allValues).length} area{Object.keys(allValues).length > 1 ? 's' : ''} modified
            </div>
          )}

          {/* Copy Fix Prompt Button */}
          <button
            onClick={copyPrompt}
            disabled={Object.keys(allValues).length === 0}
            style={{
              width: '100%',
              padding: '10px',
              background: Object.keys(allValues).length === 0 ? 'rgba(214,181,133,0.1)' : copied ? 'rgba(72,200,120,0.2)' : 'rgba(214,181,133,0.18)',
              border: `1px solid ${copied ? 'rgba(72,200,120,0.5)' : 'rgba(214,181,133,0.4)'}`,
              color: copied ? '#48C878' : Object.keys(allValues).length === 0 ? '#555' : '#D6B585',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: Object.keys(allValues).length === 0 ? 'not-allowed' : 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: '700',
              borderRadius: '3px',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Prompt Copied to Clipboard!' : '⧉ Copy Fix Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};
