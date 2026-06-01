# Changelog

All notable changes to **Darth Vader Companion - Star Wars Edition** are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---
## [0.3.4] - 2026-06-01

### Changed
- Altered the main extension name - appended Star Wars name for better searchability and to avoid confusion with unrelated extensions named "Vader" or "Darth".

## [0.3.3] - 2026-05-20

### Changed
- Switched the README full demo link to a browser-playable CDN URL so the video opens in the browser player instead of downloading as a release attachment.

---

## [0.3.2] - 2026-05-20

### Changed
- Switched the README full demo link to a GitHub Release asset workflow so the video stays accessible without relying on the repository file viewer.

---

## [0.3.1] - 2026-05-20

### Changed
- Re-added the full demo video and switched it to a compressed version so the showcase media stays easier to ship and lighter to load.

---

## [0.3.0] - 2026-05-20

### Added
- **4-Level Emotional State Machine** — Vader's mood now builds and decays through four distinct tiers rather than flipping a single rage switch:
  - **Level 0 — Composed**: Normal Vader. Quotes, ambient animations, usual menace.
  - **Level 1 — Irritated** `⚠ IRRITATED`: Amber badge, slower eye glow, clipped impatient quotes. No shake, no alarm — he is *noticing*.
  - **Level 2 — Rage Mode** `⚠ RAGE MODE`: Full body shake, red pulse, eye spasms, rage alarm (if enabled), dedicated rage quotes.
  - **Level 3 — The Dark Side** `⚠ THE DARK SIDE`: Faster shake, deeper pulse, unstable lightsaber blade that flickers and shifts hue, ceremonial Sith quotes, deep-red badge with halo glow.
- **Saturation State**: If errors keep accumulating past a soft cap (30 pts), Vader enters a "contained overwhelming power" visual — animations slow to a deliberate, heavy cadence and a special saturation quote fires once.
- **Rage Points system**: Each qualifying error event adds points (4.5s minimum between counted events). Points decay on a 5-second tick — faster when the workspace is clean.
- **Fixed-duration upper tiers**: Level 2 and Level 3 each last a maximum of 10 seconds. Once served, Vader always steps down to Level 1 — never skipping it, never jumping straight to calm.
- **Points-based calm recovery**: Only Level 1 waits for points to drop below threshold before returning to composed. No arbitrary timer delay at the bottom.
- **Descent grace period**: A 3-second immunity window after any de-escalation prevents a single stray error from immediately re-escalating.
- **Transition locks**: After any level change, further transitions buffer for 1.5–4s so rapid error bursts never cause visual flicker.
- **Level-entry quotes**: Every escalation fires a context-appropriate quote (`irritated`, `rageError`, or `sithMode`) — guaranteed, not random.
- **New quote contexts**: 7 `irritated` quotes (short, sharp), 7 `sithMode` quotes (ceremonial, apocalyptic), 3 `sithSaturation` quotes (fired at the soft cap).
- **Per-level badge**: Badge reads and recolors per tier — amber for Irritated, red for Rage Mode, deep red with glow for The Dark Side.
- **Rage alarm mid-rage fix**: Toggling the alarm on while already in Rage Mode or The Dark Side now starts playback immediately.
- **Dark Side Metrics Panel** — A subtle telemetry panel below the quote box. Vader now persists daily session stats:
  - **Current State** — live tier (Composed / Irritated / Rage Mode / The Dark Side) with tier-colored glow.
  - **Highest Rage Today** — the worst tier reached on the current local day.
  - **Peace Streak** — how long Vader has remained composed, refreshed every 30 seconds.
  - **Today's Disturbances** — total qualifying error events counted for the day.
  - Persists across VS Code reloads via `globalState` and resets automatically at local midnight.
- **Recovery / Calming Quotes** — A new `rageCalming` quote context fires about 1.2 seconds after de-escalation, completing the arc with controlled post-rage lines like "Control has returned." and "The disturbance fades."
- **Asymmetric Transition Animations** — Escalation now lands as a sharp burst while de-escalation exhales more slowly, with separate eye, saber, body, and background transition passes.

### Changed
- Rage alarm plays only at Level 2 and above. It stops the moment Vader de-escalates to Level 1. All audio remains fully manual — nothing auto-plays.
- Error debounce set to 4.5s per event to prevent noise from rapid diagnostic refreshes.
- Level thresholds tuned for reachability within the fixed 10s windows: Level 1 at 5 pts, Level 2 at 10 pts, Level 3 at 14 pts.
- The webview rage handler now tracks direction of travel so escalation and de-escalation use different transition animations.
- Recovery quotes intentionally bypass the normal 8-second quote cooldown, matching the guaranteed level-entry quote behavior.

