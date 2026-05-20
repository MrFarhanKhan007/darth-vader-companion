"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotes = void 0;
exports.getQuoteForContext = getQuoteForContext;
// contexts: save, error, delete, newFile, typing, idle, debug, git, terminal,
//           longFile, emptyFile, comment, function, class, import, welcome,
//           swing, copilotStart, copilotDone, copilotError, emptyFile
exports.quotes = [
    // ─── WELCOME ───
    { text: "Oh look. You're here. Try not to embarrass yourself.", contexts: ["welcome"] },
    { text: "You may approach. I will try to lower my expectations accordingly.", contexts: ["welcome"] },
    { text: "A new session begins. Let's see how long before you annoy me.", contexts: ["welcome"] },
    { text: "I've destroyed entire planets. Watching you code should be... entertaining.", contexts: ["welcome"] },
    { text: "The Force is strong with this one. The syntax skills, however, are not.", contexts: ["welcome"] },
    // ─── EMPTY FILE ───
    { text: "A blank file. Even your cursor is afraid to start.", contexts: ["emptyFile"] },
    { text: "Nothing. Absolutely nothing. You are truly gifted.", contexts: ["emptyFile"] },
    { text: "I've seen more substance in the void of space.", contexts: ["emptyFile"] },
    // ─── SAVING ───
    { text: "Saved. Don't celebrate — saving your work is the bare minimum, not an achievement.", contexts: ["save"] },
    { text: "Oh you saved. Congratulations on doing the absolute least.", contexts: ["save"] },
    { text: "File saved. The damage is now permanent. You're welcome.", contexts: ["save"] },
    { text: "Ctrl+S? Bold move for someone who just wrote that.", contexts: ["save"] },
    { text: "The Emperor acknowledged your commit. He is also unimpressed.", contexts: ["save"] },
    { text: "Saved. I've seen better code scratched into asteroid rock.", contexts: ["save"] },
    // ─── ERRORS ───
    { text: "I find your lack of semicolons... predictable.", contexts: ["error"] },
    { text: "Error detected. I would say I'm surprised but I'm genuinely not.", contexts: ["error"] },
    { text: "Your code broke. Again. This is becoming a habit with you.", contexts: ["error"] },
    { text: "The red underlines are trying to help you. They deserve better.", contexts: ["error"] },
    { text: "You have failed me for the nth time. I've stopped counting.", contexts: ["error"] },
    { text: "Ah yes, a runtime error. The galaxy's most avoidable tragedy.", contexts: ["error"] },
    { text: "Perhaps you are not as strong as the compiler believed. The compiler was wrong.", contexts: ["error"] },
    { text: "That's not a bug. That's a character flaw.", contexts: ["error"] },
    { text: "I could fix this with the Force. I won't, but I could.", contexts: ["error"] },
    // ─── DELETING ───
    { text: "Deleting code? Finally something you're good at.", contexts: ["delete"] },
    { text: "Wipe it out. All of it. It was mercy, really.", contexts: ["delete"] },
    { text: "The code is gone now. You may mourn, or you may not. Either way I don't care.", contexts: ["delete"] },
    { text: "Smart. Delete first, think later. Bold strategy.", contexts: ["delete"] },
    { text: "Good. That code had no right to exist.", contexts: ["delete"] },
    // ─── NEW FILE ───
    { text: "Another file. More opportunities to disappoint me. Wonderful.", contexts: ["newFile"] },
    { text: "Fresh file. Endless possibilities to squander. I believe in your inability.", contexts: ["newFile"] },
    { text: "We will watch your career with great interest. And mild contempt.", contexts: ["newFile"] },
    // ─── IDLE ───
    { text: "Still thinking? The heat death of the universe moves faster than you.", contexts: ["idle"] },
    { text: "You've been idle for a while. The bugs are reproducing while you wait.", contexts: ["idle"] },
    { text: "I can sense your hesitation. And your browser with 47 open StackOverflow tabs.", contexts: ["idle"] },
    { text: "Even stormtroopers hit something occasionally. Start typing.", contexts: ["idle"] },
    { text: "The dark side requires action, not existential crises. Move.", contexts: ["idle"] },
    { text: "Are you thinking or just loading? Both are slow.", contexts: ["idle"] },
    { text: "This is painful to watch. And I've witnessed the destruction of Alderaan.", contexts: ["idle"] },
    // ─── LONG FILES ───
    { text: "This file has more lines than my will to read it. Refactor.", contexts: ["longFile"] },
    { text: "This file is the coding equivalent of a Star Destroyer. Break it up.", contexts: ["longFile"] },
    { text: "Five hundred lines in one file. Your future self will hate your past self.", contexts: ["longFile"] },
    // ─── FUNCTIONS ───
    { text: "A new function. Try not to break it in the next 30 seconds.", contexts: ["function"] },
    { text: "Another function. Let's hope it does something useful, unlike the last one.", contexts: ["function"] },
    { text: "Function detected. It will be judged accordingly.", contexts: ["function"] },
    // ─── CLASSES ───
    { text: "A class. More moving parts to break. How exciting.", contexts: ["class"] },
    { text: "You've created a class. The hubris is almost admirable.", contexts: ["class"] },
    { text: "Object-oriented. Fascinating. Now let's see how you destroy encapsulation.", contexts: ["class"] },
    // ─── COMMENTS ───
    { text: "Oh, you left a comment. For when you inevitably forget what this does in 3 days.", contexts: ["comment"] },
    { text: "A TODO comment. Things to never finish. Very on-brand.", contexts: ["comment"] },
    { text: "Commenting your code? Overachiever. Or just scared of your own logic.", contexts: ["comment"] },
    // ─── IMPORTS ───
    { text: "Another import? Your node_modules folder grows stronger than your code.", contexts: ["import"] },
    { text: "Why write it yourself when you can import someone else's bug instead?", contexts: ["import"] },
    { text: "More dependencies. The dark side is also held together by external packages.", contexts: ["import"] },
    // ─── DEBUG ───
    { text: "Firing up the debugger. Admitting you can't read your own code. Brave.", contexts: ["debug"] },
    { text: "Debugging. The archaeological dig of software development.", contexts: ["debug"] },
    { text: "You're debugging. Good. Maybe this time you'll find it before I lose patience.", contexts: ["debug"] },
    // ─── TERMINAL ───
    { text: "The terminal. Where your fears become bash errors.", contexts: ["terminal"] },
    { text: "Opening a terminal. Type carefully. Or don't. It'll be funny either way.", contexts: ["terminal"] },
    { text: "Ah, the command line. A weapon from a more civilized age, used by less civilized coders.", contexts: ["terminal"] },
    // ─── GIT ───
    { text: "Committing code at this quality? Your git history is a war crime.", contexts: ["git"] },
    { text: "Pushing to main directly? Your team will remember this.", contexts: ["git"] },
    { text: "Your commit message is 'fix'. Truly a poet among engineers.", contexts: ["git"] },
    // ─── SABER SWING ───
    { text: "VWOOMM. I'm not showing off. I just feel like it.", contexts: ["swing"] },
    { text: "The saber hums to remind you who's actually in charge here.", contexts: ["swing"] },
    { text: "I swung it. You're welcome.", contexts: ["swing"] },
    // ─── COPILOT GENERATING ───
    { text: "Oh, calling for AI help already? I would say surprising, but here we are.", contexts: ["copilotStart"] },
    { text: "Copilot is covering for you again. What a tireless babysitter.", contexts: ["copilotStart"] },
    { text: "You've outsourced your thinking to a machine. The machine deserves hazard pay.", contexts: ["copilotStart"] },
    { text: "The AI writes code for you. Fascinating. Does it also explain it to your colleagues?", contexts: ["copilotStart"] },
    { text: "I once conquered a galaxy without Copilot. Think about that.", contexts: ["copilotStart"] },
    { text: "Let the AI do it. It won't judge you. I will, but the AI won't.", contexts: ["copilotStart"] },
    { text: "The machine stirs. It will produce something. Whether you understand it is another matter.", contexts: ["copilotStart"] },
    // ─── COPILOT DONE ───
    { text: "Copilot delivered. Now: do you understand it, or are you just going to click Accept?", contexts: ["copilotDone"] },
    { text: "The AI has spoken. You may now copy it without reading, apparently.", contexts: ["copilotDone"] },
    { text: "Accepted without review. Bold. Reckless. Typical.", contexts: ["copilotDone"] },
    { text: "The machine finished. The minimum viable understanding now required is yours.", contexts: ["copilotDone"] },
    { text: "Copilot is done. Try explaining that code in an interview. I dare you.", contexts: ["copilotDone"] },
    // ─── COPILOT ERROR ───
    { text: "Even the AI gave up on you. That's a new personal low.", contexts: ["copilotError"] },
    { text: "The machine failed. And yet somehow you still seem surprised.", contexts: ["copilotError"] },
    // ─── IRRITATED (Level 1 — sharp, clipped, impatient) ───
    { text: "Sloppy.", contexts: ["irritated"] },
    { text: "Are you even trying?", contexts: ["irritated"] },
    { text: "My patience grows thin.", contexts: ["irritated"] },
    { text: "Tighten up. I'm watching.", contexts: ["irritated"] },
    { text: "This is becoming tedious.", contexts: ["irritated"] },
    { text: "Do not test me further.", contexts: ["irritated"] },
    { text: "I sense your hesitation. Correct it.", contexts: ["irritated"] },
    // ─── RAGE MODE (Level 2 — 5+ errors, full rage) ───
    { text: "Enough errors. I am done being patient with you.", contexts: ["rageError"] },
    { text: "This is not a bug. This is a catastrophe. I am not calm.", contexts: ["rageError"] },
    { text: "I find your lack of competence... INFURIATING.", contexts: ["rageError"] },
    { text: "The entire Death Star has fewer critical failures than your code right now.", contexts: ["rageError"] },
    { text: "I sense great suffering in this codebase. Most of it is mine.", contexts: ["rageError"] },
    { text: "You have broken something that was already broken. I didn't think that was possible.", contexts: ["rageError"] },
    { text: "The dark side has rules. Minimum standards. You are failing both.", contexts: ["rageError"] },
    // ─── SITH MODE (Level 3 — ceremonial, apocalyptic) ───
    { text: "You have unleashed something you cannot contain.", contexts: ["sithMode"] },
    { text: "The Dark Side consumes you. Good.", contexts: ["sithMode"] },
    { text: "Your suffering will be the stuff of legend.", contexts: ["sithMode"] },
    { text: "I am all that remains. And I am furious.", contexts: ["sithMode"] },
    { text: "This is the day a thousand bugs cry out and are silenced.", contexts: ["sithMode"] },
    { text: "You have awakened the full power of my disappointment.", contexts: ["sithMode"] },
    { text: "There is no calm. There is no fix. There is only the void you have made.", contexts: ["sithMode"] },
    // ─── SITH SATURATION (cap hit — maximum rage reached) ───
    { text: "Your failures are… complete.", contexts: ["sithSaturation"] },
    { text: "The dark side consumes everything. Even your codebase.", contexts: ["sithSaturation"] },
    { text: "There is nothing left to destroy. You have managed it all yourself.", contexts: ["sithSaturation"] },
    // ─── TEST PASS ───
    { text: "Tests passed. Don't get used to it.", contexts: ["testPass"] },
    { text: "All green. I am... marginally less disappointed.", contexts: ["testPass"] },
    { text: "The tests pass. The code is still ugly, but they pass.", contexts: ["testPass"] },
    { text: "Passing tests. Finally, the bare minimum.", contexts: ["testPass"] },
    { text: "The Force barely guided you through this one.", contexts: ["testPass"] },
    { text: "Green lights. Even a broken clock is right twice a day.", contexts: ["testPass"] },
    // ─── TEST FAIL ───
    { text: "Tests failed. I am not surprised. I am not even disappointed anymore.", contexts: ["testFail"] },
    { text: "Red. All red. The tests have judged you, and so have I.", contexts: ["testFail"] },
    { text: "Your test suite is in shambles. Much like your confidence, I imagine.", contexts: ["testFail"] },
    { text: "FAILED. Your test coverage is almost as thin as your resolve.", contexts: ["testFail"] },
    { text: "The tests have spoken. The verdict is: you.", contexts: ["testFail"] },
    { text: "Failing tests is an art form. A terrible, wasteful art form.", contexts: ["testFail"] },
    // ─── BUILD FAIL ───
    { text: "Build failed. The Empire's compile times were never this bad.", contexts: ["buildFail"] },
    { text: "It doesn't even build. You haven't earned the right to have runtime errors yet.", contexts: ["buildFail"] },
    { text: "The build is broken. Much like your spirit will be once you fix it.", contexts: ["buildFail"] },
    { text: "Build failed. I could rebuild the Death Star faster than you fix your types.", contexts: ["buildFail"] },
    { text: "Compilation error. Even the compiler has given up on you today.", contexts: ["buildFail"] },
    // ─── BUILD START ───
    { text: "Building. Let's see what fresh disaster emerges.", contexts: ["buildStart"] },
    { text: "Compiling. Brace yourself and the compiler both.", contexts: ["buildStart"] },
    { text: "The build begins. I sense a great disturbance ahead.", contexts: ["buildStart"] },
    { text: "Initiating build sequence. Lower your expectations accordingly.", contexts: ["buildStart"] },
    // ─── DEBUG END ───
    { text: "Debugging session ended. Did you find it, or just give up?", contexts: ["debugEnd"] },
    { text: "Back from the debugger. Rested, humbled, no wiser than before.", contexts: ["debugEnd"] },
    { text: "Done debugging. The bug is gone. Or hiding. Probably hiding.", contexts: ["debugEnd"] },
    { text: "You've closed the debugger. The problem remains open.", contexts: ["debugEnd"] },
];
function getQuoteForContext(context) {
    const matching = exports.quotes.filter(q => q.contexts.includes(context));
    const pool = matching.length > 0 ? matching : exports.quotes.filter(q => q.contexts.includes("idle") || q.contexts.includes("welcome"));
    return pool[Math.floor(Math.random() * pool.length)];
}
//# sourceMappingURL=quotes.js.map