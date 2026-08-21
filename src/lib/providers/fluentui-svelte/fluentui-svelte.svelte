<script lang="ts">
	import { tabspot, type TabspotInstance } from 'tabspot';
	import { setGlobalFSContext, type FSProviderContext } from './fluentui-svelte.ts';
	import { onMount, type Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { PersistedState } from 'runed';
	import { mode, setMode } from 'mode-watcher';

	let {
		children,
		tabspotInstance
	}: {
		tabspotInstance?: TabspotInstance;
		children?: Snippet;
	} = $props();

	// boolean flags for user preferences and null for system default
	let userReducedMotion = new PersistedState<boolean | null>('fluentui-svelte-reduced-motion', null);

	// Syncing
	let reducedMotion = $derived(userReducedMotion.current ?? prefersReducedMotion.current);

	const _state: FSProviderContext['state'] = {
		get tabspotInstance() {
			return tabspotInstance;
		},
		get reducedMotion() {
			return reducedMotion;
		},
		get theme() {
			return mode.current;
		}
	};

	setGlobalFSContext({
		config: null,
		state: _state,
		events: null,
		methods: {
			setReducedMotion: (value) => {
				userReducedMotion.current = value;
			},
			setTheme: (value) => {
				setMode(value);
			}
		}
	});

	onMount(() => {
		tabspotInstance ??= tabspot();

		return () => {
			tabspotInstance?.destroy();
		};
	});

	$effect(() => {
		const root = document.documentElement;

		root.dataset.fsReducedMotion = String(_state.reducedMotion);

		return () => {
			delete root.dataset.fsReducedMotion;
		};
	});
</script>

{@render children?.()}
