<script lang="ts">
  import { vocabStore, stats } from '$lib/stores/vocab';
  import { onMount } from 'svelte';

  onMount(() => {
    vocabStore.loadWords();
  });

  $: sortedWords = [...$vocabStore].sort((a, b) => {
    const aRatio = a.times_shown > 0 ? a.times_knew / a.times_shown : 0;
    const bRatio = b.times_shown > 0 ? b.times_knew / b.times_shown : 0;
    return aRatio - bRatio;
  });

  $: needsPractice = sortedWords.filter(w => {
    if (w.times_shown === 0) return true;
    const knewRatio = w.times_knew / w.times_shown;
    return knewRatio < 0.5 || w.times_didnt_know > w.times_knew;
  });

  $: mastered = sortedWords.filter(w => {
    if (w.times_shown < 3) return false;
    const knewRatio = w.times_knew / w.times_shown;
    return knewRatio >= 0.8;
  });
</script>

<svelte:head>
  <title>Statistics — Blitz</title>
</svelte:head>

<div class="space-y-8">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-2">Your Progress</h1>
    <p class="text-base-content/70">Track your learning journey</p>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div class="stat bg-base-200 rounded-lg shadow">
      <div class="stat-title">Total Words</div>
      <div class="stat-value text-primary">{$stats.total}</div>
      <div class="stat-desc">In your collection</div>
    </div>

    <div class="stat bg-base-200 rounded-lg shadow">
      <div class="stat-title">Times Shown</div>
      <div class="stat-value text-secondary">{$stats.totalShown}</div>
      <div class="stat-desc">Training sessions</div>
    </div>

    <div class="stat bg-base-200 rounded-lg shadow">
      <div class="stat-title">Knowledge Score</div>
      <div class="stat-value text-accent">{$stats.score}%</div>
      <div class="stat-desc">
        {#if $stats.score >= 80}
          Excellent!
        {:else if $stats.score >= 60}
          Good progress
        {:else if $stats.score >= 40}
          Keep going
        {:else}
          Just starting
        {/if}
      </div>
    </div>

    <div class="stat bg-base-200 rounded-lg shadow">
      <div class="stat-title">Need Practice</div>
      <div class="stat-value text-warning">{needsPractice.length}</div>
      <div class="stat-desc">Words to review</div>
    </div>
  </div>

  <div class="grid gap-6 md:grid-cols-2">
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-primary">Response Breakdown</h2>

        <div class="space-y-4 mt-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>I knew it</span>
              <span class="font-semibold">{$stats.totalKnew}</span>
            </div>
            <progress
              class="progress progress-success w-full"
              value={$stats.totalKnew}
              max={$stats.totalShown || 1}
            ></progress>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>Not sure</span>
              <span class="font-semibold">{$stats.totalNotSure}</span>
            </div>
            <progress
              class="progress progress-warning w-full"
              value={$stats.totalNotSure}
              max={$stats.totalShown || 1}
            ></progress>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>I didn't know it</span>
              <span class="font-semibold">{$stats.totalDidntKnow}</span>
            </div>
            <progress
              class="progress progress-error w-full"
              value={$stats.totalDidntKnow}
              max={$stats.totalShown || 1}
            ></progress>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-secondary">Mastery Level</h2>

        <div class="space-y-4 mt-4">
          <div class="flex justify-between items-center">
            <span class="text-sm">Mastered</span>
            <div class="badge badge-success">{mastered.length} words</div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm">Needs Practice</span>
            <div class="badge badge-warning">{needsPractice.length} words</div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm">Overall Progress</span>
            <div class="badge badge-primary">{$stats.score}%</div>
          </div>
        </div>

        {#if mastered.length > 0}
          <div class="divider"></div>
          <div>
            <h3 class="font-semibold text-sm mb-2">Recently Mastered</h3>
            <div class="space-y-1">
              {#each mastered.slice(0, 5) as word}
                <div class="text-xs text-base-content/70">
                  {word.word}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if needsPractice.length > 0}
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-warning">Words Needing Practice</h2>
        <p class="text-sm text-base-content/70 mb-4">
          These words could use more review
        </p>

        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Meaning</th>
                <th>Times Shown</th>
                <th>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {#each needsPractice.slice(0, 10) as word}
                <tr>
                  <td class="font-semibold">{word.word}</td>
                  <td class="text-base-content/70">{word.meaning}</td>
                  <td>{word.times_shown}</td>
                  <td>
                    {#if word.times_shown === 0}
                      <span class="badge badge-ghost">New</span>
                    {:else}
                      <span class="badge" class:badge-error={word.times_knew / word.times_shown < 0.3} class:badge-warning={word.times_knew / word.times_shown >= 0.3 && word.times_knew / word.times_shown < 0.6}>
                        {Math.round((word.times_knew / word.times_shown) * 100)}%
                      </span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="card-actions justify-end mt-4">
          <a href="/train" class="btn btn-primary">Practice Now</a>
        </div>
      </div>
    </div>
  {/if}
</div>
