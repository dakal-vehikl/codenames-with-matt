import { WORD_LIST } from './words';

export type Team = 'red' | 'blue';
export type Identity = Team | 'neutral' | 'assassin';

export interface Card {
    word: string;
    identity: Identity;
    revealed: boolean;
}

export interface GameState {
    cards: Card[];
    startingTeam: Team;
    currentTeam: Team;
    winner: Team | null;
}

export interface NewGameOptions {
    rng?: () => number;
}

const BOARD_SIZE = 25;

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

export function otherTeam(team: Team): Team {
    return team === 'red' ? 'blue' : 'red';
}

function buildKey(startingTeam: Team, rng: () => number): Identity[] {
    const identities: Identity[] = [
        ...Array<Identity>(9).fill(startingTeam),
        ...Array<Identity>(8).fill(otherTeam(startingTeam)),
        ...Array<Identity>(7).fill('neutral'),
        'assassin',
    ];

    return shuffle(identities, rng);
}

export function newGame({ rng = Math.random }: NewGameOptions = {}): GameState {
    const startingTeam: Team = rng() < 0.5 ? 'red' : 'blue';
    const words = shuffle(WORD_LIST, rng).slice(0, BOARD_SIZE);
    const key = buildKey(startingTeam, rng);

    return {
        cards: words.map((word, i) => ({
            word,
            identity: key[i],
            revealed: false,
        })),
        startingTeam,
        currentTeam: startingTeam,
        winner: null,
    };
}

export function endTurn(state: GameState): GameState {
    if (state.winner) {
        return state;
    }

    return { ...state, currentTeam: otherTeam(state.currentTeam) };
}

export function remainingFor(cards: Card[], team: Team): number {
    return cards.filter((card) => card.identity === team && !card.revealed)
        .length;
}

export function reveal(state: GameState, cardIndex: number): GameState {
    const card = state.cards[cardIndex];

    if (!card || card.revealed || state.winner) {
        return state;
    }

    const cards = state.cards.map((c, i) =>
        i === cardIndex ? { ...c, revealed: true } : c,
    );

    if (card.identity === 'assassin') {
        return { ...state, cards, winner: otherTeam(state.currentTeam) };
    }

    if (
        (card.identity === 'red' || card.identity === 'blue') &&
        remainingFor(cards, card.identity) === 0
    ) {
        return { ...state, cards, winner: card.identity };
    }

    const revealed = { ...state, cards };

    return card.identity === state.currentTeam ? revealed : endTurn(revealed);
}
