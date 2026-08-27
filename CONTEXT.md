# Codenames

A single-screen, pass-and-play web version of the word game Codenames. Two teams share one computer; the game only tracks the board and whose turn it is.

## Language

**Board**:
The 5×5 grid of 25 Cards in play for one game. Generated at random when a game starts.
_Avoid_: Deck, grid

**Card**:
One Word on the Board together with its hidden Identity and whether it has been Revealed.
_Avoid_: Tile, cell

**Word**:
The text on a Card, drawn without replacement from the Word List.

**Word List**:
The fixed, built-in pool of English words that Boards are drawn from.
_Avoid_: Dictionary, deck

**Identity**:
Which side a Card secretly belongs to: Red, Blue, Neutral, or Assassin. Fixed when the Board is generated.
_Avoid_: Colour, type, role

**Key**:
The full mapping of every Card to its Identity. Visible only in the Spymaster View.
_Avoid_: Key card, map, answer sheet

**Team**:
Red or Blue. The Starting Team has 9 Cards on the Board; the other has 8.
_Avoid_: Side, player

**Starting Team**:
The Team that takes the first turn and has the extra (ninth) Card. Chosen at random per game.

**Reveal**:
Turning a Card face-up so everyone can see its Identity. Irreversible.
_Avoid_: Flip, guess, pick, select

**Turn**:
The period during which one Team may Reveal Cards. Ends when that Team Reveals a Card that is not theirs, or ends its Turn voluntarily.

**Spymaster View**:
A trust-based toggle that shows the Key on the shared screen. Not access-controlled.
_Avoid_: Spymaster mode, admin view

**Assassin**:
The single Card whose Reveal immediately loses the game for the revealing Team.
_Avoid_: Bomb, black card

**Game Over**:
The state after a Team has Revealed all its Cards, or any Team has Revealed the Assassin. No further Reveals are possible.
_Avoid_: Finished, ended, win state

**Winner**:
The Team that Revealed all its own Cards, or the Team opposing the one that Revealed the Assassin.

**New Game**:
Discarding the current Board (finished or not) and generating a fresh one with a fresh Starting Team.
_Avoid_: Restart, reset
