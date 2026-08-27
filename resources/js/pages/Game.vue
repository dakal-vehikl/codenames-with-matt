<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

import { endTurn, newGame, otherTeam, remainingFor, reveal } from '@/game/game';
import type { Card, Team } from '@/game/game';

const game = ref(newGame());
const spymasterView = ref(false);
const handoff = ref(false);
const revealsThisTurn = ref(0);

const gameOver = computed(() => game.value.winner !== null);
const themeTeam = computed<Team>(
    () => game.value.winner ?? game.value.currentTeam,
);

const remaining = computed(() => ({
    red: remainingFor(game.value.cards, 'red'),
    blue: remainingFor(game.value.cards, 'blue'),
}));

const teamName: Record<Team, string> = { red: 'Red', blue: 'Blue' };

const tones: Record<
    Team,
    { page: string; bar: string; ring: string; text: string }
> = {
    red: {
        page: 'bg-red-50',
        bar: 'bg-red-600',
        ring: 'ring-red-300',
        text: 'text-red-600',
    },
    blue: {
        page: 'bg-blue-50',
        bar: 'bg-blue-600',
        ring: 'ring-blue-300',
        text: 'text-blue-600',
    },
};

const identityClasses: Record<Card['identity'], string> = {
    red: 'bg-red-600 text-white border-red-700',
    blue: 'bg-blue-600 text-white border-blue-700',
    neutral: 'bg-amber-100 text-stone-700 border-amber-200',
    assassin: 'bg-stone-900 text-white border-black',
};

watch(
    () => game.value.currentTeam,
    () => {
        if (!gameOver.value) {
            handoff.value = true;
        }
    },
);

function canReveal(card: Card): boolean {
    return (
        !card.revealed &&
        !gameOver.value &&
        !spymasterView.value &&
        !handoff.value
    );
}

function onReveal(index: number): void {
    if (!canReveal(game.value.cards[index])) {
        return;
    }

    const before = game.value;

    game.value = reveal(before, index);
    revealsThisTurn.value =
        game.value.currentTeam === before.currentTeam
            ? revealsThisTurn.value + 1
            : 0;
}

function onEndTurn(): void {
    game.value = endTurn(game.value);
    revealsThisTurn.value = 0;
}

function onStartTurn(): void {
    handoff.value = false;
}

function onNewGame(): void {
    game.value = newGame();
    spymasterView.value = false;
    handoff.value = false;
    revealsThisTurn.value = 0;
}

function cardClasses(card: Card): string {
    if (card.revealed) {
        return `${identityClasses[card.identity]} ${spymasterView.value ? 'opacity-30' : ''}`;
    }

    if (spymasterView.value) {
        return identityClasses[card.identity];
    }

    return canReveal(card) ? 'bg-white hover:bg-stone-50' : 'bg-white';
}

const CONFETTI_COUNT = 80;
const confettiColours = [
    '#facc15',
    '#fb923c',
    '#f472b6',
    '#a78bfa',
    '#4ade80',
    '#ffffff',
];

const confetti = computed(() => {
    if (!gameOver.value) {
        return [];
    }

    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        style: {
            left: `${(i / CONFETTI_COUNT) * 100}%`,
            backgroundColor: confettiColours[i % confettiColours.length],
            animationDelay: `${((i * 37) % 100) / 50}s`,
            animationDuration: `${2.5 + ((i * 13) % 10) / 5}s`,
        },
    }));
});
</script>

