<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

import { endTurn, newGame, remainingFor, reveal } from '@/game/game';
import type { Card, Team } from '@/game/game';

const game = ref(newGame());
const spymasterView = ref(false);

const gameOver = computed(() => game.value.winner !== null);

const remaining = computed(() => ({
    red: remainingFor(game.value.cards, 'red'),
    blue: remainingFor(game.value.cards, 'blue'),
}));

function canReveal(card: Card): boolean {
    return !card.revealed && !gameOver.value && !spymasterView.value;
}

function onReveal(index: number): void {
    if (!canReveal(game.value.cards[index])) {
        return;
    }

    game.value = reveal(game.value, index);
}

function onEndTurn(): void {
    game.value = endTurn(game.value);
}

function onNewGame(): void {
    game.value = newGame();
    spymasterView.value = false;
}

const identityClasses: Record<Card['identity'], string> = {
    red: 'bg-red-600 text-white border-red-700',
    blue: 'bg-blue-600 text-white border-blue-700',
    neutral: 'bg-amber-100 text-stone-700 border-amber-200',
    assassin: 'bg-stone-900 text-white border-black',
};

const teamClasses: Record<Team, string> = {
    red: 'text-red-600',
    blue: 'text-blue-600',
};

const teamBgClasses: Record<Team, string> = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
};

function cardClasses(card: Card): string {
    if (card.revealed) {
        return `${identityClasses[card.identity]} ${spymasterView.value ? 'opacity-30' : ''}`;
    }

    if (spymasterView.value) {
        return identityClasses[card.identity];
    }

    return gameOver.value ? 'bg-white' : 'bg-white hover:bg-stone-50';
}
</script>

<template>
    <Head title="Codenames" />
    <div
        class="flex min-h-screen flex-col items-center gap-6 bg-stone-100 p-8 text-stone-900"
    >
        <header class="flex w-full max-w-4xl items-center justify-between">
            <h1 class="text-2xl font-semibold">Codenames</h1>
            <p class="text-lg">
                Turn:
                <span
                    class="font-semibold capitalize"
                    :class="teamClasses[game.currentTeam]"
                    data-testid="current-team"
                >
                    {{ game.currentTeam }}
                </span>
            </p>
            <p class="text-lg">
                <span class="font-semibold text-red-600"
                    >Red {{ remaining.red }}</span
                >
                <span class="mx-2 text-stone-400">·</span>
                <span class="font-semibold text-blue-600"
                    >Blue {{ remaining.blue }}</span
                >
            </p>
            <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 text-sm font-medium">
                    <input v-model="spymasterView" type="checkbox" />
                    Spymaster View
                </label>
                <button
                    type="button"
                    class="rounded-md bg-stone-800 px-4 py-2 font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="gameOver"
                    @click="onEndTurn"
                >
                    End Turn
                </button>
                <button
                    type="button"
                    class="rounded-md border border-stone-400 bg-white px-4 py-2 font-medium hover:bg-stone-50"
                    @click="onNewGame"
                >
                    New Game
                </button>
            </div>
        </header>

        <p
            v-if="game.winner"
            class="rounded-lg px-6 py-3 text-xl font-semibold text-white"
            :class="teamBgClasses[game.winner]"
            data-testid="winner"
        >
            <span class="capitalize">{{ game.winner }}</span> team wins!
        </p>

        <div class="grid w-full max-w-4xl grid-cols-5 gap-3">
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
    </div>
</template>
