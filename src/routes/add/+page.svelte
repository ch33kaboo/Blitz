<script lang="ts">
  import { vocabStore } from '$lib/stores/vocab';
  import { onMount } from 'svelte';

  let word = '';
  let meaning = '';
  let isAdding = false;

  onMount(() => {
    vocabStore.loadWords();
  });

  async function handleAddWord() {
    if (!word.trim() || !meaning.trim()) {
      return;
    }

    isAdding = true;
    await vocabStore.addWord(word.trim(), meaning.trim());
    word = '';
    meaning = '';
    isAdding = false;
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this word?')) {
      await vocabStore.deleteWord(id);
    }
  }
</script>

<svelte:head>
  <title>Add Words — Blitz</title>
</svelte:head>

<div class="space-y-8">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-2">Add Vocabulary</h1>
    <p class="text-base-content/70">Build your personal word collection</p>
  </div>

  <div class="card bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-primary">New Word</h2>

      <form on:submit|preventDefault={handleAddWord} class="space-y-4">
        <div class="form-control">
          <label class="label" for="word">
            <span class="label-text">Word</span>
          </label>
          <input
            id="word"
            type="text"
            placeholder="e.g., der Apfel"
            class="input input-bordered w-full"
            bind:value={word}
            disabled={isAdding}
            required
          />
        </div>

        <div class="form-control">
          <label class="label" for="meaning">
            <span class="label-text">Meaning / Translation</span>
          </label>
          <textarea
            id="meaning"
            placeholder="e.g., the apple"
            class="textarea textarea-bordered h-24"
            bind:value={meaning}
            disabled={isAdding}
            required
          ></textarea>
        </div>

        <div class="card-actions justify-end">
          <button
            type="submit"
            class="btn btn-primary"
            disabled={isAdding || !word.trim() || !meaning.trim()}
          >
            {isAdding ? 'Adding...' : 'Add Word'}
          </button>
        </div>
      </form>
    </div>
  </div>

  <div>
    <h2 class="text-2xl font-bold mb-4">Your Vocabulary ({$vocabStore.length})</h2>

    {#if $vocabStore.length === 0}
      <div class="alert">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>No words yet. Add your first word above!</span>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each $vocabStore as item (item.id)}
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
            <div class="card-body p-4">
              <h3 class="card-title text-lg">{item.word}</h3>
              <p class="text-base-content/70">{item.meaning}</p>

              {#if item.times_shown > 0}
                <div class="text-xs text-base-content/50 mt-2">
                  Shown {item.times_shown} time{item.times_shown !== 1 ? 's' : ''}
                </div>
              {/if}

              <div class="card-actions justify-end mt-2">
                <button
                  class="btn btn-ghost btn-sm btn-error"
                  on:click={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
