# 01: Board generation and rendering

**What to build:** Opening `/` shows a freshly generated 5×5 Board of 25 unique Words drawn from a built-in Word List of roughly 200 English common nouns, replacing the Welcome page. Each Card renders plain (Identity hidden), and the current Turn is displayed as the Starting Team. Under the hood, a pure game module exposes `newGame({ rng? })` with an injectable random source (defaulting to `Math.random`); Vitest is wired into the existing Vite config with an `npm test` script. See `.scratch/codenames-poc/spec.md` and `CONTEXT.md` for vocabulary.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `npm test` runs Vitest via a `test` block in the existing Vite config
- [x] `newGame()` returns 25 Cards with unique Words all from the Word List
- [x] Identity split is 9 for the Starting Team, 8 for the other Team, 1 Assassin, 7 Neutral
- [x] Starting Team is chosen by the injected random source and `currentTeam` equals it; `winner` is `null`; all Cards unrevealed
- [x] Tests use an injected deterministic `rng` and cover the points above
- [x] `/` renders the Game page (Welcome page removed) with a 5×5 grid of Words and the current Turn; Tailwind only
- [x] Existing PHP feature test for `/` still passes; `npm run types:check` and `npm run lint:check` pass
