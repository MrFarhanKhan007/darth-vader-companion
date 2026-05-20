# Darth Vader Companion

> *"I find your lack of commits... disturbing."*

**Darth Vader lives in your VS Code sidebar.** He watches you code, drops arrogant Star Wars quotes on every editor event, breathes at you, ignites his lightsaber, and escalates through four emotional tiers when your error count gets out of hand — all the way to **The Dark Side**.

*Your coding session now has emotional consequences.*

---

## Demo 🎬

<p align="center">
  <img src="media/video_sample/vader_newPreview.gif" alt="Darth Vader Companion Demo" width="320" />
</p>

Vader lives in the sidebar, reacts to what you do, escalates when your diagnostics get ugly, and now keeps a small Dark Side metrics panel tracking the damage.

🔊 Full demo with audio: [Watch Demo](https://github.com/MrFarhanKhan007/darth_vader_vscode/releases/latest/download/vader_newDemo.mp4)

> Click the Vader helmet in the Activity Bar → enable sounds → code normally → break enough things to summon The Dark Side.

---

## Features ✨

### 🧠 4-Level Emotional State Machine

Vader doesn't just flip between calm and rage. He *builds*.

| Level | Badge | Trigger | Behaviour |
|-------|-------|---------|----------|
| 0 — Composed | — | Default | Normal quotes, ambient animations |
| 1 — Irritated | `⚠ IRRITATED` | Minor error spikes | Amber badge, slower eye glow, clipped quotes. No shake, no alarm. |
| 2 — Rage Mode | `⚠ RAGE MODE` | Sustained error bursts | Full body shake, red pulse, eye spasms, rage alarm (if on) |
| 3 — The Dark Side | `⚠ THE DARK SIDE` | Severe instability | Faster shake, unstable flickering lightsaber, deep red glow, Sith quotes |

**How it works:**
- Each qualifying error event adds **rage points** (4.5s cooldown between counted events)
- Level 2 and Level 3 each last a **maximum of 10 seconds**, then step down to Level 1
- Level 1 returns to calm only once **points decay below threshold** — faster when workspace is clean
- A **3-second grace window** after de-escalation absorbs stray errors so Vader doesn't bounce
- Every state change is animated — **sharp violent burst** going up, **slow controlled exhale** coming down
- Once Vader settles back, he speaks a **calming quote** to close the emotional arc ("The disturbance fades.")
- Keep accumulating errors past the **soft cap** and Vader hits saturation — animations slow to a heavy, contained stillness and a special quote fires once

### 📊 Dark Side Metrics

A subtle telemetry panel sits below the quote box, tracking your day with Vader:

- **Current State** — live tier indicator, glows in the tier's color
- **Highest Rage Today** — the worst he's been pushed since local midnight
- **Peace Streak** — how long you've held him at Composed
- **Today's Disturbances** — total error events that triggered him

Low-opacity by default, brightens on hover. Persists across VS Code reloads; resets each local day.

### 🎵 Four Independent Audio Controls

All **off by default** — turn on what you want:

| Button | Sound |
|---|---|
| 🎵 Dark March | Cinematic dark orchestral loop |
| 🌬️ Breathing | Vader's iconic breathing loop |
| ⚔️ Saber | Swing on click + random auto-swings every 18–40 s |
| ⚠️ Rage Alarm | Sci-fi alarm plays during Rage Mode and The Dark Side only |

### 🗣️ Quote Reactions

Vader reacts to **everything**:

| Event | What he does |
|---|---|
| Opening VS Code | Welcomes you to the dark side |
| Saving a file | Judges your commit discipline |
| Code errors | Clipped irritation → full rage → ceremonial Sith proclamations |
| Deleting code | Taunts your refactor |
| Running tests | Grudging praise or immediate mockery |
| Build fail | Notes your ambition, then your failure |
| GitHub Copilot generating | Badge pulses, snark quote fires |
| Idling 60 s | Reminds you he is still watching |
| …and many more | Save, open, terminal, debug, import, comment… |

### 🎭 Animations

- 🌬️ **Breathing** — chest rises and falls every 3.5 s
- 🔴 **Red eyes** — occasional power-fluctuation flicker; speed intensifies with rage tier
- 💡 **Chest armor** — red and blue lights blink on independent timers
- 🖤 **Cape** — subtle drift in the dark side wind
- ⚔️ **Saber** — slow idle rock; erratic unstable flicker at The Dark Side tier; random swing audio

---

## Installation 🚀

### From VS Code Marketplace

Search for **Darth Vader Companion** in the Extensions panel, or:

```
ext install mrfarhankhan007.darth-vader-companion
```

### From VSIX

```bash
code --install-extension mrfarhankhan007.darth-vader-companion-0.3.0.vsix --force
```

Then `Ctrl+Shift+P` → **Developer: Reload Window**

### From source

```bash
git clone https://github.com/MrFarhanKhan007/darth_vader_vscode
cd darth_vader_vscode
npm install
npx tsc -p ./
echo y | npx @vscode/vsce package --allow-missing-repository
code --install-extension darth-vader-companion-*.vsix --force
```

---

## Usage 🎮

1. Click the **Vader helmet icon** in the Activity Bar (left sidebar).
2. Toggle the sounds you want using the 2×2 control grid.
3. Code normally — Vader reacts automatically.
4. Accumulate errors and watch him escalate through the emotional tiers.

---

## Development 🛠️

```bash
npm install      # install dev dependencies
npx tsc -p ./    # compile TypeScript → out/
```

Press **F5** to launch an Extension Development Host. Edit → save → `Ctrl+R` in the host window to reload instantly.

---

## Project Structure 📁

```
darth-vader-vscode/
├── src/
│   ├── extension.ts   # Extension host, event listeners, emotional state machine
│   ├── webview.ts     # Sidebar panel — SVG Vader, audio, animations, rage visuals
│   └── quotes.ts      # 100+ contextual quotes
├── media/
│   ├── audio/         # Dark March, saber, breathing, rage alarm
│   ├── video_sample/  # Marketplace GIF + full demo video
│   └── images/        # Activity Bar icon
└── package.json
```

---

<details>
<summary>💭 What Could Come Next</summary>

- 🌘 **Language-aware quotes** — Python snark vs TypeScript lectures
- ⏳ **Pomodoro mode** — Vader enforces your work sessions
- 🧾 **Git blame quotes** — based on your last commit message
- 🏆 **Achievement system** — badges for clean builds and zero-error streaks
- 🎨 **Themes** — Classic Vader, Lego Vader, Halloween Vader
- ⚙️ **Settings panel** — configurable quote frequency, volume, rage threshold

</details>

---

*May the dark side be with you.* 🖤

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 🎵 Audio Credit

The “Dark March” background track used in this project is sourced from royalty-free music created by Land of Books.

Instagram:
https://www.instagram.com/land_of_books_youtube

YouTube:
https://www.youtube.com/@landofbook

---

## ⚠️ Disclaimer

Some audio assets are used under permission or appropriate royalty-free licensing. All audio and visual assets are either original or sourced under appropriate licenses. This extension is not affiliated with, endorsed by, or sponsored by any official franchise or rights holder.
