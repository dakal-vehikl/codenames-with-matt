import { describe, expect, it } from 'vitest';

import { endTurn, newGame, otherTeam, reveal } from './game';
import type { GameState, Identity } from './game';
import { WORD_LIST } from './words';

describe('newGame', () => {
    it('builds a Board of 25 unique Words drawn from the Word List', () => {
        const game = newGame({ rng: () => 0.5 });

        expect(game.cards).toHaveLength(25);

        const words = game.cards.map((card) => card.word);

        expect(new Set(words).size).toBe(25);
        expect(words.every((word) => WORD_LIST.includes(word))).toBe(true);
    });
});

function countIdentities(game: ReturnType<typeof newGame>) {
    const counts = { red: 0, blue: 0, neutral: 0, assassin: 0 };

    for (const card of game.cards) {
        counts[card.identity]++;
    }

    return counts;
}

describe('newGame Key', () => {
    it('gives the Starting Team 9 Cards, the other Team 8, 1 Assassin and 7 Neutral', () => {
        const game = newGame({ rng: () => 0.5 });
        const counts = countIdentities(game);

        expect(counts[game.startingTeam]).toBe(9);
        expect(counts[otherTeam(game.startingTeam)]).toBe(8);
        expect(counts.assassin).toBe(1);
        expect(counts.neutral).toBe(7);
    });

    it('chooses the Starting Team from the random source', () => {
        const red = newGame({ rng: () => 0 });
        const blue = newGame({ rng: () => 0.99 });

        expect(red.startingTeam).toBe('red');
        expect(blue.startingTeam).toBe('blue');
    });

    it('starts with the Starting Team to play, no Winner and every Card unrevealed', () => {
        const game = newGame({ rng: () => 0.99 });

        expect(game.currentTeam).toBe(game.startingTeam);
        expect(game.winner).toBeNull();
        expect(game.cards.every((card) => !card.revealed)).toBe(true);
    });
});

function indexOf(game: GameState, identity: Identity, offset = 0): number {
    const indexes = game.cards.flatMap((card, i) =>
        card.identity === identity && !card.revealed ? [i] : [],
    );

    return indexes[offset];
}

describe('reveal', () => {
    it('marks the Card as Revealed', () => {
        const game = newGame({ rng: () => 0 });
        const index = indexOf(game, 'neutral');

        const next = reveal(game, index);

        expect(next.cards[index].revealed).toBe(true);
    });

    it('is a no-op for an already Revealed Card', () => {
        const game = newGame({ rng: () => 0 });
        const index = indexOf(game, 'red');
        const once = reveal(game, index);

        expect(reveal(once, index)).toBe(once);
    });

    it("keeps the Turn when the current Team's own Card is Revealed", () => {
        const game = newGame({ rng: () => 0 });

        const next = reveal(game, indexOf(game, game.currentTeam));

        expect(next.currentTeam).toBe(game.currentTeam);
    });

    it('passes the Turn when a Neutral Card is Revealed', () => {
        const game = newGame({ rng: () => 0 });

        const next = reveal(game, indexOf(game, 'neutral'));

        expect(next.currentTeam).toBe('blue');
    });

    it("passes the Turn when the opponent's Card is Revealed", () => {
        const game = newGame({ rng: () => 0 });

        const next = reveal(game, indexOf(game, 'blue'));

        expect(next.currentTeam).toBe('blue');
    });
});

describe('endTurn', () => {
    it('passes the Turn to the other Team', () => {
        const game = newGame({ rng: () => 0 });

        expect(endTurn(game).currentTeam).toBe('blue');
        expect(endTurn(endTurn(game)).currentTeam).toBe('red');
    });
});

function revealAll(game: GameState, identity: Identity): GameState {
    let state = game;

    while (indexOf(state, identity) !== undefined) {
        state = reveal(state, indexOf(state, identity));
    }

    return state;
}

describe('Game Over', () => {
    it('makes the opposing Team the Winner when the Assassin is Revealed', () => {
        const game = newGame({ rng: () => 0 });

        const next = reveal(game, indexOf(game, 'assassin'));

        expect(next.winner).toBe('blue');
    });

    it('makes a Team the Winner when its last Card is Revealed', () => {
        const game = newGame({ rng: () => 0 });

        const next = revealAll(game, 'red');

        expect(next.winner).toBe('red');
    });

    it('makes a Team the Winner even when the opponent Reveals its last Card', () => {
        const game = endTurn(newGame({ rng: () => 0 }));

        expect(game.currentTeam).toBe('blue');

        const next = revealAll(game, 'red');

        expect(next.winner).toBe('red');
    });

    it('ignores reveal and endTurn once there is a Winner', () => {
        const game = newGame({ rng: () => 0 });
        const over = reveal(game, indexOf(game, 'assassin'));

        expect(reveal(over, indexOf(over, 'neutral'))).toBe(over);
        expect(endTurn(over)).toBe(over);
    });
});
