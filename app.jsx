// app.jsx — Root portfolio app

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "plasma",
  "motion": "tasteful",
  "rippleColor": "#a855f7",
  "rippleOn": true,
  "rippleSpeed": 1,
  "rippleOrigin": "top-right",
  "mockupSpeed": 0.5,
  "mockupSpacing": 1.5,
  "mockupSize": 1.2
} /*EDITMODE-END*/;

const RIPPLE_ORIGINS = {
  'top-right': { x: 0.95, y: 0.05, label: 'TR → BL' },
  'bottom-right': { x: 0.95, y: 0.98, label: 'BR → TL' },
  'bottom-left': { x: 0.05, y: 0.98, label: 'BL → TR' },
  'top-left': { x: 0.05, y: 0.05, label: 'TL → BR' },
  'bottom': { x: 0.50, y: 1.02, label: 'Bottom up' },
  'centre': { x: 0.50, y: 0.50, label: 'Centre out' }
};

const ACCENT_PALETTES = {
  chrome: { name: 'Chrome', c1: '#dde1e7', c2: '#8a8f99', glow: 'rgba(220, 224, 230, 0.18)' },
  plasma: { name: 'Plasma', c1: '#f0abfc', c2: '#a855f7', glow: 'rgba(217, 70, 239, 0.22)' },
  cyber: { name: 'Cyber', c1: '#a7f3d0', c2: '#10b981', glow: 'rgba(16, 185, 129, 0.22)' },
  solar: { name: 'Solar', c1: '#fde68a', c2: '#f59e0b', glow: 'rgba(245, 158, 11, 0.22)' },
  arctic: { name: 'Arctic', c1: '#bae6fd', c2: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.22)' }
};

const RIPPLE_COLORS = [
{ value: '#f97316', name: 'Ember', glow: 'rgba(249, 115, 22, 0.32)', glow2: 'rgba(249, 115, 22, 0.10)' },
{ value: '#ef4444', name: 'Crimson', glow: 'rgba(239, 68, 68, 0.32)', glow2: 'rgba(239, 68, 68, 0.10)' },
{ value: '#a855f7', name: 'Plasma', glow: 'rgba(168, 85, 247, 0.32)', glow2: 'rgba(168, 85, 247, 0.10)' },
{ value: '#0ea5e9', name: 'Arctic', glow: 'rgba(14, 165, 233, 0.32)', glow2: 'rgba(14, 165, 233, 0.10)' },
{ value: '#10b981', name: 'Matrix', glow: 'rgba(16, 185, 129, 0.32)', glow2: 'rgba(16, 185, 129, 0.10)' },
{ value: '#fde68a', name: 'Gold', glow: 'rgba(253, 230, 138, 0.32)', glow2: 'rgba(253, 230, 138, 0.10)' },
{ value: '#e9eaee', name: 'Steel', glow: 'rgba(233, 234, 238, 0.22)', glow2: 'rgba(233, 234, 238, 0.06)' }];


function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function applyRippleColor(hex) {
  document.documentElement.style.setProperty('--ripple-glow', hexToRgba(hex, 0.32));
  document.documentElement.style.setProperty('--ripple-glow-2', hexToRgba(hex, 0.10));
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// Counts up from 0 → `to` once visible. Preserves units/symbols.
function Counter({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let raf, start;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const animate = (t) => {
          if (!start) start = t;
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setVal(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => {if (raf) cancelAnimationFrame(raf);io.disconnect();};
  }, [to, duration]);
  return <span ref={ref} className="counter">{val}{suffix}</span>;
}

// 3D tilt on hover for cards (expressive mode)
function useTilt(enabled) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = null;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
      });
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [enabled]);
  return ref;
}

