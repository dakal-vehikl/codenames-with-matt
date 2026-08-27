# Spec: Codenames single-screen proof-of-concept

Status: ready-for-agent

## Problem Statement

A group of people in the same room want to play Codenames on one computer without owning the physical game. They need a Board of 25 Words, a hidden Key for the spymasters, and a way to Reveal Cards and track whose Turn it is — nothing more.

## Solution

A single web page that generates a random Board on load. Players Reveal Cards by clicking them; the page tracks the current Turn, the remaining Cards per Team, and declares a Winner. A trust-based Spymaster View toggle shows the Key on the shared screen. A New Game button generates a fresh Board at any time. Clues are spoken aloud and not entered into the app.

## User Stories

1. As a player, I want a random Board of 25 Words to appear when I open the page, so that we can start playing immediately.
2. As a player, I want every game to draw a different set of Words, so that games don't repeat.
3. As a player, I want the 25 Words to be unique within a Board, so that no Word is ambiguous.
4. As a player, I want the Board laid out as a 5×5 grid, so that it looks like the physical game.
5. As a player, I want the Starting Team chosen at random, so that neither Team always goes first.
6. As a player, I want the Starting Team to have 9 Cards and the other Team 8, so that the first-move advantage is balanced as in the real rules.
7. As a player, I want exactly one Assassin and seven Neutral Cards on the Board, so that the Key matches the real rules.
8. As a player, I want to see whose Turn it is at all times, so that we don't argue about it.
9. As a player, I want to see how many Cards each Team still has to find, so that we know how close each Team is to winning.
10. As an operative, I want to click a Card to Reveal it, so that I can make a guess.
11. As an operative, I want a Revealed Card to show its Identity by colour, so that everyone sees the result of the guess.
12. As an operative, I want a Revealed Card to stay Revealed and become unclickable, so that a guess cannot be undone.
13. As an operative, I want my Turn to continue when I Reveal my own Team's Card, so that I can keep guessing.
14. As an operative, I want my Turn to end automatically when I Reveal a Neutral Card, so that the rules are enforced without discussion.
15. As an operative, I want my Turn to end automatically when I Reveal the other Team's Card, so that the rules are enforced without discussion.
16. As an operative, I want an End Turn button, so that my Team can stop guessing voluntarily.
17. As a player, I want the game to end immediately when the Assassin is Revealed, with the other Team declared Winner, so that the rules are enforced.
18. As a player, I want the game to end immediately when a Team has Revealed all of its Cards, with that Team declared Winner.
19. As a player, I want to see a clear banner naming the Winner at Game Over, so that the result is unambiguous.
20. As a player, I want Cards to be unclickable after Game Over, so that the finished Board is preserved.
21. As a player, I want the End Turn button disabled after Game Over, so that the UI reflects the finished state.
22. As a spymaster, I want a Spymaster View toggle, so that I can see the Key.
23. As a spymaster, I want the Spymaster View to tint every unrevealed Card with its Identity, so that I can plan clues.
24. As a spymaster, I want Revealed Cards dimmed in the Spymaster View, so that remaining targets stand out.
25. As a spymaster, I want Reveal disabled while the Spymaster View is on, so that I cannot accidentally Reveal a Card.
26. As a player, I want the Spymaster View toggle to be visible and unrestricted, so that it works on a single shared screen without accounts.
27. As a player, I want a New Game button that is always visible, so that we can restart after a win or abandon a game mid-way.
28. As a player, I want New Game to act immediately without a confirmation dialog, so that restarting is fast.
29. As a player, I want New Game to generate a fresh Board, fresh Key, and fresh Starting Team, so that each game is independent.
30. As a player, I want the Spymaster View to switch off on New Game, so that the new Key is not accidentally shown to everyone.
31. As a player, I want the page to look reasonable on a laptop screen with no scrolling, so that the whole Board is visible to the room.
32. As a player, I want the Words to be plain English common nouns, so that clues are broadly accessible.
33. As a developer, I want the game rules implemented as pure functions, so that they can be unit-tested without a browser.
34. As a developer, I want the random source injectable, so that tests can produce deterministic Boards.
35. As a developer, I want `npm test` to run the game-rule tests, so that regressions are caught.