<template>
    <Head title="Codenames" />
    <div
        class="min-h-screen text-stone-900 transition-colors duration-500"
        :class="tones[themeTeam].page"
    >
        <div
            class="px-8 py-5 text-white transition-colors duration-500"
            :class="tones[themeTeam].bar"
        >
            <div class="mx-auto flex max-w-4xl items-center justify-between">
                <div>
                    <p
                        class="text-3xl font-bold tracking-tight"
                        data-testid="current-team"
                    >
                        <template v-if="game.winner"
                            >{{ teamName[game.winner] }} team wins!</template
                        >
                        <template v-else
                            >{{ teamName[game.currentTeam] }} team's
                            turn</template
                        >
                    </p>
                    <p class="mt-1 text-sm opacity-90">
                        <template v-if="game.winner"
                            >Press New Game to play again.</template
                        >
                        <template v-else-if="revealsThisTurn === 0"
                            >Spymaster gives a clue, then operatives tap
                            cards.</template
                        >
                        <template v-else
                            >{{ revealsThisTurn }} revealed this turn — keep
                            going or pass.</template
                        >
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2 text-sm">
                        <input v-model="spymasterView" type="checkbox" />
                        Spymaster View
                    </label>
                    <button
                        type="button"
                        class="rounded-md bg-white/20 px-4 py-2 font-semibold hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="gameOver || handoff"
                        @click="onEndTurn"
                    >
                        Pass to {{ teamName[otherTeam(game.currentTeam)] }} →
                    </button>
                    <button
                        type="button"
                        class="rounded-md bg-white px-4 py-2 font-semibold text-stone-900 hover:bg-stone-100"
                        @click="onNewGame"
                    >
                        New Game
                    </button>
                </div>
            </div>
        </div>

        <div
            class="mx-auto flex max-w-4xl items-center justify-center gap-10 py-4 text-xl font-semibold"
        >
            <span
                class="text-red-600"
                :class="{ 'opacity-40': themeTeam !== 'red' }"
                >Red · {{ remaining.red }} left</span
            >
            <span
                class="text-blue-600"
                :class="{ 'opacity-40': themeTeam !== 'blue' }"
                >Blue · {{ remaining.blue }} left</span
            >
        </div>

        <div
            class="relative mx-auto max-w-4xl rounded-xl p-3 ring-4 transition-all duration-500"
            :class="tones[themeTeam].ring"
        >
            <div
                class="grid grid-cols-5 gap-3 transition-all duration-300"
                :class="{ 'blur-sm': handoff }"
            >
                <button
                    v-for="(card, index) in game.cards"
                    :key="card.word"
                    type="button"
                    class="flex h-24 items-center justify-center rounded-lg border border-stone-300 text-lg font-medium uppercase shadow-sm transition-colors"
                    :class="[
                        cardClasses(card),
                        canReveal(card) ? 'cursor-pointer' : 'cursor-default',
                    ]"
                    :disabled="!canReveal(card)"
                    @click="onReveal(index)"
                >
                    {{ card.word }}
                </button>
            </div>

            <Transition
                enter-active-class="transition duration-300"
                enter-from-class="translate-y-4 opacity-0"
            >
                <div
                    v-if="handoff"
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <div
                        class="flex flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center shadow-2xl"
                    >
                        <p
                            class="text-sm font-bold tracking-widest text-stone-500 uppercase"
                        >
                            Turn over
                        </p>
                        <p
                            class="text-3xl font-black"
                            :class="tones[game.currentTeam].text"
                        >
                            Pass the screen to
                            {{ teamName[game.currentTeam] }} team
                        </p>
                        <button
                            type="button"
                            class="rounded-lg px-8 py-3 text-lg font-semibold text-white"
                            :class="tones[game.currentTeam].bar"
                            @click="onStartTurn"
                        >
                            Start {{ teamName[game.currentTeam] }}'s turn
                        </button>
                    </div>
                </div>
            </Transition>

            <div
                v-if="game.winner"
                class="absolute inset-0 flex items-center justify-center bg-white/50"
            >
                <p
                    class="rounded-2xl px-12 py-6 text-5xl font-black text-white shadow-2xl"
                    :class="tones[game.winner].bar"
                    data-testid="winner"
                >
                    🎉 {{ teamName[game.winner] }} team wins!
                </p>
            </div>
        </div>

        <div
            v-if="game.winner"
            class="pointer-events-none fixed inset-0 overflow-hidden"
            aria-hidden="true"
        >
            <span
                v-for="piece in confetti"
                :key="piece.id"
                class="confetti absolute -top-4 h-3 w-2 rounded-sm"
                :style="piece.style"
            />
        </div>
    </div>
</template>

<style scoped>
.confetti {
    animation-name: confetti-fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@keyframes confetti-fall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }

    100% {
        transform: translateY(110vh) rotate(720deg);
        opacity: 0.6;
    }
}
</style>