function applyAccent(accentKey) {
  const p = ACCENT_PALETTES[accentKey] || ACCENT_PALETTES.chrome;
  document.documentElement.style.setProperty('--accent', p.c1);
  document.documentElement.style.setProperty('--accent-2', p.c2);
  document.documentElement.style.setProperty('--accent-glow', p.glow);
  // Chrome gradient remains silver unless we want to tint it
  if (accentKey === 'chrome') {
    document.documentElement.style.setProperty('--chrome',
    'linear-gradient(180deg, #f3f5f8 0%, #aab0b9 38%, #5d6168 60%, #c9ced6 100%)');
  } else {
    document.documentElement.style.setProperty('--chrome',
    `linear-gradient(180deg, ${p.c1} 0%, ${p.c2} 50%, #1c1c22 88%, ${p.c1} 100%)`);
  }
}

function applyMotion(motion) {
  document.body.classList.remove('motion-minimal', 'motion-tasteful', 'motion-expressive');
  document.body.classList.add(`motion-${motion}`);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {applyAccent(t.accent);}, [t.accent]);
  useEffect(() => {applyMotion(t.motion);}, [t.motion]);
  useEffect(() => {applyRippleColor(t.rippleColor);}, [t.rippleColor]);

  useReveal();

  const openApp = APPS_DATA.find((a) => a.id === openId);

  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero
          ripple={t.rippleOn ? t.rippleColor : null}
          rippleSpeed={t.rippleSpeed}
          rippleOrigin={RIPPLE_ORIGINS[t.rippleOrigin] || RIPPLE_ORIGINS['bottom-right']} />
        
        <About />
        <Apps onOpen={setOpenId} motion={t.motion} mockupSpeed={t.mockupSpeed} mockupSpacing={t.mockupSpacing} mockupSize={t.mockupSize} />
        <Skills />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <CaseStudy app={openApp} onClose={() => setOpenId(null)} />

      <TweaksPanel>
        <TweakSection label="Hero ripple" />
        <TweakToggle
          label="Show ripple"
          value={t.rippleOn}
          onChange={(v) => setTweak('rippleOn', v)} />
        
        <TweakColor
          label="Ripple color"
          value={t.rippleColor}
          options={RIPPLE_COLORS.map((c) => c.value)}
          onChange={(v) => setTweak('rippleColor', v)} />
        
        <TweakSlider
          label="Speed"
          value={t.rippleSpeed}
          min={0.1}
          max={3}
          step={0.1}
          unit="×"
          onChange={(v) => setTweak('rippleSpeed', v)} />
        
        <TweakSelect
          label="Origin"
          value={t.rippleOrigin}
          options={Object.keys(RIPPLE_ORIGINS).map((k) => ({ value: k, label: RIPPLE_ORIGINS[k].label }))}
          onChange={(v) => setTweak('rippleOrigin', v)} />
        
        <TweakSection label="Accent" />
        <TweakColor
          label="Palette"
          value={[ACCENT_PALETTES[t.accent].c1, ACCENT_PALETTES[t.accent].c2, '#08080b']}
          options={Object.keys(ACCENT_PALETTES).map((k) => [ACCENT_PALETTES[k].c1, ACCENT_PALETTES[k].c2, '#08080b'])}
          onChange={(v) => {
            const key = Object.keys(ACCENT_PALETTES).find((k) => ACCENT_PALETTES[k].c1 === v[0]) || 'chrome';
            setTweak('accent', key);
          }} />
        
        <TweakSelect
          label="Theme"
          value={t.accent}
          options={Object.keys(ACCENT_PALETTES).map((k) => ({ value: k, label: ACCENT_PALETTES[k].name }))}
          onChange={(v) => setTweak('accent', v)} />
        
        <TweakSection label="Motion" />
        <TweakRadio
          label="Intensity"
          value={t.motion}
          options={['minimal', 'tasteful', 'expressive']}
          onChange={(v) => setTweak('motion', v)} />

        <TweakSection label="Work carousel" />
        <TweakSlider
          label="Speed"
          value={t.mockupSpeed}
          min={0.2}
          max={3}
          step={0.05}
          unit="×"
          onChange={(v) => setTweak('mockupSpeed', v)} />
        <TweakSlider
          label="Spacing"
          value={t.mockupSpacing}
          min={0.8}
          max={2}
          step={0.05}
          unit="×"
          onChange={(v) => setTweak('mockupSpacing', v)} />
        <TweakSlider
          label="Size"
          value={t.mockupSize}
          min={0.7}
          max={1.4}
          step={0.05}
          unit="×"
          onChange={(v) => setTweak('mockupSize', v)} />
        
        <TweakSection label="Random" />
        <TweakButton
          label="Surprise me"
          onClick={() => {
            const keys = Object.keys(ACCENT_PALETTES);
            const motions = ['minimal', 'tasteful', 'expressive'];
            setTweak({
              accent: keys[Math.floor(Math.random() * keys.length)],
              motion: motions[Math.floor(Math.random() * motions.length)],
              rippleColor: RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)].value
            });
          }}>
          Reroll the vibe</TweakButton>
      </TweaksPanel>
    </React.Fragment>);

}