## Implementation Decisions

- The game is entirely client-side. Laravel serves a single Inertia page at `/` and holds no game state. There are no models, migrations, controllers, sessions, or API endpoints. Refreshing the page starts a new game.
- The existing Welcome page is replaced by a Game page, and the `/` route points at it.
- Game rules live in a pure, framework-free game module with three public functions:
  - `newGame(options?)` — builds a fresh state. Accepts an optional random source (defaulting to `Math.random`) used for Word selection, Key shuffling, and Starting Team.
  - `reveal(state, cardIndex)` — returns the new state after Revealing a Card. It is a no-op (returns the same state) if the Card is already Revealed or the game is over.
  - `endTurn(state)` — passes the Turn to the other Team. No-op after Game Over.
- Game state shape (settled in grilling): a list of 25 Cards, each with `word`, `identity` (`red` | `blue` | `neutral` | `assassin`), and `revealed`; the `startingTeam`; the `currentTeam`; and a `winner` (`red` | `blue` | `null`). Game Over is derived as `winner !== null`. Remaining counts per Team are derived from the Cards, not stored.
- Turn rules: Reveal own Identity → Turn continues. Reveal Neutral or opponent → Turn passes. Reveal Assassin → `winner` = opposing Team. When a Team's last Card is Revealed → `winner` = that Team (checked regardless of who Revealed it). No clue entry and no cap on Reveals per Turn.
- The Word List is a built-in list of roughly 200 English common nouns, authored for this project (not the copyrighted Codenames cards), in its own module. Boards draw 25 without replacement; draws are independent across games.
- Spymaster View is UI-only state in the Vue page (not part of game state). It is a trust-based toggle that resets to off on New Game and disables Card clicks while on.
- The Game page holds the state in a single reactive ref, renders the 5×5 grid, current Turn, remaining counts per Team, End Turn, Spymaster View toggle, New Game, and a Winner banner. Tailwind only; no component library; desktop-first.
- Card colours on Reveal: red, blue, beige for Neutral, black for Assassin. Unrevealed Cards are plain.

## Testing Decisions

- A good test drives the public functions of the game module and asserts on resulting state or derived facts (counts, winner, current Team). Tests never reach into internals or assert on the order of operations.
- Seam: the game module's three public functions, with an injected deterministic random source. This is the only new seam. Vitest is added as a dev dependency with a `test` block in the existing Vite config and an `npm test` script.
- Tests to write: Board has 25 unique Words drawn from the Word List; Identity split is 9/8/1/7 with the Starting Team holding 9; Starting Team varies with the random source; Reveal own Card keeps the Turn; Reveal Neutral / opponent passes the Turn; Reveal Assassin sets the opposing Winner; Revealing a Team's last Card sets that Winner (including when the opponent Reveals it); Reveal on an already-Revealed Card or after Game Over is a no-op; End Turn passes the Turn and is a no-op after Game Over.
- Existing seam retained: the PHP feature test asserting `/` responds 200 continues to pass. No new PHP tests.
- The Vue page is not unit-tested; it is a thin renderer verified by running the app.
- Prior art: none in the repo for frontend tests; the PHP `ExampleTest` is the only existing test.

## Out of Scope

- Online or multi-device play, accounts, or any server-side state.
- Clue and number entry, guess caps, timers, or a Reveal log.
- Persistence across page refresh.
- Access control on the Spymaster View.
- Avoiding Word repetition across games.
- Non-English Word Lists.
- Mobile layout.
- Component tests for the Vue page.

## Further Notes

- Glossary terms (Board, Card, Word, Word List, Identity, Key, Team, Starting Team, Reveal, Turn, Spymaster View, Assassin, Game Over, Winner, New Game) are defined in `CONTEXT.md`; use them in code identifiers and test names.
- An ADR recording the client-side-only decision was offered during grilling but not yet confirmed by the user.
