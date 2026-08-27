# 03: Game Over, Winner and New Game

**What to build:** The game ends when a Team Reveals the Assassin (the other Team is the Winner) or when a Team's last Card is Revealed (that Team is the Winner, regardless of who Revealed it). A banner names the Winner; Cards and End Turn are disabled after Game Over. An always-visible New Game button immediately (no confirmation) generates a fresh Board, Key and Starting Team, usable both after a win and mid-game.

**Blocked by:** 02 (Reveal and Turn rules)

**Status:** done

- [x] Revealing the Assassin sets `winner` to the opposing Team
- [x] Revealing a Team's final Card sets `winner` to that Team, including when the opponent Reveals it
- [x] `reveal` and `endTurn` are no-ops once `winner` is set
- [x] Tests cover all of the above
- [x] Winner banner shown at Game Over; Card clicks and End Turn disabled
- [x] New Game button always visible; clicking it replaces the state with `newGame()` with no confirmation
- [x] `npm test`, `types:check`, `lint:check` pass