// ── Nav ──────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <a className="brand" href="#" aria-label="Alex Chopoyhlu — Home">
        <img src="assets/logo.png" alt="Alex Chopoyhlu" style={{ width: "43px", height: "34px" }} />
      </a>
      <div className="links">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#stack">Stack</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="pill">
        <span className="dot" />
        <span>Available · Q3 '26</span>
      </div>
    </nav>);
}

// ── Hero ─────────────────────────────────────────────────────
function Hero({ ripple, rippleSpeed = 1, rippleOrigin }) {
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') return 720;
    const w = window.innerWidth;
    return w < 880 ? 520 : w < 1180 ? 600 : 720;
  });
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setSize(w < 880 ? 520 : w < 1180 ? 600 : 720);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section className="hero shell" style={{ padding: "140px 40px 10px" }}>
      {ripple &&
      <div className="hero-ripple" aria-hidden="true" style={{ width: size, height: size }}>
          <div className="glow" />
          <CodeRipple
          color={ripple}
          size={size}
          speed={rippleSpeed}
          originX={rippleOrigin?.x ?? 0.95}
          originY={rippleOrigin?.y ?? 0.98} />
        
        </div>
      }
      <div className="hero-stage">
      <div className="topline">
        <div className="seg"><span>v2.6 · 2026</span></div>
        <div className="sep" />
        <div className="seg"><span>iOS / Swift / SwiftUI</span></div>
        <div className="sep" />
        <div className="seg"><span>Designer + Developer</span></div>
      </div>
      <h1>
        <span className="it" style={{ letterSpacing: "-0.1px", padding: "0 0 0 10px" }}>Alex</span><br />
        <span className="ch">Chopoyhlu</span>
        <span style={{ fontStyle: 'italic', opacity: 0.55 }}>.</span>
      </h1>
      <div className="tagline">
        <span style={{ fontFamily: '"Instrument Serif"', padding: "0 0 10px" }}>Making mobile feel simple again. Five shipped iOS apps and a recurring habit of breaking interfaces apart and reassembling them better.</span>
      </div>
      <div className="marquee-row">
        <div className="track">
          {Array.from({ length: 2 }).map((_, k) =>
            <React.Fragment key={k}>
              <span>SwiftUI</span><span className="star">✶</span>
              <span>SwiftData</span><span className="star">✶</span>
              <span>PhotoKit</span><span className="star">✶</span>
              <span>HealthKit</span><span className="star">✶</span>
              <span>MapKit</span><span className="star">✶</span>
              <span>Firebase</span><span className="star">✶</span>
              <span>GameKit</span><span className="star">✶</span>
              <span>PencilKit</span><span className="star">✶</span>
              <span>WidgetKit</span><span className="star">✶</span>
              <span>Live Activities</span><span className="star">✶</span>
              <span>Mesh Gradients</span><span className="star">✶</span>
            </React.Fragment>
            )}
        </div>
      </div>
      </div>
    </section>);

}

