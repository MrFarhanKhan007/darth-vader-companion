"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const webview_1 = require("./webview");
const quotes_1 = require("./quotes");
class DarthVaderViewProvider {
    _extensionUri;
    _context;
    static viewType = 'darthVader.companion';
    _view;
    _idleTimer;
    _lastQuoteTime = 0;
    _minQuoteInterval = 8000;
    // ─── EMOTIONAL STATE MACHINE ───
    // Rage is an accumulating-points system with decay, commitment windows,
    // and transition locks so Vader behaves like a character with moods,
    // not a reactive sensor that flickers between states.
    _rageLevel = 0;
    _ragePoints = 0;
    _rageDecayInterval;
    _rageTransitionLock = false; // blocks level changes briefly on entry
    _rageTransitionTimer;
    _rageCommitmentTimer;
    _rageCommitted = false; // true while commitment window is active
    _pendingEvaluation = false; // buffered escalation during lock
    _workspaceClean = true; // true when zero workspace errors
    _lastErrorTrack = 0;
    _errorTrackCooldown = 4500; // min 4.5s between counting an error event
    // Points per qualifying error event
    _pointsPerError = 3;
    // Soft cap on rage points — bounded emotional escalation
    _ragePointsCap = 30;
    _saturationFired = false; // true once cap-hit quote has been sent
    // Cumulative points needed to enter each level
    _levelThresholds = [0, 5, 10, 14];
    // Minimum ms Vader commits to a level before de-escalation is allowed
    _commitmentMs = [0, 5000, 10000, 10000];
    // Transition lock duration per level (ms) — blocks all level changes briefly
    _lockMs = [0, 1500, 2500, 4000];
    // Decay per tick (every 5s): normal vs accelerated when workspace is clean
    _decayTickMs = 5000;
    _decayNormal = 1;
    _decayClean = 3;
    // After a de-escalation, ignore new points for this many ms (descent grace)
    _descentGraceUntil = 0;
    _descentGraceMs = 3000;
    // ─── DAILY METRICS (persisted via globalState, per local date) ───
    _dayMetrics = { highestRage: 0, peaceStreakStart: Date.now(), disturbances: 0 };
    constructor(_extensionUri, _context) {
        this._extensionUri = _extensionUri;
        this._context = _context;
        this._dayMetrics = this._loadMetrics();
    }
    resolveWebviewView(webviewView, _context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        const nonce = getNonce();
        const themeUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'audio', 'march_sound.mp3')).toString();
        const saberUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'audio', 'sword_sound.mp3')).toString();
        const breathingUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'audio', 'breath_sound_v2.mp3')).toString();
        const rageUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'audio', 'alarm_sound.mp3')).toString();
        webviewView.webview.html = (0, webview_1.getWebviewContent)(nonce, webviewView.webview.cspSource, { themeUri, saberUri, breathingUri, rageUri });
        this._startRageDecay();
        // Push initial metrics once the webview script has had time to wire up
        setTimeout(() => this._sendStatsUpdate(), 600);
    }
    sendMessage(msg) {
        if (this._view) {
            this._view.webview.postMessage(msg);
        }
    }
    _canSendQuote() {
        const now = Date.now();
        if (now - this._lastQuoteTime < this._minQuoteInterval) {
            return false;
        }
        this._lastQuoteTime = now;
        return true;
    }
    triggerQuote(context) {
        if (!this._canSendQuote()) {
            return;
        }
        const quote = (0, quotes_1.getQuoteForContext)(context);
        const contextLabels = {
            save: '— on saving',
            error: '— sensing errors',
            delete: '— on deletion',
            newFile: '— new file opened',
            typing: '— while you code',
            idle: '— you seem idle',
            longFile: '— file is growing',
            function: '— new function detected',
            class: '— new class detected',
            comment: '— a comment',
            import: '— new import',
            debug: '— debugging',
            terminal: '— terminal activity',
            git: '— version control',
            swing: '— lightsaber swing',
            welcome: '',
            emptyFile: '— empty file',
            copilotStart: '— Copilot is generating',
            copilotDone: '— Copilot finished',
            copilotError: '— Copilot stumbled',
            irritated: '— irritated',
            rageError: '— RAGE MODE',
            sithMode: '— THE DARK SIDE',
            rageCalming: '— settling',
            testPass: '— tests passed',
            testFail: '— tests failed',
            buildFail: '— build failed',
            buildStart: '— build started',
            debugEnd: '— debugging ended',
        };
        const msgType = context === 'error' ? 'forceChoke' : 'quote';
        this.sendMessage({
            type: msgType,
            text: quote.text,
            context: contextLabels[context] || '',
        });
    }
    triggerCopilot(active, context) {
        const quote = (0, quotes_1.getQuoteForContext)(context);
        const contextLabel = context === 'copilotStart' ? '— Copilot is generating'
            : context === 'copilotDone' ? '— Copilot finished'
                : '— Copilot stumbled';
        this._lastQuoteTime = Date.now();
        this.sendMessage({
            type: 'copilot',
            active,
            text: quote.text,
            context: contextLabel,
        });
    }
    resetIdleTimer() {
        if (this._idleTimer) {
            clearTimeout(this._idleTimer);
        }
        this._idleTimer = setTimeout(() => {
            this.triggerQuote('idle');
        }, 60000); // 60s idle → quote
    }
    triggerSwing() {
        this.sendMessage({ type: 'swing' });
    }
    trackError() {
        const now = Date.now();
        // Debounce: VS Code fires onDidChangeDiagnostics many times per keystroke.
        // Only count one error "event" per _errorTrackCooldown ms.
        if (now - this._lastErrorTrack < this._errorTrackCooldown) {
            return;
        }
        this._lastErrorTrack = now;
        this._workspaceClean = false;
        this._addRagePoints(this._pointsPerError);
        // Daily metrics: count this as a disturbance
        this._dayMetrics.disturbances++;
        this._saveMetrics();
        this._sendStatsUpdate();
        // Sub-rage error quote (only at level 0 — higher levels speak via transitions)
        if (this._rageLevel === 0) {
            this.triggerQuote('error');
        }
    }
    checkRageClear() {
        // Polled on every diagnostic event with no errors in the changed URIs.
        // We confirm by checking ALL workspace diagnostics, then mark the workspace
        // clean so decay accelerates. The state machine handles level descent on
        // its own timeline (respecting commitment windows).
        const allDiags = vscode.languages.getDiagnostics();
        const hasErrors = allDiags.some(([, diags]) => diags.some(d => d.severity === vscode.DiagnosticSeverity.Error));
        this._workspaceClean = !hasErrors;
    }
    // ─── STATE MACHINE INTERNALS ───
    _addRagePoints(delta) {
        // Descent grace: briefly ignore new points after de-escalation
        if (delta > 0 && Date.now() < this._descentGraceUntil) {
            return;
        }
        this._ragePoints = Math.min(Math.max(0, this._ragePoints + delta), this._ragePointsCap);
        // Fire saturation quote the first time we hit the cap
        if (this._ragePoints >= this._ragePointsCap && !this._saturationFired) {
            this._saturationFired = true;
            this.sendMessage({ type: 'rageSaturated', active: true });
            const quote = (0, quotes_1.getQuoteForContext)('sithSaturation');
            this._lastQuoteTime = Date.now();
            this.sendMessage({ type: 'forceChoke', text: quote.text, context: '— FULLY CONSUMED' });
        }
        if (this._rageTransitionLock) {
            this._pendingEvaluation = true;
            return;
        }
        this._evaluateLevel();
    }
    _evaluateLevel() {
        const target = this._levelForPoints(this._ragePoints);
        if (target > this._rageLevel) {
            // Escalation: always allowed (after lock)
            this._transitionToLevel(target);
        }
        else if (this._rageLevel === 1 && target < 1) {
            // Only the irritated tier uses points for recovery back to calm.
            if (!this._rageCommitted) {
                this._transitionToLevel(0);
            }
        }
    }
    _levelForPoints(points) {
        if (points >= this._levelThresholds[3]) {
            return 3;
        }
        if (points >= this._levelThresholds[2]) {
            return 2;
        }
        if (points >= this._levelThresholds[1]) {
            return 1;
        }
        return 0;
    }
    _transitionToLevel(level) {
        if (level === this._rageLevel) {
            return;
        }
        const isEscalation = level > this._rageLevel;
        const isDeescalation = level < this._rageLevel;
        this._rageLevel = level;
        this.sendMessage({ type: 'rage', level, active: level > 0 });
        // Daily metrics: track highest tier reached today; reset peace streak on return to calm
        if (isEscalation && level > this._dayMetrics.highestRage) {
            this._dayMetrics.highestRage = level;
            this._saveMetrics();
        }
        if (level === 0) {
            this._dayMetrics.peaceStreakStart = Date.now();
            this._saveMetrics();
        }
        this._sendStatsUpdate();
        // Descent grace: brief immunity so 1 stray error doesn't re-escalate
        if (isDeescalation) {
            this._descentGraceUntil = Date.now() + this._descentGraceMs;
            // When landing at L1, cap points to L1 threshold to prevent re-bounce
            if (level === 1) {
                this._ragePoints = Math.min(this._ragePoints, this._levelThresholds[1]);
                this._saturationFired = false;
                this.sendMessage({ type: 'rageSaturated', active: false });
            }
            else if (level === 0) {
                this._saturationFired = false;
                this.sendMessage({ type: 'rageSaturated', active: false });
            }
        }
        // Start commitment window for the new level
        if (this._rageCommitmentTimer) {
            clearTimeout(this._rageCommitmentTimer);
        }
        if (level > 0) {
            this._rageCommitted = true;
            this._rageCommitmentTimer = setTimeout(() => {
                this._rageCommitted = false;
                if (!this._rageTransitionLock) {
                    const pointsTarget = this._levelForPoints(this._ragePoints);
                    if (pointsTarget > this._rageLevel) {
                        // Points crossed a higher threshold during commitment — escalate instead of dropping
                        this._transitionToLevel(pointsTarget);
                    }
                    else if (this._rageLevel > 1) {
                        // Fixed-duration tier served — step down to L1
                        this._transitionToLevel(1);
                    }
                    else if (this._rageLevel === 1) {
                        if (pointsTarget < 1) {
                            this._transitionToLevel(0);
                        }
                    }
                }
            }, this._commitmentMs[level]);
        }
        else {
            this._rageCommitted = false;
        }
        // Engage transition lock so state has time to breathe
        const lockMs = this._lockMs[level];
        if (lockMs > 0) {
            this._rageTransitionLock = true;
            if (this._rageTransitionTimer) {
                clearTimeout(this._rageTransitionTimer);
            }
            this._rageTransitionTimer = setTimeout(() => {
                this._rageTransitionLock = false;
                if (this._pendingEvaluation) {
                    this._pendingEvaluation = false;
                    this._evaluateLevel();
                }
            }, lockMs);
        }
        // Entry quotes — only on escalation, levels 1-3
        if (isEscalation) {
            this._fireLevelEntryQuote(level);
        }
        // Calming quote on de-escalation — delayed so the descent animation completes first
        if (isDeescalation) {
            setTimeout(() => this._fireCalmingQuote(), 1200);
        }
    }
    _fireCalmingQuote() {
        const quote = (0, quotes_1.getQuoteForContext)('rageCalming');
        this._lastQuoteTime = Date.now();
        // Plain quote — no shake, no saber swing. De-escalation should feel calm.
        this.sendMessage({ type: 'quote', text: quote.text, context: '— settling' });
    }
    _fireLevelEntryQuote(level) {
        let context = null;
        let contextLabel = '';
        if (level === 1) {
            context = 'irritated';
            contextLabel = '— irritated';
        }
        else if (level === 2) {
            context = 'rageError';
            contextLabel = '— RAGE MODE';
        }
        else if (level === 3) {
            context = 'sithMode';
            contextLabel = '— THE DARK SIDE';
        }
        if (!context) {
            return;
        }
        // Level 3 always fires (ceremonial). Levels 1-2 also fire on entry.
        const quote = (0, quotes_1.getQuoteForContext)(context);
        this._lastQuoteTime = Date.now();
        this.sendMessage({ type: 'forceChoke', text: quote.text, context: contextLabel });
    }
    _startRageDecay() {
        if (this._rageDecayInterval) {
            return;
        }
        this._rageDecayInterval = setInterval(() => {
            if (this._ragePoints <= 0) {
                return;
            }
            const rate = this._workspaceClean ? this._decayClean : this._decayNormal;
            this._ragePoints = Math.max(0, this._ragePoints - rate);
            // Higher rage tiers are timer-driven; points only calm L1 back to composed.
            if (!this._rageTransitionLock && !this._rageCommitted && this._rageLevel === 1) {
                const target = this._levelForPoints(this._ragePoints);
                if (target < 1) {
                    this._transitionToLevel(0);
                }
            }
        }, this._decayTickMs);
    }
    // ─── DAILY METRICS PERSISTENCE ───
    _todayKey() {
        const d = new Date();
        return `vaderMetrics-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
    _loadMetrics() {
        const saved = this._context.globalState.get(this._todayKey());
        if (saved && typeof saved.disturbances === 'number') {
            return saved;
        }
        // Fresh day — start a new peace streak from now
        return { highestRage: 0, peaceStreakStart: Date.now(), disturbances: 0 };
    }
    _saveMetrics() {
        this._context.globalState.update(this._todayKey(), this._dayMetrics);
    }
    _sendStatsUpdate() {
        this.sendMessage({
            type: 'stats',
            level: this._rageLevel,
            highestRage: this._dayMetrics.highestRage,
            disturbances: this._dayMetrics.disturbances,
            peaceStreakStart: this._dayMetrics.peaceStreakStart,
        });
    }
}
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function activate(context) {
    const provider = new DarthVaderViewProvider(context.extensionUri, context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(DarthVaderViewProvider.viewType, provider, { webviewOptions: { retainContextWhenHidden: true } }));
    // ─── Command: Darth Vader Speak ───
    context.subscriptions.push(vscode.commands.registerCommand('darthVader.newQuote', () => {
        const contexts = ['typing', 'idle', 'swing', 'welcome'];
        const ctx = contexts[Math.floor(Math.random() * contexts.length)];
        provider.triggerQuote(ctx);
    }));
    // ─── On Save ───
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
        provider.triggerQuote('save');
    }));
    // ─── On File Open ───
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor) {
            return;
        }
        const doc = editor.document;
        if (doc.lineCount <= 1 && doc.getText().trim() === '') {
            provider.triggerQuote('emptyFile');
        }
        else if (doc.lineCount > 500) {
            if (Math.random() < 0.3) { // don't nag every time
                provider.triggerQuote('longFile');
            }
        }
        else if (doc.isUntitled) {
            provider.triggerQuote('newFile');
        }
        provider.resetIdleTimer();
    }));
    // ─── On Text Change (typing detection) ───
    // Latency fix: replaced 50-keystroke counter with a 400ms debounce.
    // Large deletions still fire immediately with zero latency.
    let lastChangeText = '';
    let typingDebounce;
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.scheme !== 'file') {
            return;
        }
        provider.resetIdleTimer();
        // Large deletions fire immediately — zero latency
        for (const change of e.contentChanges) {
            if (change.rangeLength > 50 && change.text.length === 0) {
                provider.triggerQuote('delete');
                return;
            }
        }
        // Capture the most recent change for context detection
        if (e.contentChanges[0]) {
            lastChangeText = e.contentChanges[0].text;
        }
        // 400ms after the user pauses typing, evaluate context and maybe quote
        if (typingDebounce) {
            clearTimeout(typingDebounce);
        }
        typingDebounce = setTimeout(() => {
            if (Math.random() < 0.28) {
                const text = lastChangeText;
                if (text.includes('//') || text.includes('/*') || text.includes('#')) {
                    provider.triggerQuote('comment');
                }
                else if (/\bfunction\b|\bconst\s+\w+\s*=\s*\(/.test(text) || /\bdef\b/.test(text)) {
                    provider.triggerQuote('function');
                }
                else if (/\bclass\b/.test(text)) {
                    provider.triggerQuote('class');
                }
                else if (/\bimport\b|\brequire\b|\bfrom\b/.test(text)) {
                    provider.triggerQuote('import');
                }
                else {
                    provider.triggerQuote('typing');
                }
            }
        }, 400);
    }));
    // ─── Diagnostics (errors + rage mode) ───
    context.subscriptions.push(vscode.languages.onDidChangeDiagnostics((e) => {
        let hasError = false;
        for (const uri of e.uris) {
            const errors = vscode.languages.getDiagnostics(uri)
                .filter(d => d.severity === vscode.DiagnosticSeverity.Error);
            if (errors.length > 0) {
                hasError = true;
                break;
            }
        }
        if (hasError) {
            provider.trackError();
        }
        else {
            // The changed URIs have no errors — check if ALL workspace errors cleared
            provider.checkRageClear();
        }
    }));
    // ─── Terminal ───
    context.subscriptions.push(vscode.window.onDidOpenTerminal(() => {
        if (Math.random() < 0.3) {
            provider.triggerQuote('terminal');
        }
    }));
    // ─── Debug ───
    context.subscriptions.push(vscode.debug.onDidStartDebugSession(() => {
        provider.triggerQuote('debug');
    }));
    // ─── Debug End ───
    context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(() => {
        if (Math.random() < 0.5) {
            provider.triggerQuote('debugEnd');
        }
    }));
    // ─── Build / Test Tasks ───
    context.subscriptions.push(vscode.tasks.onDidStartTask((e) => {
        const name = e.execution.task.name.toLowerCase();
        const group = e.execution.task.group;
        if (group === vscode.TaskGroup.Build && !/test/.test(name)) {
            provider.triggerQuote('buildStart');
        }
    }));
    context.subscriptions.push(vscode.tasks.onDidEndTaskProcess((e) => {
        const name = e.execution.task.name.toLowerCase();
        const group = e.execution.task.group;
        const exitCode = e.exitCode ?? 0;
        if (group === vscode.TaskGroup.Test || /test|jest|pytest|mocha|vitest|karma/.test(name)) {
            provider.triggerQuote(exitCode === 0 ? 'testPass' : 'testFail');
        }
        else if (group === vscode.TaskGroup.Build && exitCode !== 0) {
            provider.triggerQuote('buildFail');
        }
    }));
    // ─── Copilot Detection ───
    // Strategy: detect large multi-line insertions that are characteristic of
    // Copilot completions (sudden insertion of 3+ lines of code).
    // We also watch for the inline completion / ghost text patterns via
    // document change events with specific heuristics.
    let copilotCooldown = false;
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
        if (copilotCooldown) {
            return;
        }
        if (e.document.uri.scheme !== 'file') {
            return;
        }
        for (const change of e.contentChanges) {
            const lines = change.text.split('\n');
            const isLargeInsertion = lines.length >= 4 && change.text.trim().length > 60;
            const hasCodePatterns = /function|const|class|def |=>|return|import|if\s*\(/.test(change.text);
            if (isLargeInsertion && hasCodePatterns) {
                // Looks like a Copilot bulk insertion
                copilotCooldown = true;
                setTimeout(() => { copilotCooldown = false; }, 15000);
                provider.triggerCopilot(false, 'copilotDone');
                break;
            }
        }
    }));
    // Also listen for the Copilot extension's status bar activity via
    // workspace configuration changes / commands if accessible
    // We watch for the 'github.copilot' extension being active and use
    // vscode.window.onDidChangeWindowState as a proxy for Copilot thinking
    const copilotExt = vscode.extensions.getExtension('GitHub.copilot') ||
        vscode.extensions.getExtension('GitHub.copilot-nightly');
    if (copilotExt) {
        // Patch: watch for status bar item changes by monitoring
        // rapid successive document changes (typing pause → big insert)
        let typingPauseTimer;
        let wasTyping = false;
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document.uri.scheme !== 'file') {
                return;
            }
            // User is typing (small changes)
            const isSmallChange = e.contentChanges.every(c => c.text.length < 5);
            if (isSmallChange) {
                wasTyping = true;
                if (typingPauseTimer) {
                    clearTimeout(typingPauseTimer);
                }
                // After a 1.5s pause, Copilot is likely generating
                typingPauseTimer = setTimeout(() => {
                    if (wasTyping && Math.random() < 0.35) {
                        provider.triggerCopilot(true, 'copilotStart');
                    }
                    wasTyping = false;
                }, 1500);
            }
        }));
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map