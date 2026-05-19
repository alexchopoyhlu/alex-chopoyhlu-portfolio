// code-ripple.jsx — ASCII ripple/dome canvas
// Renders concentric arcs of monospace glyphs emanating from a centre point.
// Drop into a positioned container; size + color are controllable.

function CodeRipple({ color = '#f97316', size = 720, paused = false, speed = 1, originX = 0.5, originY = 1.02 }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // glyph alphabet — sparse → dense
    const chars = ['.', '+', 'x', '+', 'x', 'X', 'S', 's', '#', '@', '8', '0'];

    const charW = 10;
    const charH = 11;
    const cols = Math.floor(size / charW);
    const rows = Math.floor(size / charH);

    // parse hex → rgb
    const hex = (color || '#f97316').replace('#', '');
    const r0 = parseInt(hex.slice(0, 2), 16);
    const g0 = parseInt(hex.slice(2, 4), 16);
    const b0 = parseInt(hex.slice(4, 6), 16);

    // ripple origin — configurable. Bottom-right by default would be (1, 1)
    const cx = cols * originX;
    const cy = rows * originY;

    // max radius from origin to furthest visible corner
    const corners = [
      Math.hypot(cx, cy),
      Math.hypot(cols - cx, cy),
      Math.hypot(cx, rows - cy),
      Math.hypot(cols - cx, rows - cy),
    ];
    const maxR = Math.max(...corners) * 0.95;
    const fadeStart = maxR * 0.45;

    let raf = null;
    let time = 0;
    let last = 0;

    const draw = (t) => {
      if (paused) { raf = requestAnimationFrame(draw); return; }
      const dt = last ? Math.min(50, t - last) : 16;
      last = t;
      time += dt * 0.00065 * speed;

      ctx.clearRect(0, 0, size, size);
      ctx.font = `${charW}px "JetBrains Mono", "SF Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dx = (x - cx);
          const dy = (y - cy) * 1.05;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxR) continue;

          // travelling wave outward from centre
          const phase = dist * 0.34 - time * 2.1;
          const wave = Math.sin(phase);
          let intensity = Math.max(0, wave);

          // soft falloff toward edge of the dome — quadratic so outer ripples dim
          const falloff = dist > fadeStart
            ? Math.max(0, 1 - (dist - fadeStart) / (maxR - fadeStart))
            : 1;
          intensity *= Math.pow(falloff, 1.8);

          // edge feather — fade out glyphs near canvas rectangle boundary
          // so we don't get a hard rectangular cutoff
          const edgePad = 10; // cells
          const edgeFadeX = Math.min(x, cols - 1 - x) / edgePad;
          const edgeFadeY = Math.min(y, rows - 1 - y) / edgePad;
          const edgeFade = Math.min(1, edgeFadeX, edgeFadeY);
          intensity *= Math.max(0, edgeFade);

          if (intensity < 0.07) continue;

          // pick glyph based on intensity
          const idx = Math.min(chars.length - 1, Math.floor(intensity * chars.length));
          const ch = chars[idx];

          const alpha = Math.min(1, intensity * 1.25);
          ctx.fillStyle = `rgba(${r0}, ${g0}, ${b0}, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, x * charW + charW / 2, y * charH + charH / 2);

          // small bloom on the densest cells
          if (intensity > 0.65) {
            ctx.fillStyle = `rgba(${Math.min(255, r0 + 40)}, ${Math.min(255, g0 + 30)}, ${Math.min(255, b0 + 20)}, ${(alpha * 0.5).toFixed(3)})`;
            ctx.fillText(ch, x * charW + charW / 2, y * charH + charH / 2);
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [color, size, paused, speed, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: size, height: size, pointerEvents: 'none' }}
    />
  );
}

window.CodeRipple = CodeRipple;