// ── About ─────────────────────────────────────────────────────
function About() {
  return (
    <section className="section shell" id="about" style={{ padding: "46px 40px 16px" }}>
      <div className="section-hd">
        <div className="left">
          <div className="meta">// 01 — about</div>
          <h2>The short version.</h2>
        </div>
        <div className="meta">/about.md</div>
      </div>
      <div className="about-grid">
        <div className="lede reveal">
          I'm an iOS designer-developer who'd rather ship something <em>opinionated</em> than something safe.
        </div>
        <div className="body reveal">
          <p>I've spent the last few years shipping native iOS apps end-to-end — design, code, App Store assets, the lot. Five apps now, ranging from a Tinder-style camera-roll cleaner to a multiplayer drinking game with a real-time backend.</p>
          <p>I care about the boring 80% of an app — the empty states, the cold-launch animations, the moments when something goes wrong. I think SwiftUI is the most fun anyone's had on the platform in a decade, and I'm allergic to apps that look like the Settings screen.</p>
          <p>I'm based in the UK, available for freelance and contract iOS work, and equally happy designing or writing the Swift.</p>
          <div className="about-stats">
            <div className="stat"><div className="v"><Counter to={5} /></div><div className="k">Apps shipped</div></div>
            <div className="stat"><div className="v"><Counter to={3} /></div><div className="k">Years on iOS</div></div>
            <div className="stat"><div className="v">∞</div><div className="k">Tab bars deleted</div></div>
          </div>
        </div>
      </div>
    </section>);

}

// ── Apps grid ─────────────────────────────────────────────────
function Apps({ onOpen, motion, mockupSpeed, mockupSpacing, mockupSize }) {
  return (
    <section className="section shell" id="work" style={{ padding: "36px 40px 16px" }}>
      <div className="section-hd">
        <div className="left">
          <div className="meta">// 02 — work</div>
          <h2>Projects <span style={{ opacity: 0.5 }}>One person.</span></h2>
        </div>
        <div className="meta">work/<span style={{ color: 'var(--text)' }}>{APPS_DATA.length} items</span></div>
      </div>
      <div className="apps-grid">
        {APPS_DATA.map((app, i) =>
        <AppCard key={app.id} app={app} index={i} motion={motion} mockupSpeed={mockupSpeed} mockupSpacing={mockupSpacing} mockupSize={mockupSize} onOpen={() => onOpen(app.id)} />
        )}
      </div>
    </section>);

}

