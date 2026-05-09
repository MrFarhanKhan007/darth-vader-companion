# Changelog

All notable changes to **Darth Vader Companion** are documented here.
This project follows [Semantic Versioning](https://semver.org/).

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
