// screens.jsx — Stylized app screens for the portfolio mockups.
// Each component is a 320×692-ish iOS screen body (status bar handled by IOSDevice).

// ── Declutr — Tinder-style photo decluttering ─────────────────
function ScreenDeclutr({ scale = 1 }) {
  const photoColors = [
    'linear-gradient(135deg, #f59e7c 0%, #d63f6e 60%, #6c2f8d 100%)',
    'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 60%, #1e1b4b 100%)',
    'linear-gradient(135deg, #fde68a 0%, #f97316 60%, #7c2d12 100%)',
  ];
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      paddingTop: 56, background: '#fafafa',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px 16px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666', letterSpacing: 0.6 }}>OCTOBER 2024</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>247 / 1,420</div>
      </div>

      <div style={{ flex: 1, position: 'relative', padding: '0 20px' }}>
        {/* photo stack — back cards */}
        {[2, 1, 0].map(i => (
          <div key={i} style={{
            position: 'absolute',
            inset: `${i * 8 + 4}px ${20 + i * 6}px auto ${20 + i * 6}px`,
            height: 380,
            borderRadius: 24,
            background: photoColors[i],
            boxShadow: i === 0
              ? '0 18px 40px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08)'
              : '0 4px 12px rgba(0,0,0,0.08)',
            opacity: i === 0 ? 1 : 0.5,
            transform: i === 0 ? 'rotate(-3deg)' : `rotate(${i * -1}deg)`,
            border: '1px solid rgba(255,255,255,0.4)',
          }}>
            {i === 0 && (
              <div style={{
                position: 'absolute', inset: 'auto 0 0 0', padding: '20px 18px',
                color: '#fff', fontSize: 11, fontWeight: 500,
              }}>
                <div style={{ opacity: 0.85 }}>Oct 14 · 2:34 PM</div>
                <div style={{ opacity: 0.65 }}>IMG_2847.HEIC · 4.2 MB</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: 28,
        padding: '24px 0 28px',
      }}>
        {/* delete */}
        <div style={{
          width: 64, height: 64, borderRadius: 100,
          background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444', fontSize: 26,
        }}>✕</div>
        <div style={{
          width: 64, height: 64, borderRadius: 100,
          background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f59e0b', fontSize: 22,
        }}>★</div>
        <div style={{
          width: 64, height: 64, borderRadius: 100,
          background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#10b981', fontSize: 26,
        }}>✓</div>
      </div>

      <div style={{
        margin: '0 20px 36px', padding: '14px 16px',
        background: '#fff', borderRadius: 18,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>STORAGE FREED</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>2.4 GB</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>DELETED</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2, color: '#ef4444' }}>184</div>
        </div>
      </div>
    </div>
  );
}

// ── MapTok — Rail trip tracking ───────────────────────────────
function ScreenMapTok({ scale = 1 }) {
  return (
    <div style={{
      height: '100%', position: 'relative',
      background: 'linear-gradient(180deg, #1a1d29 0%, #0f1117 100%)',
      paddingTop: 56,
    }}>
      {/* Map area */}
      <div style={{
        position: 'absolute', inset: '56px 0 240px 0',
        background: `
          radial-gradient(800px 400px at 20% 30%, rgba(120, 180, 250, 0.15), transparent 60%),
          radial-gradient(600px 400px at 80% 70%, rgba(180, 130, 250, 0.1), transparent 60%),
          linear-gradient(180deg, #1a1d29, #0f1117)
        `,
        overflow: 'hidden',
      }}>
        {/* Grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
          <defs>
            <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>
        {/* Route */}
        <svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <path d="M 60 340 Q 130 280, 180 250 T 280 140 T 340 60" 
                stroke="#7dd3fc" strokeWidth="3" fill="none" strokeLinecap="round" 
                strokeDasharray="0" opacity="0.95"/>
          <path d="M 60 340 Q 130 280, 180 250 T 280 140 T 340 60" 
                stroke="#7dd3fc" strokeWidth="10" fill="none" strokeLinecap="round" 
                opacity="0.15" filter="blur(4px)"/>
          {/* Stations */}
          {[[60,340],[180,250],[280,140],[340,60]].map(([x,y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#0f1117" stroke="#7dd3fc" strokeWidth="2"/>
              {i === 2 && <circle cx={x} cy={y} r="14" fill="#7dd3fc" opacity="0.2"/>}
            </g>
          ))}
        </svg>
      </div>

      {/* Top pill */}
      <div style={{
        position: 'absolute', top: 60, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{
          padding: '8px 14px', borderRadius: 100,
          background: 'rgba(20,22,30,0.7)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#fff', fontSize: 11, fontWeight: 500, letterSpacing: 0.4,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 100, background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          LIVE · GWR 1A23
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 100,
          background: 'rgba(20,22,30,0.7)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16,
        }}>↻</div>
      </div>

      {/* Bottom trip card */}
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 36,
        background: 'rgba(20,22,30,0.92)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22,
        padding: '18px 18px 16px', color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: '#7dd3fc', fontWeight: 600, letterSpacing: 1 }}>LONDON PAD → EDINBURGH</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>4h 23m · On time</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: 1 }}>SPEED</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>124 mph</div>
          </div>
        </div>

        {/* Stops timeline */}
        <div style={{ position: 'relative', paddingLeft: 16 }}>
          <div style={{
            position: 'absolute', left: 5, top: 4, bottom: 4, width: 2,
            background: 'linear-gradient(180deg, #7dd3fc 50%, rgba(255,255,255,0.1) 50%)',
          }} />
          {[
            { s: 'King\'s Cross', t: '09:00', done: true },
            { s: 'York', t: '10:51', done: true },
            { s: 'Newcastle', t: '12:18', live: true },
            { s: 'Edinburgh', t: '13:23', done: false },
          ].map((stop, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: -16, width: 12, height: 12,
                  borderRadius: 100,
                  background: stop.live ? '#7dd3fc' : (stop.done ? '#7dd3fc' : '#0f1117'),
                  border: '2px solid #0f1117',
                  boxShadow: stop.live ? '0 0 0 4px rgba(125,211,252,0.25)' : 'none',
                }} />
                <span style={{ fontSize: 13, color: stop.live ? '#fff' : (stop.done ? 'rgba(255,255,255,0.55)' : '#fff'), fontWeight: stop.live ? 600 : 500 }}>{stop.s}</span>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: stop.done && !stop.live ? 'rgba(255,255,255,0.4)' : '#fff' }}>{stop.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pub Roulette — Multiplayer pub crawl game ─────────────────
function ScreenPubRoulette({ scale = 1 }) {
  return (
    <div style={{
      height: '100%', position: 'relative', paddingTop: 56,
      background: `
        radial-gradient(700px 500px at 30% 20%, rgba(244, 114, 182, 0.55), transparent 50%),
        radial-gradient(600px 500px at 80% 70%, rgba(168, 85, 247, 0.55), transparent 50%),
        radial-gradient(500px 400px at 20% 90%, rgba(99, 102, 241, 0.55), transparent 50%),
        linear-gradient(135deg, #4c1d95 0%, #831843 100%)
      `,
    }}>
      <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>PARTY: KING'S CROSS CRAWL</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>8 PLAYERS</div>
      </div>

      {/* Wheel */}
      <div style={{
        position: 'relative', margin: '12px auto 0', width: 240, height: 240,
      }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{
          filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.35))',
        }}>
          <defs>
            <radialGradient id="wm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {['#fb7185', '#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f97316', '#ef4444'].map((c, i) => {
            const a = (i * 45 - 90) * Math.PI / 180;
            const a2 = ((i+1) * 45 - 90) * Math.PI / 180;
            const x1 = 120 + Math.cos(a) * 110, y1 = 120 + Math.sin(a) * 110;
            const x2 = 120 + Math.cos(a2) * 110, y2 = 120 + Math.sin(a2) * 110;
            return <path key={i} d={`M 120 120 L ${x1} ${y1} A 110 110 0 0 1 ${x2} ${y2} Z`} fill={c} opacity="0.92"/>;
          })}
          <circle cx="120" cy="120" r="110" fill="url(#wm)"/>
          <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <circle cx="120" cy="120" r="38" fill="#fff"/>
          <text x="120" y="116" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="20" fill="#831843">spin</text>
          <text x="120" y="134" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#831843" letterSpacing="2">ROULETTE</text>
        </svg>
        {/* Pointer */}
        <div style={{
          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '11px solid transparent', borderRight: '11px solid transparent',
          borderTop: '18px solid #fff',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }} />
      </div>

      {/* Bottom cards */}
      <div style={{
        position: 'absolute', left: 14, right: 14, bottom: 38,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{
          padding: '14px 16px', borderRadius: 16,
          background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 600, letterSpacing: 1 }}>TEAM</div>
            <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 600, letterSpacing: 1 }}>PUB 3 / 6</div>
          </div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 28, marginTop: 2 }}>The Lions</div>
        </div>
        <div style={{
          padding: '12px 16px', borderRadius: 14,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 600, letterSpacing: 1 }}>YOUR ORDER</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Aperol Spritz · Through a straw</div>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 100,
            background: '#fff', color: '#831843', fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          }}>+50 XP</div>
        </div>
      </div>
    </div>
  );
}

