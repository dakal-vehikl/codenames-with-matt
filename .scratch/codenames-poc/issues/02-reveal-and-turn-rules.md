# 02: Reveal and Turn rules

**What to build:** Players click a Card to Reveal it; the Card shows its Identity colour (red, blue, beige Neutral, black Assassin) and becomes unclickable. Revealing the current Team's own Card keeps the Turn; Revealing a Neutral or opponent Card passes the Turn. An End Turn button passes the Turn voluntarily. The page shows the current Turn and the remaining unrevealed count per Team (derived from the Cards). The game module gains `reveal(state, cardIndex)` and `endTurn(state)` as pure functions. Assassin and last-Card outcomes are handled in ticket 03; here they simply Reveal and (for the Assassin) pass the Turn.

**Blocked by:** 01 (Board generation and rendering)

**Status:** done

- [x] `reveal` marks the Card Revealed and is a no-op (same state returned) for an already-Revealed Card
- [x] Revealing own Team's Card keeps `currentTeam`
- [x] Revealing a Neutral or opponent Card switches `currentTeam`
- [x] `endTurn` switches `currentTeam`
- [x] Tests cover all of the above with a deterministic `rng`
- [x] Clicking a Card in the page Reveals it and colours it by Identity; Revealed Cards are not clickable
- [x] Page shows current Turn, remaining count per Team, and an End Turn button
- [x] `npm test`, `types:check`, `lint:check` pass
