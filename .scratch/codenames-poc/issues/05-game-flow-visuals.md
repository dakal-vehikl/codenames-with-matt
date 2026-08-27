# 05: Game flow visuals

**What to build:** Make Turn transitions and the overall game flow visually obvious on the shared screen. The page and header take the current Team's colour; each Turn change shows a Handoff ("Pass the screen to Blue team") that blocks Reveals until the next Team presses Start; the header narrates the phase (clue vs. guessing, reveals so far). At Game Over the theme switches to the Winner's colour with a large banner and confetti.

**Blocked by:** 04 (Spymaster View)

**Status:** done

**Decision record:** three UI variants were prototyped on `/` (branch `prototype/game-flow-variants`, commit 538f793): A colour takeover + turn flash, B scoreboard sidebar + stepper, C handoff gate + action log. Verdict: A's colour takeover and phase copy, with C's Handoff replacing the flash, plus a Winner-themed finish with confetti. B and C's action log were dropped.

- [x] Page background, header bar and Board ring follow the current Team's colour
- [x] Turn change shows a Handoff card; Reveals and End Turn are blocked until "Start <Team>'s turn"
- [x] Header subtitle narrates the phase and reveals-this-turn count
- [x] Game Over themes the page in the Winner's colour, shows a large Winner banner and confetti
- [x] New Game clears Handoff and confetti and resets the Spymaster View
- [x] Game module untouched; `npm test`, `types:check`, `lint:check`, `format:check` pass
