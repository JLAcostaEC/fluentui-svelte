<script lang="ts">
	import { untrack } from 'svelte';
	import FlipView from '../flip-view.svelte';
	import type { Horientation } from '#types';

	let { orientation = 'horizontal', initial = 0 }: { orientation?: Horientation; initial?: number } = $props();
	let index = $state(untrack(() => initial));
	let changes = $state<number[]>([]);
</script>

<FlipView
	aria-label="Gallery"
	{orientation}
	bind:index
	onIndexChange={(i) => changes.push(i)}
	style="width: 300px; height: 200px;"
>
	{#each ['One', 'Two', 'Three'] as name (name)}
		<section><a href="#{name}">{name}</a></section>
	{/each}
</FlipView>
<button onclick={() => (index = 2)}>Go to last</button>
<button onclick={() => (index = 99)}>Go out of range</button>
<output data-testid="index">{index}</output>
<output data-testid="changes">{changes.join(',')}</output>
