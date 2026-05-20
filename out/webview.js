"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = getWebviewContent;
function getWebviewContent(nonce, cspSource, media) {
    const { themeUri, saberUri, breathingUri, rageUri } = media;
    return /*html*/ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 style-src ${cspSource} 'nonce-${nonce}';
                 script-src 'nonce-${nonce}';
                 media-src ${cspSource} blob:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style nonce="${nonce}">
    * { margin:0; padding:0; box-sizing:border-box; }

    body {
      background: transparent;
      display: flex; flex-direction: column; align-items: center;
      font-family: var(--vscode-font-family, 'Segoe UI', sans-serif);
      color: var(--vscode-foreground);
      overflow-x: hidden; overflow-y: auto; padding: 8px 10px 14px;
    }

    /* ─── CONTROLS GRID ─── */
    .controls-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 5px; width: 100%; margin-bottom: 10px;
    }
    .ctrl-btn {
      display: flex; align-items: center; justify-content: center; gap: 5px;
      padding: 6px 8px;
      background: var(--vscode-editorWidget-background, #1e1e1e);
      border: 1px solid var(--vscode-editorWidget-border, #454545);
      border-radius: 20px; cursor: pointer; font-size: 10px;
      color: var(--vscode-foreground);
      transition: border-color 0.25s, background 0.25s; user-select: none;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .ctrl-btn:hover { border-color: #aa0000; }
    .ctrl-btn.active { border-color: #ff0000; background: #1a0000; }
    .toggle-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #555;
      flex-shrink: 0; transition: background 0.25s, box-shadow 0.25s;
    }
    .ctrl-btn.active .toggle-dot { background: #ff0000; box-shadow: 0 0 5px #ff0000; }

    /* ─── VADER SCENE ─── */
    .vader-scene {
      position: relative;
      width: calc(100% - 8px);
      max-width: 200px;
      aspect-ratio: 230 / 322;
      margin: 0 auto 4px;
    }

    /* ─── BREATHING ─── */
    @keyframes breathe {
      0%,100% { transform: scaleY(1) translateY(0); }
      50%      { transform: scaleY(1.016) translateY(-1.5px); }
    }
    .vader-body { animation: breathe 3.5s ease-in-out infinite; transform-origin: bottom center; }

    .vader-figure {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      overflow: visible;
      filter: drop-shadow(0 8px 24px #00000099);
    }

    /* ─── RED GLOW EYES ─── */
    @keyframes eyeGlow {
      0%,88%,100% { opacity:1; }
      93%         { opacity:0.05; }
    }
    .eye-glow { animation: eyeGlow 6s ease-in-out infinite; }

    /* ─── CHEST BLINK ─── */
    @keyframes chestBlink  { 0%,94%,100%{opacity:1;} 96%{opacity:0;} }
    @keyframes chestBlink2 { 0%,90%,100%{opacity:1;} 92%{opacity:0;} }
    .chest-red  { animation: chestBlink  7.3s ease-in-out infinite; }
    .chest-blue { animation: chestBlink2 5.1s ease-in-out infinite; }

    /* ─── CAPE SWAY ─── */
    @keyframes capeSway {
      0%,100%{transform:skewX(0deg);}
      30%    {transform:skewX(-1.5deg);}
      70%    {transform:skewX(1deg);}
    }
    .cape { animation: capeSway 5s ease-in-out infinite; transform-origin: top center; }

    /* ─── LIGHTSABER ─── */
    .saber-wrap {
      transform-box: fill-box;
      transform-origin: 51% 87%;
    }
    @keyframes saberIdle  { 0%,100%{transform:rotate(-4deg);} 50%{transform:rotate(-7deg);} }
    @keyframes saberSwing {
      0%  {transform:rotate(-5deg);}
      12% {transform:rotate(-130deg);}
      28% {transform:rotate(15deg);}
      44% {transform:rotate(-100deg) scaleX(-1);}
      60% {transform:rotate(-5deg);}
      100%{transform:rotate(-5deg);}
    }
    .saber-wrap          { animation: saberIdle  4s   ease-in-out infinite; }
    .saber-wrap.swinging { animation: saberSwing 1.1s cubic-bezier(.4,0,.2,1) forwards; }
    @keyframes bladeHum {
      0%,100%{ filter:drop-shadow(0 0 9px #ff2200) drop-shadow(0 0 22px #ff000077); }
      50%    { filter:drop-shadow(0 0 14px #ff3300) drop-shadow(0 0 38px #ff0000aa); }
    }
    .blade-group { animation: bladeHum 0.85s ease-in-out infinite alternate; }

    /* ─── QUOTE BUBBLE ─── */
    .quote-wrap {
      width:100%; max-width:260px; min-height:58px;
      margin-top:6px; padding:11px 14px;
      background:var(--vscode-editorWidget-background,#1a1a1a);
      border:1px solid var(--vscode-editorWidget-border,#3a3a3a);
      border-left:3px solid #cc0000; border-radius:6px;
      font-size:12px; line-height:1.55;
      opacity:0; transform:translateY(7px);
      transition:opacity 0.45s ease, transform 0.45s ease;
      position:relative;
    }
    .quote-wrap.visible { opacity:1; transform:translateY(0); }
    .quote-wrap::before {
      content:\'\'; position:absolute; top:-7px; left:50%; transform:translateX(-50%);
      border-left:7px solid transparent; border-right:7px solid transparent;
      border-bottom:7px solid var(--vscode-editorWidget-border,#3a3a3a);
    }
    .quote-text { font-style:italic; color:var(--vscode-foreground,#ccc); }
    .quote-ctx  { margin-top:5px; font-size:9.5px; opacity:0.45; text-align:right; }

    /* ─── BREATH BAR ─── */
    @keyframes breathPulse {
      0%,100%{opacity:0.2; letter-spacing:3px;}
      50%    {opacity:0.7; letter-spacing:5px;}
    }
    .breath-bar {
      margin-top:10px; font-size:9.5px; opacity:0.3;
      color:var(--vscode-descriptionForeground);
      animation: breathPulse 3.5s ease-in-out infinite;
    }

    /* ─── SHAKE ─── */
    @keyframes shake {
      0%,100%{transform:translateX(0);}
      15%{transform:translateX(-4px) rotate(-.8deg);}
      30%{transform:translateX( 4px) rotate( .8deg);}
      45%{transform:translateX(-3px);}
      60%{transform:translateX( 3px);}
      75%{transform:translateX(-1px);}
    }
    .shaking { animation: shake 0.55s ease-in-out; }

    /* ─── PARTICLES ─── */
    @keyframes ptUp {
      0%  {transform:translateY(0) scale(1); opacity:0.7;}
      100%{transform:translateY(-80px) scale(0); opacity:0;}
    }
    .particles {
      position:absolute; bottom:0; left:0; right:0;
      height:100%; pointer-events:none; overflow:hidden;
    }
    .pt {
      position:absolute; bottom:0; width:3px; height:3px;
      background:#ff000055; border-radius:50%;
      animation: ptUp var(--dur,3s) ease-out var(--delay,0s) infinite;
    }

    /* ─── COPILOT BADGE ─── */
    @keyframes copilotPulse {
      0%,100%{opacity:0.6; transform:scale(1);}
      50%    {opacity:1;   transform:scale(1.08);}
    }
    .copilot-badge {
      display:none; align-items:center; gap:5px;
      margin-top:6px; padding:3px 9px;
      border:1px solid #7755ff; border-radius:12px;
      font-size:10px; color:#9977ff;
      animation: copilotPulse 1.2s ease-in-out infinite;
    }
    .copilot-badge.active { display:flex; }
    .copilot-dot { width:5px; height:5px; border-radius:50%; background:#9977ff; }

    /* ─── RAGE MODE (multi-level state machine) ─── */
    /* Level 1 — Irritated: subtle, no shake, amber accent */
    body.rage-1 .eye-glow { animation: eyeGlow 3s ease-in-out infinite; filter: drop-shadow(0 0 4px #ff3300); }
    body.rage-1 .quote-wrap { border-left-color:#cc9900; box-shadow:0 0 8px #cc990022; }

    /* Level 2 — Angry: current rage behaviour */
    @keyframes ragePulse {
      0%,100% { background: transparent; }
      50%     { background: rgba(200,0,0,0.08); }
    }
    @keyframes rageEye {
      0%,100% { opacity:1; }
      20%     { opacity:0.05; }
      40%     { opacity:1; filter:brightness(2.5) drop-shadow(0 0 10px #ff0000); }
      60%     { opacity:0.1; }
      80%     { opacity:1; filter:brightness(3); }
    }
    @keyframes rageShake {
      0%,100%{transform:translateX(0);}
      10%{transform:translateX(-5px) rotate(-1deg);}
      30%{transform:translateX(5px) rotate(1deg);}
      50%{transform:translateX(-4px);}
      70%{transform:translateX(4px);}
      90%{transform:translateX(-2px);}
    }
    body.rage-2 { animation: ragePulse 0.5s ease-in-out infinite; }
    body.rage-2 .vader-body { animation: rageShake 0.3s ease-in-out infinite; }
    body.rage-2 .eye-glow { animation: rageEye 0.35s ease-in-out infinite; }
    body.rage-2 .quote-wrap { border-left-color:#ff2200; box-shadow:0 0 14px #ff000033; }

    /* Level 3 — The Dark Side: harder, faster, unstable blade */
    @keyframes sithPulse {
      0%,100% { background: rgba(120,0,0,0.05); }
      50%     { background: rgba(220,0,0,0.16); }
    }
    @keyframes unstableBlade {
      0%,100% { filter:drop-shadow(0 0 11px #ff2200) drop-shadow(0 0 26px #ff000099); }
      20%     { filter:drop-shadow(0 0 18px #ff5500) drop-shadow(0 0 40px #ff0000cc) hue-rotate(-8deg); }
      45%     { filter:drop-shadow(0 0 8px  #ff0000) drop-shadow(0 0 18px #aa0000aa); }
      70%     { filter:drop-shadow(0 0 22px #ff6600) drop-shadow(0 0 48px #ff0000) hue-rotate(6deg); }
    }
    body.rage-3 { animation: sithPulse 0.3s ease-in-out infinite; }
    body.rage-3 .vader-body { animation: rageShake 0.18s ease-in-out infinite; }
    body.rage-3 .eye-glow { animation: rageEye 0.22s ease-in-out infinite; filter: brightness(3.5); }
    body.rage-3 .blade-group { animation: unstableBlade 0.4s ease-in-out infinite alternate; }
    body.rage-3 .quote-wrap { border-left-color:#ff0000; box-shadow:0 0 22px #ff000077; }

    /* Saturation state: contained overwhelming power (30pts cap reached) */
    body.rage-3.saturated { animation: sithPulse 0.9s ease-in-out infinite; }
    body.rage-3.saturated .vader-body { animation: rageShake 0.28s ease-in-out infinite; }
    body.rage-3.saturated .eye-glow { animation: rageEye 1.2s ease-in-out infinite; filter: brightness(4); }
    body.rage-3.saturated .blade-group { animation: unstableBlade 0.7s ease-in-out infinite alternate; }

    .rage-badge {
      display:none; align-items:center; gap:5px;
      margin-top:5px; padding:3px 10px;
      border:1px solid #ff2200; border-radius:12px;
      font-size:10px; color:#ff4422; letter-spacing:1px;
      animation: copilotPulse 0.5s ease-in-out infinite;
      transition: border-color 0.3s, color 0.3s, box-shadow 0.3s;
    }
    .rage-badge.active { display:flex; }
    .rage-badge.level-1 { border-color:#cc9900; color:#e0b020; }
    .rage-badge.level-2 { border-color:#ff2200; color:#ff4422; }
    .rage-badge.level-3 { border-color:#ff0000; color:#ff5544; box-shadow:0 0 12px #ff000099; animation: copilotPulse 0.35s ease-in-out infinite; }
    .rage-dot { width:5px; height:5px; border-radius:50%; background:#ff2200; transition: background 0.3s; }
    .rage-badge.level-1 .rage-dot { background:#e0b020; }
    .rage-badge.level-3 .rage-dot { background:#ff0000; box-shadow:0 0 6px #ff0000; }

    /* ─── TRANSITION ANIMATIONS (asymmetric: sharp up, slow down) ─── */
    /* Escalation — 0.42s, sharp, violent burst */
    @keyframes escalateFlash {
      0%   { background: rgba(255,40,0,0.30); }
      50%  { background: rgba(255,20,0,0.14); }
      100% { background: transparent; }
    }
    @keyframes escalateEye {
      0%   { filter: brightness(7) drop-shadow(0 0 24px #ff0000); opacity:1; }
      35%  { filter: brightness(4) drop-shadow(0 0 14px #ff2200); opacity:1; }
      100% { filter: none; opacity:1; }
    }
    @keyframes escalateBlade {
      0%   { filter: drop-shadow(0 0 34px #ff7700) drop-shadow(0 0 70px #ff0000dd) brightness(2.2); }
      40%  { filter: drop-shadow(0 0 18px #ff4400) drop-shadow(0 0 40px #ff0000bb); }
      100% { filter: drop-shadow(0 0 9px  #ff2200) drop-shadow(0 0 22px #ff000077); }
    }
    @keyframes escalateTwitch {
      0%,100% { transform: translateX(0) rotate(0); }
      12%     { transform: translateX(-9px) rotate(-1.8deg); }
      28%     { transform: translateX(9px)  rotate(1.8deg); }
      44%     { transform: translateX(-6px); }
      68%     { transform: translateX(5px); }
      84%     { transform: translateX(-2px); }
    }
    body.escalating              { animation: escalateFlash  0.42s ease-out forwards !important; }
    body.escalating .eye-glow    { animation: escalateEye    0.42s ease-out forwards !important; }
    body.escalating .blade-group { animation: escalateBlade  0.42s ease-out forwards !important; }
    body.escalating .vader-body  { animation: escalateTwitch 0.38s ease-in-out forwards !important; }

    /* De-escalation — 1.05s, slow exhale, controlled fade */
    @keyframes deescalateExhale {
      0%   { background: rgba(180,0,0,0.14); }
      40%  { background: rgba(90,0,0,0.07); }
      100% { background: transparent; }
    }
    @keyframes deescalateEye {
      0%   { filter: brightness(3.5) drop-shadow(0 0 10px #ff3300); }
      60%  { filter: brightness(1.8) drop-shadow(0 0 5px #ff220044); }
      100% { filter: none; }
    }
    @keyframes deescalateBlade {
      0%   { filter: drop-shadow(0 0 16px #ff4400) drop-shadow(0 0 38px #ff0000aa); }
      100% { filter: drop-shadow(0 0 9px  #ff2200) drop-shadow(0 0 22px #ff000077); }
    }
    @keyframes deescalateSettle {
      0%   { transform: translateX(-4px) rotate(-0.6deg); }
      30%  { transform: translateX(2.5px) rotate(0.4deg); }
      60%  { transform: translateX(-1.5px); }
      80%  { transform: translateX(0.8px); }
      100% { transform: translateX(0); }
    }
    body.deescalating              { animation: deescalateExhale  1.05s ease-out forwards !important; }
    body.deescalating .eye-glow    { animation: deescalateEye     1.05s ease-out forwards !important; }
    body.deescalating .blade-group { animation: deescalateBlade   1.05s ease-out forwards !important; }
    body.deescalating .vader-body  { animation: deescalateSettle  0.85s ease-out forwards !important; }

    /* ─── DARK SIDE METRICS PANEL ─── */
    .metrics-divider {
      width:100%; max-width:260px; height:1px;
      background:linear-gradient(90deg, transparent, #551111, transparent);
      margin:14px auto 10px;
    }
    .metrics-panel {
      width:100%; max-width:260px;
      padding:8px 14px 10px;
      background:rgba(40,8,8,0.55);
      border:1px solid #3a1010;
      border-radius:5px;
      opacity:1; transition:opacity 0.3s;
      font-size:10px;
    }
    .metrics-panel:hover { opacity:1; }
    .metrics-title {
      font-size:9px; letter-spacing:1.6px; color:#ff4400;
      margin-bottom:8px; text-transform:uppercase;
    }
    .metrics-row {
      display:flex; justify-content:space-between; align-items:baseline;
      padding:4px 0; border-bottom:1px solid #2a1010;
    }
    .metrics-row:last-child { border-bottom:none; }
    .metrics-label {
      color:#888; font-size:9.5px; letter-spacing:0.3px;
    }
    .metrics-value {
      color:#dd6644; text-align:right;
      font-size:10px; font-variant-numeric:tabular-nums;
      transition:color 0.4s, text-shadow 0.4s;
    }
    .metrics-value.state-1 { color:#e0b020; text-shadow:0 0 6px #cc990055; }
    .metrics-value.state-2 { color:#ff4411; text-shadow:0 0 8px #ff220055; }
    .metrics-value.state-3 { color:#ff2200; text-shadow:0 0 12px #ff000088; }
  </style>
</head>
<body>

  <!-- CONTROLS: 2x2 grid -->
  <div class="controls-grid">
    <div class="ctrl-btn" id="musicToggle">
      <div class="toggle-dot"></div>
      <span id="musicLabel">🎵 Dark March</span>
    </div>
    <div class="ctrl-btn" id="breathToggle">
      <div class="toggle-dot"></div>
      <span id="breathLabel">🌬️ Breathing</span>
    </div>
    <div class="ctrl-btn" id="saberToggle">
      <div class="toggle-dot"></div>
      <span id="saberLabel">⚔️ Saber</span>
    </div>
    <div class="ctrl-btn" id="rageAudioToggle">
      <div class="toggle-dot"></div>
      <span id="rageSoundLabel">⚠️ Rage Alarm</span>
    </div>
  </div>

  <!-- AUDIO: preload="auto" buffers all sounds when the panel opens -->
  <audio id="themeAudio" loop preload="auto">
    <source src="${themeUri}" type="audio/mpeg">
  </audio>
  <audio id="saberAudio" preload="auto">
    <source src="${saberUri}" type="audio/mpeg">
  </audio>
  <audio id="breathAudio" loop preload="auto">
    <source src="${breathingUri}" type="audio/mpeg">
  </audio>
  <audio id="rageAudio" loop preload="auto">
    <source src="${rageUri}" type="audio/mpeg">
  </audio>

  <!-- VADER SCENE -->
  <div class="vader-scene" id="vaderScene">
    <div class="particles" id="particles"></div>

    <!-- ─── VADER SVG FIGURE ─── -->
    <svg class="vader-figure vader-body" viewBox="0 0 230 322" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="helmetGrad" cx="45%" cy="38%" r="60%">
          <stop offset="0%"   stop-color="#3a3a3a"/>
          <stop offset="100%" stop-color="#111"/>
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stop-color="#2a2a2a"/>
          <stop offset="100%" stop-color="#111"/>
        </radialGradient>
        <filter id="strongGlow">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- CAPE -->
      <g class="cape">
        <path d="M42,138 Q28,190 22,310 L168,310 Q162,190 148,138 Z" fill="#0f0f0f" stroke="#1a1a1a" stroke-width="0.5"/>
        <path d="M42,125 Q32,145 24,310 L60,310 Q56,210 52,165 Q48,140 48,130 Z" fill="#141414"/>
        <path d="M148,125 Q158,145 166,310 L130,310 Q134,210 138,165 Q142,140 142,130 Z" fill="#141414"/>
        <path d="M60,140 Q58,210 55,310" fill="none" stroke="#222" stroke-width="0.7" opacity="0.6"/>
        <path d="M130,140 Q132,210 135,310" fill="none" stroke="#222" stroke-width="0.7" opacity="0.6"/>
      </g>

      <!-- PAULDRONS -->
      <path d="M36,122 Q30,128 28,142 Q30,148 48,146 Q58,144 60,138 Q56,122 50,118 Z" fill="url(#bodyGrad)" stroke="#333" stroke-width="0.8"/>
      <path d="M154,122 Q160,128 162,142 Q160,148 142,146 Q132,144 130,138 Q134,122 140,118 Z" fill="url(#bodyGrad)" stroke="#333" stroke-width="0.8"/>

      <!-- TORSO -->
      <rect x="48" y="132" width="94" height="88" rx="10" fill="url(#bodyGrad)" stroke="#333" stroke-width="0.8"/>
      <path d="M49,140 Q49,132 58,132 L132,132 Q141,132 141,140" fill="none" stroke="#3a3a3a" stroke-width="1"/>

      <!-- LIFE-SUPPORT BOX -->
      <rect x="62" y="148" width="66" height="52" rx="5" fill="#0d0d0d" stroke="#3a3a3a" stroke-width="0.8"/>
      <rect x="64" y="150" width="62" height="48" rx="4" fill="#0a0a0a" stroke="#252525" stroke-width="0.5"/>
      <rect x="68" y="156" width="14" height="6" rx="2" fill="#aa0000" stroke="#cc0000" stroke-width="0.5"/>
      <rect x="68" y="165" width="14" height="6" rx="2" fill="#003399" stroke="#0055cc" stroke-width="0.5"/>
      <rect x="68" y="174" width="14" height="6" rx="2" fill="#224422" stroke="#336633" stroke-width="0.5"/>
      <rect x="68" y="183" width="14" height="6" rx="2" fill="#333" stroke="#444" stroke-width="0.5"/>
      <rect class="chest-red"  x="68" y="156" width="14" height="6" rx="2" fill="#ff2200" opacity="0.7"/>
      <rect class="chest-blue" x="68" y="165" width="14" height="6" rx="2" fill="#0066ff" opacity="0.7"/>
      <rect x="86" y="156" width="36" height="34" rx="3" fill="#111" stroke="#2a2a2a" stroke-width="0.5"/>
      <line x1="88" y1="162" x2="120" y2="162" stroke="#2a3a2a" stroke-width="0.8"/>
      <line x1="88" y1="168" x2="120" y2="168" stroke="#2a3a2a" stroke-width="0.8"/>
      <line x1="88" y1="174" x2="120" y2="174" stroke="#2a3a2a" stroke-width="0.8"/>
      <line x1="88" y1="180" x2="120" y2="180" stroke="#2a3a2a" stroke-width="0.8"/>
      <circle cx="92" cy="159" r="1.5" fill="#00ff00" opacity="0.5"/>
      <circle cx="97" cy="159" r="1.5" fill="#ff6600" opacity="0.5"/>
      <circle cx="102" cy="159" r="1.5" fill="#ffff00" opacity="0.4"/>
      <rect x="88" y="185" width="14" height="5" rx="1.5" fill="#1a2a1a" stroke="#2a4a2a" stroke-width="0.5"/>
      <rect x="105" y="185" width="14" height="5" rx="1.5" fill="#2a1a1a" stroke="#4a2a2a" stroke-width="0.5"/>

      <!-- BELT -->
      <rect x="48" y="218" width="94" height="14" rx="4" fill="#1a1a1a" stroke="#333" stroke-width="0.8"/>
      <rect x="52" y="220" width="18" height="8" rx="2" fill="#222" stroke="#383838" stroke-width="0.5"/>
      <rect x="73" y="220" width="18" height="8" rx="2" fill="#222" stroke="#383838" stroke-width="0.5"/>
      <rect x="120" y="220" width="18" height="8" rx="2" fill="#222" stroke="#383838" stroke-width="0.5"/>
      <rect x="84" y="219" width="22" height="12" rx="3" fill="#1c1c1c" stroke="#3a3a3a" stroke-width="0.7"/>

      <!-- ARMS -->
      <rect x="24" y="134" width="26" height="64" rx="8" fill="url(#bodyGrad)" stroke="#2a2a2a" stroke-width="0.5" transform="rotate(4,37,134)"/>
      <rect x="26" y="192" width="22" height="38" rx="7" fill="#111" stroke="#222" stroke-width="0.5" transform="rotate(6,37,192)"/>
      <rect x="27" y="225" width="20" height="14" rx="5" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="0.5" transform="rotate(6,37,225)"/>
      <rect x="140" y="134" width="26" height="64" rx="8" fill="url(#bodyGrad)" stroke="#2a2a2a" stroke-width="0.5" transform="rotate(-4,153,134)"/>
      <rect x="142" y="192" width="22" height="38" rx="7" fill="#111" stroke="#222" stroke-width="0.5" transform="rotate(-6,153,192)"/>
      <rect x="143" y="225" width="20" height="14" rx="5" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="0.5" transform="rotate(-6,153,225)"/>

      <!-- LEGS -->
      <rect x="52" y="230" width="32" height="50" rx="7" fill="#141414" stroke="#222" stroke-width="0.5"/>
      <rect x="53" y="275" width="30" height="30" rx="5" fill="#111" stroke="#1a1a1a" stroke-width="0.5"/>
      <path d="M50,300 Q50,310 56,312 L84,312 Q88,310 87,300 Z" fill="#0a0a0a" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="106" y="230" width="32" height="50" rx="7" fill="#141414" stroke="#222" stroke-width="0.5"/>
      <rect x="107" y="275" width="30" height="30" rx="5" fill="#111" stroke="#1a1a1a" stroke-width="0.5"/>
      <path d="M103,300 Q103,310 106,312 L134,312 Q140,310 140,300 Z" fill="#0a0a0a" stroke="#1a1a1a" stroke-width="0.5"/>

      <!-- NECK -->
      <rect x="78" y="118" width="34" height="16" rx="4" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
      <ellipse cx="74"  cy="124" rx="4" ry="6" fill="#111" stroke="#2a2a2a" stroke-width="0.5"/>
      <ellipse cx="116" cy="124" rx="4" ry="6" fill="#111" stroke="#2a2a2a" stroke-width="0.5"/>

      <!-- HELMET -->
      <path d="M48,88 Q48,42 95,38 Q142,42 142,88 L140,106 Q120,116 95,118 Q70,116 50,106 Z"
            fill="url(#helmetGrad)" stroke="#2a2a2a" stroke-width="0.8"/>
      <path d="M62,60 Q95,44 128,60" fill="none" stroke="#3a3a3a" stroke-width="1.2" opacity="0.6"/>
      <path d="M78,40 Q95,36 112,40" fill="none" stroke="#2d2d2d" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="50"  cy="94" rx="7" ry="11" fill="#111" stroke="#2a2a2a" stroke-width="0.8"/>
      <ellipse cx="140" cy="94" rx="7" ry="11" fill="#111" stroke="#2a2a2a" stroke-width="0.8"/>
      <circle cx="50"  cy="91" r="2.5" fill="#0a0a0a" stroke="#222" stroke-width="0.5"/>
      <circle cx="140" cy="91" r="2.5" fill="#0a0a0a" stroke="#222" stroke-width="0.5"/>
      <path d="M48,88 Q44,100 50,114 Q56,118 64,118 Q54,110 50,100 Z" fill="#0f0f0f"/>
      <path d="M142,88 Q146,100 140,114 Q134,118 126,118 Q136,110 140,100 Z" fill="#0f0f0f"/>
      <path d="M60,85 Q65,75 95,73 Q125,75 130,85 L128,92 Q105,98 95,98 Q85,98 62,92 Z"
            fill="#0f0f0f" stroke="#1a1a1a" stroke-width="0.5"/>
      <path d="M62,86 Q95,82 128,86" fill="none" stroke="#1f1f1f" stroke-width="1.5"/>
      <path d="M68,87 L82,86 L82,94 L70,95 Z" fill="#050505"/>
      <path d="M108,86 L122,87 L120,95 L108,94 Z" fill="#050505"/>
      <g class="eye-glow" filter="url(#strongGlow)">
        <ellipse cx="75"  cy="90.5" rx="5" ry="3" fill="#ff2200" opacity="0.9"/>
        <ellipse cx="75"  cy="90.5" rx="3" ry="2" fill="#ff6644" opacity="0.8"/>
      </g>
      <g class="eye-glow" filter="url(#strongGlow)">
        <ellipse cx="115" cy="90.5" rx="5" ry="3" fill="#ff2200" opacity="0.9"/>
        <ellipse cx="115" cy="90.5" rx="3" ry="2" fill="#ff6644" opacity="0.8"/>
      </g>
      <path d="M91,93 L95,104 L99,93" fill="none" stroke="#1a1a1a" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M65,99 Q95,108 125,99 L126,112 Q105,120 95,120 Q85,120 64,112 Z" fill="#111" stroke="#1c1c1c" stroke-width="0.5"/>
      <path d="M73,100 Q72,106 72,110"  stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M78,101 Q77,107 77,112"  stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M83,102 Q82,108 82,114"  stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M88,103 Q87,109 87,115"  stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M93,103 Q93,109 93,116"  stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M98,103 Q98,109 98,115"  stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M103,102 Q103,108 103,114" stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M108,101 Q108,107 108,112" stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M113,100 Q113,106 114,110" stroke="#222" stroke-width="1" stroke-linecap="round"/>
      <path d="M72,103 Q95,105 117,103" fill="none" stroke="#1c1c1c" stroke-width="0.6"/>
      <path d="M72,107 Q95,109 117,107" fill="none" stroke="#1c1c1c" stroke-width="0.6"/>
      <path d="M73,111 Q95,113 117,111" fill="none" stroke="#1c1c1c" stroke-width="0.6"/>
      <path d="M70,116 Q95,122 120,116 L122,118 Q95,125 68,118 Z" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="0.5"/>
      <path d="M88,42 Q95,34 102,42 L102,68 Q95,65 88,68 Z" fill="#1c1c1c" stroke="#2a2a2a" stroke-width="0.5"/>

      <!-- LIGHTSABER embedded in SVG at saber-in-figure coords (152,58) -->
      <g class="saber-wrap" id="saberWrap" transform="translate(152, 58)">
        <rect x="32" y="148" width="13" height="52" rx="3.5" fill="#4a4a4a" stroke="#666" stroke-width="0.8"/>
        <rect x="30" y="153" width="17" height="4" rx="1.5" fill="#595959"/>
        <rect x="30" y="160" width="17" height="4" rx="1.5" fill="#595959"/>
        <rect x="30" y="167" width="17" height="4" rx="1.5" fill="#595959"/>
        <rect x="30" y="174" width="17" height="4" rx="1.5" fill="#595959"/>
        <rect x="27" y="146" width="23" height="5" rx="2" fill="#555" stroke="#777" stroke-width="0.5"/>
        <ellipse cx="38.5" cy="200" rx="8" ry="4.5" fill="#3a3a3a" stroke="#555" stroke-width="0.5"/>
        <circle cx="38.5" cy="157" r="3" fill="#cc0000" stroke="#ff2200" stroke-width="0.5"/>
        <circle cx="38.5" cy="157" r="1.5" fill="#ff4444"/>
        <g class="blade-group">
          <rect x="30" y="4" width="17" height="144" rx="8" fill="#ff0000" opacity="0.12"/>
          <rect x="34" y="4" width="9"  height="144" rx="4.5" fill="#cc0000" opacity="0.9"/>
          <rect x="35.5" y="4" width="6" height="144" rx="3" fill="#ff2200" opacity="0.8"/>
          <rect x="36.5" y="4" width="4" height="144" rx="2" fill="#ff6644" opacity="0.6"/>
          <rect x="37"   y="4" width="3" height="144" rx="1.5" fill="#ff9977" opacity="0.5"/>
          <rect x="37.5" y="4" width="2" height="144" rx="1" fill="#ffffff" opacity="0.3"/>
          <ellipse cx="38.5" cy="6" rx="4" ry="5" fill="#ff4422" opacity="0.8"/>
        </g>
      </g>
    </svg>
  </div>

  <div class="breath-bar">khhh &nbsp; phhh &nbsp; khhh &nbsp; phhh</div>

  <div class="copilot-badge" id="copilotBadge">
    <div class="copilot-dot"></div>
    <span>Copilot is generating...</span>
  </div>

  <div class="rage-badge" id="rageBadge">
    <div class="rage-dot"></div>
    <span id="rageBadgeText">⚠ RAGE MODE</span>
  </div>

  <div class="quote-wrap" id="quoteWrap">
    <div class="quote-text" id="quoteText"></div>
    <div class="quote-ctx"  id="quoteCtx"></div>
  </div>

  <div class="metrics-divider"></div>
  <div class="metrics-panel" id="metricsPanel">
    <div class="metrics-title">⚠ Dark Side Metrics</div>
    <div class="metrics-row">
      <span class="metrics-label">Current State</span>
      <span class="metrics-value" id="mCurrentState">Composed</span>
    </div>
    <div class="metrics-row">
      <span class="metrics-label">Highest Rage Today</span>
      <span class="metrics-value" id="mHighestRage">—</span>
    </div>
    <div class="metrics-row">
      <span class="metrics-label">Peace Streak</span>
      <span class="metrics-value" id="mPeaceStreak">—</span>
    </div>
    <div class="metrics-row">
      <span class="metrics-label">Today's Disturbances</span>
      <span class="metrics-value" id="mDisturbances">0</span>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode          = acquireVsCodeApi();
    const saberWrap       = document.getElementById('saberWrap');
    const quoteWrap       = document.getElementById('quoteWrap');
    const quoteText       = document.getElementById('quoteText');
    const quoteCtx        = document.getElementById('quoteCtx');
    const particlesEl     = document.getElementById('particles');
    const musicToggle     = document.getElementById('musicToggle');
    const musicLabel      = document.getElementById('musicLabel');
    const saberToggle     = document.getElementById('saberToggle');
    const saberLabel      = document.getElementById('saberLabel');
    const breathToggle    = document.getElementById('breathToggle');
    const breathLabel     = document.getElementById('breathLabel');
    const rageAudioToggle = document.getElementById('rageAudioToggle');
    const rageSoundLabel  = document.getElementById('rageSoundLabel');
    const copilotBadge    = document.getElementById('copilotBadge');
    const rageBadge       = document.getElementById('rageBadge');
    const rageBadgeText   = document.getElementById('rageBadgeText');
    const mCurrentState   = document.getElementById('mCurrentState');
    const mHighestRage    = document.getElementById('mHighestRage');
    const mPeaceStreak    = document.getElementById('mPeaceStreak');
    const mDisturbances   = document.getElementById('mDisturbances');
    const themeAudio      = document.getElementById('themeAudio');
    const saberAudio      = document.getElementById('saberAudio');
    const breathAudio     = document.getElementById('breathAudio');
    const rageAudio       = document.getElementById('rageAudio');

    themeAudio.volume  = 0.45;
    saberAudio.volume  = 1.0;
    breathAudio.volume = 0.3;
    rageAudio.volume   = 0.7;
    themeAudio.load();
    saberAudio.load();
    breathAudio.load();
    rageAudio.load();

    // ─── AUDIO STATE ───
    // Both breathing and rage alarm start OFF. Saber/march also start OFF.
    // Browser autoplay policy: play() is allowed from a user-gesture handler.
    // For rage audio (triggered via message, not a click), we "prime" it from
    // within the toggle click so the browser permits later programmatic play.
    let breathEnabled    = false;
    let rageAudioEnabled = false;
    let rageAudioPrimed  = false; // becomes true once primed from a click

    // ─── METRICS / STATE TRACKING ───
    let currentRageLevel = 0;     // mirrors extension-side _rageLevel
    let metricsStreakStart = 0;   // ms timestamp when Vader last hit Level 0

    // ═══ MUSIC TOGGLE ═══
    musicToggle.addEventListener('click', () => {
      if (themeAudio.paused) {
        themeAudio.play().catch(() => {});
        musicToggle.classList.add('active');
      } else {
        themeAudio.pause();
        themeAudio.currentTime = 0;
        musicToggle.classList.remove('active');
      }
    });

    // ═══ SABER SOUND ═══
    // Called inside a click-handler callstack → user gesture is active → play() is allowed.
    // After first gesture, timer-based swings also work (page has had interaction).
    function playSaberSound() {
      saberAudio.currentTime = 0;
      saberAudio.play().catch(() => {});
    }

    // Synth fallback in case MP3 doesn't load
    function playSaberSynth() {
      try {
        const ctx = new AudioContext();
        const now = ctx.currentTime, dur = 1.1;
        const hum = ctx.createOscillator(); hum.type = 'sawtooth';
        hum.frequency.setValueAtTime(120, now);
        hum.frequency.linearRampToValueAtTime(90, now + dur);
        const swng = ctx.createOscillator(); swng.type = 'sine';
        swng.frequency.setValueAtTime(800, now);
        swng.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        swng.frequency.exponentialRampToValueAtTime(620, now + 0.7);
        swng.frequency.exponentialRampToValueAtTime(120, now + dur);
        const gH = ctx.createGain(); gH.gain.setValueAtTime(0.07, now); gH.gain.linearRampToValueAtTime(0, now + dur);
        const gS = ctx.createGain();
        gS.gain.setValueAtTime(0, now); gS.gain.linearRampToValueAtTime(0.4, now + 0.08);
        gS.gain.linearRampToValueAtTime(0.2, now + 0.55); gS.gain.linearRampToValueAtTime(0, now + dur);
        const master = ctx.createGain(); master.gain.value = 0.6;
        hum.connect(gH); gH.connect(master);
        swng.connect(gS); gS.connect(master);
        master.connect(ctx.destination);
        hum.start(now); hum.stop(now + dur + 0.1);
        swng.start(now); swng.stop(now + dur + 0.1);
      } catch(e) {}
    }

    // ═══ PARTICLES ═══
    function spawnParticle() {
      const p = document.createElement('div'); p.className = 'pt';
      p.style.left = (Math.random() * 100) + '%';
      p.style.setProperty('--dur',   (2.5 + Math.random() * 3)   + 's');
      p.style.setProperty('--delay', (Math.random() * 2)          + 's');
      particlesEl.appendChild(p); setTimeout(() => p.remove(), 6000);
    }
    setInterval(spawnParticle, 900);

    // ═══ SABER SWING ═══
    function swingSaber() {
      if (!saberEnabled) return;                          // respect toggle
      if (saberWrap.classList.contains('swinging')) return;
      saberWrap.classList.add('swinging');
      playSaberSound();
      saberWrap.addEventListener('animationend', () => {
        saberWrap.classList.remove('swinging');
      }, { once: true });
    }

    // ═══ SABER BUTTON ═══
    let saberEnabled = false;
    saberToggle.addEventListener('click', () => {
      saberEnabled = !saberEnabled;
      if (saberEnabled) {
        saberToggle.classList.add('active');
        swingSaber();
      } else {
        saberToggle.classList.remove('active');
        saberAudio.pause();
        saberAudio.currentTime = 0;
      }
    });

    // ═══ BREATHING TOGGLE ═══
    breathToggle.addEventListener('click', () => {
      breathEnabled = !breathEnabled;
      if (breathEnabled) {
        breathToggle.classList.add('active');
        breathAudio.play().catch(() => {}); // inside click handler → always allowed
      } else {
        breathToggle.classList.remove('active');
        breathAudio.pause();
        breathAudio.currentTime = 0;
      }
    });

    // ═══ RAGE ALARM TOGGLE ═══
    rageAudioToggle.addEventListener('click', () => {
      rageAudioEnabled = !rageAudioEnabled;
      if (rageAudioEnabled) {
        rageAudioToggle.classList.add('active');
        // PRIME: play+immediately pause from within this click handler.
        // This grants the browser permission to play rageAudio programmatically
        // later (from the message handler) without a gesture.
        rageAudio.volume = 0;
        rageAudio.play().then(() => {
          rageAudio.pause();
          rageAudio.currentTime = 0;
          rageAudioPrimed = true;
          // If already in rage level 2+, start playback immediately
          if (document.body.classList.contains('rage-2') || document.body.classList.contains('rage-3')) {
            rageAudio.volume = document.body.classList.contains('rage-3') ? 0.85 : 0.7;
            rageAudio.play().catch(() => {});
          } else {
            rageAudio.volume = 0.7;
          }
        }).catch(() => {});
      } else {
        rageAudioToggle.classList.remove('active');
        rageAudio.pause();
        rageAudio.currentTime = 0;
        rageAudioPrimed = false;
      }
    });

    function scheduleSwing() {
      const ms = 18000 + Math.random() * 22000;
      setTimeout(() => { if (saberEnabled) swingSaber(); scheduleSwing(); }, ms);
    }
    scheduleSwing();

    // ═══ QUOTES ═══
    function showQuote(text, ctx) {
      quoteWrap.classList.remove('visible');
      setTimeout(() => {
        quoteText.textContent = '\u201c' + text + '\u201d';
        quoteCtx.textContent  = ctx || '';
        quoteWrap.classList.add('visible');
      }, 280);
    }
    function forceChoke() {
      document.body.classList.add('shaking');
      document.body.addEventListener('animationend',
        () => document.body.classList.remove('shaking'), { once: true });
      swingSaber();
    }

    // ═══ COPILOT BADGE ═══
    let copilotTimer = null;
    function showCopilotBadge(show) {
      if (show) {
        copilotBadge.classList.add('active');
        if (copilotTimer) clearTimeout(copilotTimer);
        copilotTimer = setTimeout(() => copilotBadge.classList.remove('active'), 8000);
      } else {
        copilotBadge.classList.remove('active');
      }
    }

    // ═══ MESSAGE HANDLER ═══
    window.addEventListener('message', event => {
      const m = event.data;
      switch (m.type) {
        case 'quote':      showQuote(m.text, m.context); break;
        case 'swing':      swingSaber(); break;
        case 'forceChoke': forceChoke(); showQuote(m.text, m.context); break;
        case 'copilot':    showCopilotBadge(m.active); if (m.text) showQuote(m.text, m.context); break;
        case 'rage': {
          // Multi-level emotional state machine: m.level is 0|1|2|3
          const level = (typeof m.level === 'number') ? m.level : (m.active ? 2 : 0);
          const prevLevel = currentRageLevel;
          const isEscalation = level > prevLevel;
          const isDeescalation = level < prevLevel;
          currentRageLevel = level;

          // Transition animation — sharp burst going up, slow exhale coming down
          document.body.classList.remove('escalating', 'deescalating');
          if (isEscalation && level > 0) {
            void document.body.offsetWidth; // restart animation if class re-added rapidly
            document.body.classList.add('escalating');
            setTimeout(() => document.body.classList.remove('escalating'), 460);
          } else if (isDeescalation) {
            void document.body.offsetWidth;
            document.body.classList.add('deescalating');
            setTimeout(() => document.body.classList.remove('deescalating'), 1100);
          }

          document.body.classList.remove('rage-1', 'rage-2', 'rage-3');
          rageBadge.classList.remove('level-1', 'level-2', 'level-3');
          if (level > 0) {
            document.body.classList.add('rage-' + level);
            rageBadge.classList.add('active', 'level-' + level);
            const labels = { 1: '⚠ IRRITATED', 2: '⚠ RAGE MODE', 3: '⚠ THE DARK SIDE' };
            rageBadgeText.textContent = labels[level] || '⚠ RAGE MODE';
            // Rage alarm audio: only at level 2+ on escalation
            if (level >= 2 && rageAudioEnabled && rageAudioPrimed && rageAudio.paused) {
              rageAudio.volume = level === 3 ? 0.85 : 0.7;
              rageAudio.currentTime = 0;
              rageAudio.play().catch(() => {});
            }
            // Stop alarm when dropping to L1
            if (level < 2) { rageAudio.pause(); rageAudio.currentTime = 0; }
          } else {
            rageBadge.classList.remove('active');
            document.body.classList.remove('saturated');
            rageAudio.pause();
            rageAudio.currentTime = 0;
          }
          updateMetricsState(level);
          break;
        }
        case 'rageSaturated':
          document.body.classList.toggle('saturated', !!m.active);
          break;
        case 'stats': {
          currentRageLevel = m.level || 0;
          metricsStreakStart = m.peaceStreakStart || 0;
          const rageNames = { 0: '—', 1: 'Irritated', 2: 'Rage Mode', 3: 'The Dark Side' };
          mHighestRage.textContent = rageNames[m.highestRage || 0] || '—';
          mDisturbances.textContent = String(m.disturbances || 0);
          updateMetricsState(currentRageLevel);
          updatePeaceStreak();
          break;
        }
      }
    });

    // ─── METRICS UI HELPERS ───
    const stateNames = { 0: 'Composed', 1: 'Irritated', 2: 'Rage Mode', 3: 'The Dark Side' };
    function updateMetricsState(level) {
      mCurrentState.textContent = stateNames[level] || 'Composed';
      mCurrentState.className = 'metrics-value' + (level > 0 ? ' state-' + level : '');
      updatePeaceStreak();
    }
    function updatePeaceStreak() {
      if (currentRageLevel !== 0 || !metricsStreakStart) {
        mPeaceStreak.textContent = '—';
        return;
      }
      const elapsedMs = Date.now() - metricsStreakStart;
      const totalMin = Math.floor(elapsedMs / 60000);
      if (totalMin < 1)      { mPeaceStreak.textContent = '< 1m'; }
      else if (totalMin < 60){ mPeaceStreak.textContent = totalMin + 'm'; }
      else                   { mPeaceStreak.textContent = Math.floor(totalMin / 60) + 'h ' + (totalMin % 60) + 'm'; }
    }
    setInterval(updatePeaceStreak, 30000);

    showQuote("I find your lack of skill... expected.", "You may approach");
  </script>
</body>
</html>`;
}
//# sourceMappingURL=webview.js.map