### Fixed
- Rage alarm did not play when toggled on mid-rage — now starts immediately if already at Level 2+.
- Previous binary rage state could stall mid-transition; the new state machine always resolves cleanly.

---

## [0.2.3] - 2026-05-10

### Changed
- Changelog restructured and backdated to accurately reflect all versions from `0.1.0` through `0.2.2`, consistent with the published Git history.

---

## [0.2.2] - 2026-05-09

### Fixed
- Marketplace icon was invisible on the VS Code Marketplace page (white icon on white background). Replaced with a high-contrast black helmet icon that renders correctly on both the marketplace and inside VS Code.
- Repository URL, bugs URL, and homepage in `package.json` were pointing to the wrong publisher path. All links now correctly resolve to the published extension page.
- Added `galleryBanner` (dark theme, `#0a0a0a` background) for a polished marketplace listing appearance.

---

## [0.2.1] - 2026-04-20

### Changed
- Publisher ID updated to `mrfarhankhan007` to match the verified Marketplace account.
- All audio files replaced with copyright-free alternatives. Dark March replaces the Imperial March reference throughout the UI.
- Code structure refactored across `extension.ts` and `webview.ts` for improved readability and maintainability.
- Activity Bar icon updated to a cleaner helmet silhouette PNG.
- `.gitignore` and `.vscodeignore` updated to exclude build artifacts, audio scratch files, and virtual environment from version control.
- README updated with accurate feature descriptions and audio toggle documentation.

### Removed
- Redundant test scratch code cleaned up.

---

## [0.2.0] - 2026-04-18

### Added
- **Rage Mode** - accumulate 5 errors within 20 seconds to trigger full Rage Mode: body shake animation, eye flicker, red panel pulse, a `RAGE MODE` badge, and a rage-specific quote. Exits automatically after 10 seconds or instantly when all errors clear.
- **Breathing audio** - Vader's iconic breathing loop plays as a background ambient sound, independently toggleable (default off).
- **Rage alarm audio** - a dramatic alarm loop fires during Rage Mode, independently toggleable (default off).
- **2x2 audio control grid** - all four sounds (Dark March, Breathing, Lightsaber, Rage Alarm) managed via a clean aligned button grid.
- **Test reactions** - quotes fire when test tasks pass or fail (detects jest, pytest, mocha, vitest, karma, and the VS Code Test task group).
- **Build reactions** - quotes fire on build start and build failure.
- **Debug end reaction** - a quote fires when a debug session closes.
- **Copilot detection** - a typing-pause heuristic (1.5s silence) and a bulk-insertion heuristic (4+ lines at once) trigger Copilot-aware quotes and a pulsing badge.
- `retainContextWhenHidden: true` - the webview stays alive when the sidebar is collapsed; audio stays buffered.
- MIT License added.
- 40+ new quotes across rage, test pass/fail, build start/fail, debug end, and Copilot contexts.

### Fixed
- **Rage Mode entry latency** - replaced the 50-keystroke counter with a 400ms debounce. Vader now reacts within half a second of you pausing.
- **Rage Mode exit latency** - a 500ms poll checks `vscode.languages.getDiagnostics()` directly so Rage Mode exits within ~500ms of all errors clearing, without waiting for the next diagnostic event.
- **Rage Mode false triggers** - a 3s cooldown between counted error events prevents a single burst of `onDidChangeDiagnostics` callbacks from instantly filling the threshold.
- Browser autoplay priming - the rage alarm is primed inside the toggle click handler so it reliably plays when Rage Mode fires from a VS Code event (bypasses autoplay restrictions).
- Lightsaber audio now resets `currentTime` before each swing; the toggle also gates auto-swing sounds.

---

## [0.1.0] - 2026-04-18

> Pre-release

### Added
- Animated SVG Darth Vader figure with breathing animation, glowing red eyes, chest panel blink, cape sway, and an idle lightsaber.
- Lightsaber swing animation with sound effect triggered by editor events.
- Dark March background music toggle (looping MP3).
- 70+ arrogant Vader quotes across 20 event contexts (file save, file open, typing, errors, terminal activity, debug start/stop, idle timeout).
- Editor event listeners: `onDidSaveTextDocument`, `onDidOpenTextDocument`, `onDidChangeTextDocument`, `onDidChangeDiagnostics`, terminal activity, debug session events, and an idle timer.
