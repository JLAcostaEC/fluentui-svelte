<script lang="ts">
	import { AnnotatedScrollBar, Label } from '#lib/index.js';
	import type { AnnotatedScrollBarDetail, AnnotatedScrollBarProps } from '../types.ts';

	let {
		count = 6,
		first = '2023',
		subgroups = false,
		customDetail = false,
		...props
	}: Partial<AnnotatedScrollBarProps> & {
		count?: number;
		first?: string;
		subgroups?: boolean;
		customDetail?: boolean;
	} = $props();

	let target = $state<HTMLDivElement | null>(null);
	let other = $state<HTMLDivElement | null>(null);
	let swapped = $state(false);
</script>

<Label label="Photo timeline">
	<AnnotatedScrollBar
		scrollRef={swapped ? other : target}
		arrowStep={40}
		detail={customDetail ? preview : undefined}
		style="height:300px"
		{...props}
	/>
</Label>
<div id="photos" bind:this={target} data-testid="target" style="height:200px; width:300px; overflow:auto;">
	{#each { length: count }, index (index)}
		<section data-scroll-label={index ? 2023 - index : first} style="height:200px;">
			{#if subgroups && !index}
				<div style="display:flex; height:50px;">
					<div data-scroll-subgroup="June" style="width:50%;">June</div>
					<div data-scroll-subgroup="July" style="width:50%;">July</div>
				</div>
				<div style="height:30px;"></div>
				<div data-scroll-subgroup="December" style="height:50px;">December</div>
			{/if}
		</section>
	{/each}
</div>
<div bind:this={other} style="height:100px; width:300px; overflow:auto;">
	<div style="height:500px;"></div>
</div>
<button onclick={() => (swapped = !swapped)}>Swap target</button>

{#snippet preview(detail: AnnotatedScrollBarDetail)}Preview {Math.round(detail.offset)}{/snippet}
