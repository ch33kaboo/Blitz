import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/supabase';

export interface Word {
	id: string;
	word: string;
	meaning: string;
	times_shown: number;
	times_knew: number;
	times_didnt_know: number;
	times_not_sure: number;
	last_seen: string | null;
	created_at: string;
}

function createVocabStore() {
	const { subscribe, set, update } = writable<Word[]>([]);

	return {
		subscribe,

		async loadWords() {
			const { data, error } = await supabase
				.from('words')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error loading words:', error);
				return;
			}

			set(data || []);
		},

		async addWord(word: string, meaning: string) {
			const { data, error } = await supabase
				.from('words')
				.insert([
					{
						word,
						meaning,
						times_shown: 0,
						times_knew: 0,
						times_didnt_know: 0,
						times_not_sure: 0,
						last_seen: null
					}
				])
				.select()
				.maybeSingle();

			if (error) {
				console.error('Error adding word:', error);
				return;
			}

			if (data) {
				update((words) => [data, ...words]);
			}
		},

		async deleteWord(id: string) {
			const { error } = await supabase.from('words').delete().eq('id', id);

			if (error) {
				console.error('Error deleting word:', error);
				return;
			}

			update((words) => words.filter((w) => w.id !== id));
		},

		async updateWordStats(id: string, response: 'knew' | 'didnt_know' | 'not_sure') {
			let updateData: any = {
				last_seen: new Date().toISOString()
			};

			const { data: currentWord } = await supabase
				.from('words')
				.select('*')
				.eq('id', id)
				.maybeSingle();

			if (!currentWord) return;

			updateData.times_shown = currentWord.times_shown + 1;

			if (response === 'knew') {
				updateData.times_knew = currentWord.times_knew + 1;
			} else if (response === 'didnt_know') {
				updateData.times_didnt_know = currentWord.times_didnt_know + 1;
			} else {
				updateData.times_not_sure = currentWord.times_not_sure + 1;
			}

			const { error } = await supabase.from('words').update(updateData).eq('id', id);

			if (error) {
				console.error('Error updating word stats:', error);
				return;
			}

			update((words) => words.map((w) => (w.id === id ? { ...w, ...updateData } : w)));
		},

		selectNextWord(words: Word[]): Word | null {
			if (words.length === 0) return null;

			const unseen = words.filter((w) => w.times_shown === 0);
			if (unseen.length > 0) {
				return unseen[Math.floor(Math.random() * unseen.length)];
			}

			const weightedWords: { word: Word; weight: number }[] = words.map((w) => {
				let weight = 10;

				if (w.times_didnt_know > 0) {
					weight += w.times_didnt_know * 50;
				}

				if (w.times_not_sure > 0) {
					weight += w.times_not_sure * 20;
				}

				if (w.times_knew > 0) {
					weight = Math.max(1, weight - w.times_knew * 10);
				}

				const daysSinceLastSeen = w.last_seen
					? (Date.now() - new Date(w.last_seen).getTime()) / (1000 * 60 * 60 * 24)
					: 999;

				weight += daysSinceLastSeen * 5;

				return { word: w, weight };
			});

			const totalWeight = weightedWords.reduce((sum, w) => sum + w.weight, 0);
			let random = Math.random() * totalWeight;

			for (const { word, weight } of weightedWords) {
				random -= weight;
				if (random <= 0) {
					return word;
				}
			}

			return words[0];
		}
	};
}

export const vocabStore = createVocabStore();

export const stats = derived(vocabStore, ($vocabStore) => {
	const total = $vocabStore.length;
	const totalShown = $vocabStore.reduce((sum, w) => sum + w.times_shown, 0);
	const totalKnew = $vocabStore.reduce((sum, w) => sum + w.times_knew, 0);
	const totalDidntKnow = $vocabStore.reduce((sum, w) => sum + w.times_didnt_know, 0);
	const totalNotSure = $vocabStore.reduce((sum, w) => sum + w.times_not_sure, 0);

	const score = totalShown > 0 ? Math.round((totalKnew / totalShown) * 100) : 0;

	return {
		total,
		totalShown,
		totalKnew,
		totalDidntKnow,
		totalNotSure,
		score
	};
});