function AppCard({ app, index, motion, mockupSpeed, mockupSpacing, mockupSize, onOpen }) {
  const tiltRef = useTilt(motion === 'expressive');
  return (
    <article
      ref={tiltRef}
      className="app-card reveal"
      style={{ '--rd': `${index * 90}ms` }}
      onClick={onOpen}>
      <div className="glow" />
      <div className="info">
        <div className="head">
          <div>
            <div className="index">CASE / {app.index}</div>
            <h3>{app.name}</h3>
          </div>
          <span className={`status ${app.status === 'dev' ? 'dev' : app.status === 'beta' ? 'beta' : ''}`}>
            <span className="dot" />
            {app.statusLabel}
          </span>
        </div>
        <p className="blurb">{app.blurb}</p>
        <div className="tags">
          {app.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <div className="open-arrow">
          <span>Open case study</span>
          <span className="arr" />
        </div>
      </div>
      <MockupStage tint={app.tint} app={app} motion={motion} speed={mockupSpeed} spacing={mockupSpacing} size={mockupSize} reverse={index % 2 === 1} />
    </article>);
}

function MockupStage({ tint, app, motion, speed = 1, spacing = 1.25, size = 1, reverse = false }) {
  // Drive the animation by writing transforms directly to refs each frame —
  // no React re-render in the hot loop. This is what makes it feel smooth.
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const paramsRef = useRef({ speed, spacing, size });
  useEffect(() => {paramsRef.current = { speed, spacing, size };}, [speed, spacing, size]);

  useEffect(() => {
    if (motion === 'minimal') {
      // Park each card at a fixed legible position.
      const positions = [
      { x: -260, y: 10, r: -10, s: 0.78, o: 0.85, z: 50 },
      { x: 0, y: -12, r: 0, s: 1.0, o: 1.0, z: 100 },
      { x: 260, y: 10, r: 10, s: 0.78, o: 0.85, z: 50 }];

      cardRefs.forEach((r, i) => writeStyle(r.current, positions[i]));
      return;
    }
    let raf;
    let last;
    let phase = 0;
    const BASE_DURATION = 24000; // ms for one full traversal at 1× — slow + calm

    const smoothstep = (x) => x * x * (3 - 2 * x);

    const tick = (now) => {
      if (last === undefined) last = now;
      const dt = now - last;
      last = now;
      const { speed: sp, spacing: sx, size: sz } = paramsRef.current;
      phase = (phase + dt * sp / BASE_DURATION) % 1;

      const X_RANGE = 320 * sx; // half-width travel from centre
      for (let i = 0; i < 3; i++) {
        const local = (phase + i / 3) % 1;
        const sCurve = Math.sin(local * Math.PI); // 0..1..0 — peaks at centre
        const eased = smoothstep(sCurve);
        const dir = reverse ? -1 : 1;
        const xFrac = (0.5 - local) * dir; // travel direction flips on reversed cards
        const x = xFrac * X_RANGE * 2;
        const y = -eased * 28 + 12;
        const r = xFrac * 18 * (1 - eased * 0.35);
        const s = (0.55 + eased * 0.55) * sz;
        // wider, eased fade so cards enter/exit invisibly
        const fade = 0.20;
        let o = 1;
        if (local < fade) o = smoothstep(local / fade);else
        if (local > 1 - fade) o = smoothstep((1 - local) / fade);
        writeStyle(cardRefs[i].current, { x, y, r, s, o, z: Math.round(eased * 100) });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motion, reverse]);

  return (
    <div className="mockup-stage" style={tint ? { '--accent-glow': tint } : {}}>
      <svg className="orbit" viewBox="0 0 500 360" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`og-${app.id}`} x1="0%" x2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path
          d="M 30 230 Q 250 90, 470 230"
          fill="none"
          stroke={`url(#og-${app.id})`}
          strokeWidth="1"
          strokeDasharray="2 5" />
      </svg>
      <div className="mockup-track">
        {[0, 1, 2].map((slot) =>
        <MockupCard
          key={slot}
          ref={cardRefs[slot]}
          slot={slot}
          app={app}
          tint={tint} />
        )}
      </div>
    </div>);
}

// Direct DOM writes for the hot animation loop — skip React.
function writeStyle(el, { x, y, r, s, o, z }) {
  if (!el) return;
  el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`;
  el.style.opacity = o;
  el.style.zIndex = z;
}

const MockupCard = React.forwardRef(function MockupCard({ slot, app, tint }, ref) {
  const img = app.mockups && app.mockups[slot % app.mockups.length];
  if (img) {
    return (
      <div
        ref={ref}
        className="mockup-card mockup-card-image"
        style={{ '--mc-tint': tint || 'var(--accent-glow)' }}>
        <div className="mc-glow" />
        <img src={img} alt={`${app.name} mockup ${slot + 1}`} />
      </div>);
  }
  return (
    <div
      ref={ref}
      className="mockup-card"
      style={{ '--mc-tint': tint || 'var(--accent-glow)' }}>
      <div className="mc-glow" />
      <div className="mc-top">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <div className="mc-body">MOCKUP · {String(slot + 1).padStart(2, '0')}</div>
      <div className="mc-label">{app.name.toUpperCase()} / {String(slot % 4 + 1).padStart(2, '0')}</div>
      <div className="mc-num">{String(slot + 1).padStart(2, '0')} / 03</div>
    </div>);
});

// ── Skills ────────────────────────────────────────────────────
function Skills() {
  const skills = [
  { name: 'SwiftUI', cat: 'Framework', icon: 'assets/tools/swiftui.png', desc: 'Declarative UI for native Apple apps.' },
  { name: 'Swift', cat: 'Language', icon: 'assets/tools/swift.png', desc: "Apple's modern systems language." },
  { name: 'SwiftData', cat: 'Persistence', icon: 'assets/tools/swiftdata.png', desc: 'Type-safe local storage built on Core Data.' },
  { name: 'UIKit', cat: 'Framework', icon: 'assets/tools/uikit.png', desc: 'The classic imperative iOS framework.' },
  { name: 'HealthKit', cat: 'Platform', icon: 'assets/tools/health.png', desc: 'Read & write health data on iPhone.' },
  { name: 'PhotoKit', cat: 'Platform', icon: 'assets/tools/photokit.png', desc: "Access and edit the user's photo library." },
  { name: 'MapKit', cat: 'Platform', icon: 'assets/tools/mapkit.png', desc: 'Native maps, overlays, and routing.' },
  { name: 'WidgetKit', cat: 'Platform', icon: 'assets/tools/widgetkit.png', desc: 'Home Screen and Lock Screen widgets.' },
  { name: 'Firebase', cat: 'Backend', icon: 'assets/tools/firebase.png', desc: 'Realtime database and auth from Google.' },
  { name: 'Xcode', cat: 'IDE', icon: 'assets/tools/xcode.png', desc: 'The build, debug and ship cockpit.' },
  { name: 'Icon Composer', cat: 'Design', icon: 'assets/tools/icon-composer.png', desc: 'Layered app icons for every Apple platform.' },
  { name: 'Figma', cat: 'Design', icon: 'assets/tools/figma.png', desc: 'Where every screen starts its life.' }];

  return (
    <section className="section shell" id="stack" style={{ padding: "36px 40px 16px" }}>
      <div className="section-hd">
        <div className="left">
          <div className="meta">// 03 — stack</div>
          <h2>The toolkit.</h2>
        </div>
        <div className="meta" style={{ opacity: "0" }}>{skills.length} entries</div>
      </div>
      <div className="skills-grid reveal">
        {skills.map((s, i) =>
        <div key={s.name} className="skill" style={{ '--rd': `${i * 30}ms` }}>
            <div className="peek" aria-hidden="true">
              <img src={s.icon} alt="" />
            </div>
            <div className="cat">{s.cat}</div>
            <div className="name">{s.name}</div>
            <div className="desc">{s.desc}</div>
          </div>
        )}
      </div>
    </section>);
}

// ── Pricing ───────────────────────────────────────────────────
function Pricing() {
  return (
    <section className="section shell" id="pricing" style={{ padding: "96px 40px 16px" }}>
      <div className="section-hd">
        <div className="left">
          <div className="meta">// 04 — pricing</div>
          <h2>Ways to work together.</h2>
        </div>
        <div className="meta">GBP · ex VAT</div>
      </div>
      <div className="pricing-grid">
        <div className="tier reveal">
          <div>
            <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>TIER · 01</div>
            <h4 style={{ marginTop: 8 }}>The Sketch</h4>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>For founders who need to see the idea on a phone before committing.</p>
          <div className="price">
            <span className="amount">£1k</span>
            <span className="unit">/ flat</span>
          </div>
          <ul>
            <li>1 week, async</li>
            <li>High-fidelity Figma prototype</li>
            <li>Two design directions</li>
            <li>One round of revisions</li>
            <li>Handoff doc & component library</li>
          </ul>
          <button className="cta">Start a sketch <span>→</span></button>
        </div>

        <div className="tier featured reveal">
          <span className="badge">Most popular</span>
          <div>
            <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>TIER · 02</div>
            <h4 style={{ marginTop: 8 }}>The Build</h4>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>Design + ship a complete iOS app, from blank Xcode project to App Store review.</p>
          <div className="price">
            <span className="amount">£6k</span>
            <span className="unit">/ flat</span>
          </div>
          <ul>
            <li>Design and code, end-to-end</li>
            <li>Native SwiftUI / Swift</li>
            <li>Weekly TestFlight builds</li>
            <li>App Store submission & assets</li>
            <li>30 days post-launch support</li>
          </ul>
          <button className="cta">Book a build <span>→</span></button>
        </div>

        <div className="tier reveal">
          <div>
            <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>TIER · 03</div>
            <h4 style={{ marginTop: 8 }}>The Retainer</h4>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>For teams that already have an app and want a fractional lead on retainer.</p>
          <div className="price">
            <span className="amount">£2k</span>
            <span className="unit">/ month</span>
          </div>
          <ul>
            <li>2 days a week, flexible</li>
            <li>Design reviews & critique</li>
            <li>SwiftUI pairing sessions</li>
            <li>Roadmap & prioritisation</li>
            <li>Async Slack / Loom</li>
          </ul>
          <button className="cta">Enquire <span>→</span></button>
        </div>
      </div>
    </section>);

}

// ── Contact ───────────────────────────────────────────────────
function Contact() {
  return (
    <section className="section shell" id="contact" style={{ padding: "96px 40px 6px" }}>
      <div className="section-hd">
        <div className="left">
          <div className="meta">// 05 — contact</div>
          <h2>Say hello.</h2>
        </div>
        <div className="meta">response &lt; 24h</div>
      </div>
      <div className="contact-grid">
        <div className="ledger">
          <div className="row">
            <span className="k">Email</span>
            <span className="v mono">alex.chopoyhlu@outlook.com</span>
          </div>
          <div className="row">
            <span className="k">Phone</span>
            <span className="v mono">+44 7308 231 707</span>
          </div>
          <div className="row">
            <span className="k">Instagram</span>
            <span className="v">@alexchopoyhlu</span>
          </div>
          <div className="row">
            <span className="k">LinkedIn</span>
            <span className="v">@alexchopoyhlu</span>
          </div>
          <div className="row">
            <span className="k">X</span>
            <span className="v">@chopoyhlu</span>
          </div>
          <div className="row">
            <span className="k">Based</span>
            <span className="v">United Kingdom · GMT</span>
          </div>
        </div>
        <div className="cta-card">
          <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>FOR HIRE</div>
          <h3>Got an app<br />in your head?</h3>
          <p>Let's put it on a phone. Fixed scope, weekly demos, no consultancy nonsense.</p>
          <a className="btn" href="mailto:alex.chopoyhlu@outlook.com">Start a conversation <span>→</span></a>
        </div>
      </div>
    </section>);

}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <div className="shell">
        <div>© 2026 · Alex Chopoyhlu</div>
        <div>Hand-built · No frameworks · Just CSS &amp; JSX</div>
        <div>v2.6 · Last updated 19 May</div>
      </div>
    </footer>);

}

// ── Case study modal ──────────────────────────────────────────
function CaseStudy({ app, onClose }) {
  // Keep the previously-opened app rendered briefly during the exit animation.
  const [renderedApp, setRenderedApp] = useState(app);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (app) {
      setRenderedApp(app);
      const r = requestAnimationFrame(() => setIsOpen(true));
      return () => cancelAnimationFrame(r);
    } else {
      setIsOpen(false);
      const t = setTimeout(() => setRenderedApp(null), 520);
      return () => clearTimeout(t);
    }
  }, [app]);

  useEffect(() => {
    if (!renderedApp) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [renderedApp, onClose]);

  if (!renderedApp) return null;

  return (
    <div
      className={`cs-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cs-panel">
        <div className="cs-head">
          <div className="crumbs">
            Work <span className="sl">//</span> Case {renderedApp.index} <span className="sl">//</span>{' '}
            <span style={{ color: 'var(--text)' }}>{renderedApp.name}</span>
          </div>
          <div className="x" onClick={onClose} aria-label="Close">✕</div>
        </div>
        <div className="cs-body">
          <CaseStudyLayout app={renderedApp} isOpen={isOpen} />
        </div>
      </div>
    </div>);
}

function CaseStudyLayout({ app, isOpen }) {
  const Screen = window[app.screen];
  const gallery = (app.mockups && app.mockups.length > 0) ? app.mockups : null;
  const [active, setActive] = useState(0);

  useEffect(() => { setActive(0); }, [app.id]);

  return (
    <div className={`cs-layout ${isOpen ? 'in' : ''}`}>
      <div className="cs-title-row" style={{ '--cs-d': '30ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {app.icon && <img src={app.icon} alt={app.name} style={{ width: '90px', height: '90px', borderRadius: '14px', flexShrink: 0 }} />}
          <h2>{app.name}<span className="dot">.</span></h2>
        </div>
      </div>

      <div className="cs-grid">
        <div className="cs-col cs-col-left">
          <section className="cs-card cs-info" style={{ '--cs-d': '80ms' }}>
            <div className="cs-card-head"><span className="cs-eyebrow">// info</span></div>
            <div className="cs-tagline">{app.one}</div>
            <ul className="cs-info-list">
              <li><span className="k">Platform</span><span className="v">iOS · Native</span></li>
              <li><span className="k">Year</span><span className="v">{app.year}</span></li>
              <li><span className="k">Role</span><span className="v">{app.role}</span></li>
              <li><span className="k">Status</span><span className="v">{app.statusLabel}</span></li>
            </ul>
          </section>

          <section className="cs-card cs-numbers" style={{ '--cs-d': '130ms' }}>
            <div className="cs-card-head"><span className="cs-eyebrow">// numbers</span></div>
            <div className="cs-numbers-grid">
              {app.metrics.map((m, i) => (
                <div key={i} className="cs-num-cell">
                  <div className="cs-num-v">{m.v}</div>
                  <div className="cs-num-k">{m.k}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="cs-card cs-overview" style={{ '--cs-d': '180ms' }}>
            <div className="cs-card-head"><span className="cs-eyebrow">// overview &amp; stack</span></div>
            {app.overview.map((p, i) => <p key={i}>{p}</p>)}
            <div className="cs-stack">
              {app.stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </section>
        </div>

        <div className="cs-col cs-col-right">
          <CaseGallery
            gallery={gallery}
            active={active}
            setActive={setActive}
            Screen={Screen}
            tint={app.tint}
            appName={app.name} />

          <section className="cs-card cs-features-card" style={{ '--cs-d': '260ms' }}>
            <div className="cs-card-head"><span className="cs-eyebrow">// features</span></div>
            <ul className="cs-features-list">
              {app.features.map((f, i) => (
                <li key={i}>
                  <span className="num">0{i + 1}</span>
                  <span className="t">{f.t}</span>
                  <span className="d">{f.d}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>);
}

function CaseGallery({ gallery, active, setActive, Screen, tint, appName }) {
  if (!gallery) {
    return (
      <div className="cs-gallery cs-gallery-empty" style={{ '--cs-d': '200ms', '--cs-tint': tint || 'var(--accent-glow)' }}>
        <div className="cs-gallery-main is-device">
          <div className="cs-gallery-tint" />
          <div className="cs-phone-wrap">
            <IOSDevice width={300} height={648} dark={false}>
              {Screen ? <Screen /> : null}
            </IOSDevice>
          </div>
        </div>
      </div>);
  }

  const thumbs = gallery;
  const big = gallery[active % gallery.length];

  return (
    <div className="cs-gallery" style={{ '--cs-d': '200ms', '--cs-tint': tint || 'var(--accent-glow)' }}>
      <div className="cs-gallery-main" style={{ '--cs-d': '220ms' }}>
        <div className="cs-gallery-tint" />
        <img
          key={big}
          src={big}
          alt={`${appName} mockup`}
          className="cs-gallery-main-img" />
        <div className="cs-gallery-counter">
          {String((active % gallery.length) + 1).padStart(2, '0')} <span>/ {String(gallery.length).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="cs-gallery-thumbs">
        {thumbs.map((src, i) => {
          const galleryIdx = i % gallery.length;
          const isActive = galleryIdx === active % gallery.length;
          return (
            <button
              key={i}
              type="button"
              className={`cs-thumb cs-thumb-${i} ${isActive ? 'active' : ''}`}
              style={{ '--cs-d': `${200 + i * 50}ms` }}
              onClick={() => setActive(galleryIdx)}
              aria-label={`Show mockup ${galleryIdx + 1}`}>
              <img src={src} alt="" />
            </button>);
        })}
      </div>
    </div>);
}

window.App = App;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);