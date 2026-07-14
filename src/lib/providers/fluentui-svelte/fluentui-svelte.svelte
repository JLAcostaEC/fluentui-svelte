<script lang="ts">
	import { defineProperty, defineState } from '$internal';
	import { tabspot, type TabspotInstance } from 'tabspot';
	import { setGlobalFSContext, type FSProviderContext } from './fluentui-svelte.ts';
	import { onMount, type Snippet } from 'svelte';

	let {
		children,
		tabspotInstance,
		rtl = false
	}: {
		rtl?: boolean;
		tabspotInstance?: TabspotInstance;
		children?: Snippet;
	} = $props();

	let _state: FSProviderContext['state'] = defineState([
		(o) => defineProperty(o, 'rtl', () => rtl),
		(o) => defineProperty(o, 'tabspotInstance', () => tabspotInstance)
	]);

	setGlobalFSContext({ config: null, state: _state, events: null, methods: null });

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
