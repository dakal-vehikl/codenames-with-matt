# 04: Spymaster View

**What to build:** A trust-based Spymaster View toggle on the page. When on, every unrevealed Card is tinted with its Identity (the Key), Revealed Cards are dimmed so remaining targets stand out, and clicking Cards to Reveal is disabled. The toggle is page-only state (not part of the game module) and resets to off whenever New Game is pressed.

**Blocked by:** 03 (Game Over, Winner and New Game)

**Status:** done

- [x] Toggle is visible and unrestricted (no auth)
- [x] With the toggle on, unrevealed Cards show their Identity colour and Revealed Cards are dimmed
- [x] With the toggle on, clicking a Card does not Reveal it
- [x] Toggle resets to off on New Game
- [x] No changes to the game module's public functions or tests
- [x] `types:check` and `lint:check` pass
