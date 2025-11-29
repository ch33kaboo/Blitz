<script lang="ts">
  import { vocabStore, stats } from '$lib/stores/vocab';
  import { onMount } from 'svelte';

  onMount(() => {
    vocabStore.loadWords();
  });

  import "../app.css";
</script>

<svelte:head>
  <title>Blitz — German Vocabulary Trainer</title>
</svelte:head>

<div class="hero min-h-[70vh]">
  <div class="hero-content text-center">
    <div class="max-w-2xl">
      <h1 class="text-6xl font-bold mb-4">
        <span class="text-primary">⚡</span> Blitz
      </h1>
      <p class="text-3xl font-semibold mb-8 text-secondary">
        Learn faster. Remember longer.
      </p>
      <p class="text-lg mb-12 text-base-content/80">
        Master German vocabulary with intelligent spaced repetition.
        Add words, train consistently, and track your progress.
      </p>

      <div class="stats shadow bg-base-200 mb-8">
        <div class="stat">
          <div class="stat-title">Total Words</div>
          <div class="stat-value text-primary">{$stats.total}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Knowledge Score</div>
          <div class="stat-value text-secondary">{$stats.score}%</div>
        </div>
      </div>

      <div class="flex gap-4 justify-center flex-wrap">
        <a href="/add" class="btn btn-primary btn-lg">
          Add Words
        </a>
        <a href="/train" class="btn btn-secondary btn-lg">
          Start Training
        </a>
      </div>
    </div>
  </div>
</div>