// ── Optidose — Medication tracker ─────────────────────────────
function ScreenOptidose({ scale = 1 }) {
  return (
    <div style={{
      height: '100%', background: '#fbfaf7', paddingTop: 56,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '8px 24px 18px' }}>
        <div style={{ fontSize: 11, color: '#9b9789', fontWeight: 600, letterSpacing: 1 }}>FRIDAY · OCT 17</div>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 32, marginTop: 4, color: '#1c1b16' }}>Good morning,<br/>Alex.</div>
      </div>

      {/* Adherence rings */}
      <div style={{
        margin: '0 20px 20px', padding: '20px',
        background: '#1c1b16', borderRadius: 22, color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: 10, color: '#9b9789', fontWeight: 600, letterSpacing: 1 }}>ADHERENCE · 30 DAYS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
            <circle cx="42" cy="42" r="36" fill="none" stroke="#86efac" strokeWidth="6"
              strokeDasharray={`${0.94 * 226} 226`} strokeLinecap="round"
              transform="rotate(-90 42 42)"/>
            <circle cx="42" cy="42" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
            <circle cx="42" cy="42" r="26" fill="none" stroke="#fcd34d" strokeWidth="4"
              strokeDasharray={`${0.82 * 163} 163`} strokeLinecap="round"
              transform="rotate(-90 42 42)"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 42, lineHeight: 1 }}>94<span style={{ fontSize: 22, color: '#9b9789' }}>%</span></div>
            <div style={{ fontSize: 11, color: '#9b9789', marginTop: 4, letterSpacing: 0.4 }}>3 missed · this week</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11, color: '#9b9789', fontWeight: 600, letterSpacing: 1 }}>TODAY · 4 REMAINING</div>
        <div style={{ fontSize: 11, color: '#9b9789', letterSpacing: 0.4 }}>HealthKit sync</div>
      </div>

      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Metformin', dose: '500 mg · 1 tab', time: '08:00', state: 'done' },
          { name: 'Atorvastatin', dose: '20 mg · 1 tab', time: '12:00', state: 'next' },
          { name: 'Vitamin D₃', dose: '2000 IU', time: '12:00', state: 'wait' },
          { name: 'Metoprolol', dose: '50 mg', time: '20:00', state: 'wait' },
        ].map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 14px', background: '#fff',
            borderRadius: 14, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            border: m.state === 'next' ? '1.5px solid #1c1b16' : '1px solid rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: m.state === 'done' ? '#86efac' : (m.state === 'next' ? '#1c1b16' : '#f0ede5'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: m.state === 'done' ? '#15803d' : (m.state === 'next' ? '#fff' : '#9b9789'),
              fontSize: 16, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic',
            }}>{m.state === 'done' ? '✓' : (i < 2 ? 'M' : (i === 2 ? 'V' : 'M'))}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1c1b16' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#9b9789', marginTop: 1 }}>{m.dose}</div>
            </div>
            <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: m.state === 'done' ? '#9b9789' : '#1c1b16', textDecoration: m.state === 'done' ? 'line-through' : 'none' }}>{m.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sketchy — Drawing/guessing party game ─────────────────────
function ScreenSketchy({ scale = 1 }) {
  return (
    <div style={{
      height: '100%', background: '#fef6e4', paddingTop: 56,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '0 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          padding: '6px 12px', borderRadius: 100,
          background: '#1c1b1a', color: '#fef6e4',
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
        }}>ROUND 3 / 5</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700,
          color: '#1c1b1a',
        }}>00:34</div>
      </div>

      <div style={{ padding: '4px 18px 12px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#857a63', fontWeight: 700, letterSpacing: 1 }}>YOU'RE DRAWING</div>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 38, color: '#1c1b1a', marginTop: 2 }}>banana</div>
      </div>

      {/* Canvas */}
      <div style={{
        margin: '0 18px', flex: 1, background: '#fff',
        borderRadius: 18, position: 'relative', overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.05)',
      }}>
        <svg viewBox="0 0 280 320" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          {/* banana sketch */}
          <path d="M 70 100 Q 90 50 150 60 Q 220 70 230 160 Q 235 240 170 250 Q 90 240 70 170 Q 60 130 70 100 Z"
            fill="#fde047" stroke="#1c1b1a" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M 150 60 Q 140 50 145 35 L 155 38 Q 158 50 152 60 Z"
            fill="#5a4a30" stroke="#1c1b1a" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M 90 130 Q 110 110 140 105" stroke="#1c1b1a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M 95 180 Q 130 170 175 170" stroke="#1c1b1a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
          {/* cursor */}
          <circle cx="195" cy="105" r="5" fill="#ef4444"/>
          <circle cx="195" cy="105" r="11" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4"/>
        </svg>
      </div>

      {/* Tool bar */}
      <div style={{
        margin: '12px 18px 0',
        display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center',
      }}>
        {['#1c1b1a', '#ef4444', '#fbbf24', '#10b981', '#3b82f6', '#a855f7'].map((c, i) => (
          <div key={c} style={{
            width: i === 1 ? 30 : 24, height: i === 1 ? 30 : 24,
            borderRadius: 100, background: c,
            border: i === 1 ? '2px solid #1c1b1a' : 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }} />
        ))}
      </div>

      {/* Players strip */}
      <div style={{
        margin: '14px 18px 24px',
        padding: '12px 14px',
        background: '#1c1b1a', borderRadius: 14,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        {['A', 'M', 'J', 'K', 'S'].map((l, i) => (
          <div key={i} style={{
            width: 26, height: 26, borderRadius: 100,
            background: ['#fb7185', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][i],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1c1b1a', fontWeight: 700, fontSize: 11,
            border: i === 0 ? '2px solid #fef6e4' : 'none',
          }}>{l}</div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ color: '#fef6e4', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>2 GUESSED</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenDeclutr, ScreenMapTok, ScreenPubRoulette, ScreenOptidose, ScreenSketchy,
});
