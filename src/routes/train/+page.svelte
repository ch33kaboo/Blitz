<script lang="ts">
  import { vocabStore, type Word } from '$lib/stores/vocab';
  import { onMount } from 'svelte';

  let currentWord: Word | null = null;
  let showMeaning = false;
  let sessionCount = 0;
  let isLoading = true;

  onMount(async () => {
    await vocabStore.loadWords();
    loadNextWord();
    isLoading = false;
  });

  function loadNextWord() {
    const words = $vocabStore;
    currentWord = vocabStore.selectNextWord(words);
    showMeaning = false;
  }

  function handleShowMeaning() {
    showMeaning = true;
  }

  async function handleResponse(response: 'knew' | 'didnt_know' | 'not_sure') {
    if (!currentWord) return;

    await vocabStore.updateWordStats(currentWord.id, response);
    sessionCount++;
    loadNextWord();
  }

  $: hasWords = $vocabStore.length > 0;
</script>

<svelte:head>
  <title>Training — Blitz</title>
</svelte:head>

<div class="space-y-8">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-2">Training Session</h1>
    <p class="text-base-content/70">Test your knowledge with spaced repetition</p>
    <div class="badge badge-primary badge-lg mt-4">
      Session: {sessionCount} word{sessionCount !== 1 ? 's' : ''}
    </div>
  </div>

  {#if isLoading}
    <div class="flex justify-center">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  {:else if !hasWords}
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <h2 class="card-title justify-center text-warning">No Words Available</h2>
        <p>Add some vocabulary words before starting your training session.</p>
        <div class="card-actions justify-center mt-4">
          <a href="/add" class="btn btn-primary">Add Words</a>
        </div>
      </div>
    </div>
  {:else if !currentWord}
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <h2 class="card-title justify-center text-success">Session Complete!</h2>
        <p>You've reviewed all available words in this session.</p>
        <div class="stats stats-vertical lg:stats-horizontal shadow mt-4">
          <div class="stat">
            <div class="stat-title">Words Reviewed</div>
            <div class="stat-value text-primary">{sessionCount}</div>
          </div>
        </div>
        <div class="card-actions justify-center mt-4">
          <button class="btn btn-primary" on:click={() => { sessionCount = 0; loadNextWord(); }}>
            Start New Session
          </button>
          <a href="/stats" class="btn btn-secondary">View Stats</a>
        </div>
      </div>
    </div>
  {:else}
    <div class="card bg-base-200 shadow-xl max-w-2xl mx-auto">
      <div class="card-body">
        <div class="text-center space-y-8 py-8">
          <div>
            <div class="text-sm text-base-content/50 mb-2">Word</div>
            <h2 class="text-5xl font-bold text-primary">{currentWord.word}</h2>
          </div>

          {#if !showMeaning}
            <div class="py-8">
              <button class="btn btn-secondary btn-lg" on:click={handleShowMeaning}>
                Show Meaning
              </button>
            </div>
          {:else}
            <div class="animate-fade-in">
              <div class="divider"></div>
              <div>
                <div class="text-sm text-base-content/50 mb-2">Meaning</div>
                <p class="text-2xl">{currentWord.meaning}</p>
              </div>

              <div class="divider">How well did you know it?</div>

              <div class="flex gap-4 justify-center flex-wrap">
                <button
                  class="btn btn-success gap-2"
                  on:click={() => handleResponse('knew')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  I knew it
                </button>

                <button
                  class="btn btn-warning gap-2"
                  on:click={() => handleResponse('not_sure')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Not sure
                </button>

                <button
                  class="btn btn-error gap-2"
                  on:click={() => handleResponse('didnt_know')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  I didn't know it
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
