<script lang="ts">
	import { defineProperty, defineState } from '$internal';
	import { tabspot, type TabspotInstance } from 'tabspot';
	import { setGlobalFSContext, type FSProviderContext } from './fluentui-svelte.ts';
	import { onMount, type Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { MediaQuery } from 'svelte/reactivity';

	let {
		children,
		tabspotInstance,
		reducedMotion = prefersReducedMotion,
		rtl = false
	}: {
		rtl?: boolean;
		tabspotInstance?: TabspotInstance;
		reducedMotion?: boolean | MediaQuery;
		children?: Snippet;
	} = $props();

	let userReducedMotion = $state(false);

	let _reducedMotion = $derived(
		userReducedMotion || (typeof reducedMotion === 'boolean' ? reducedMotion : reducedMotion.current)
	);

	let _state: FSProviderContext['state'] = defineState([
		(o) => defineProperty(o, 'rtl', () => rtl),
		(o) => defineProperty(o, 'tabspotInstance', () => tabspotInstance),
		(o) => defineProperty(o, 'reducedMotion', () => _reducedMotion)
	]);

	setGlobalFSContext({
		config: null,
		state: _state,
		events: null,
		methods: {
			setReducedMotion: (value: boolean) => {
				userReducedMotion = value;
			}
		}
	});

	onMount(() => {
		tabspotInstance = tabspot();

		return () => {
			tabspotInstance?.destroy();
		};
	});

	$effect(() => {
		const isRTL = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl';

		if (rtl !== isRTL) {
			rtl = isRTL;
		}
	});
</script>

{@render children?.()}
