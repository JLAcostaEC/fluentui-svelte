<script lang="ts">
	import ScrollBar from '../scroll-bar.svelte';
	let target = $state<HTMLElement | null>(null);
</script>

<div bind:this={target} data-testid="target" style="width: 200px; height: 100px;">
	<div style="height: 600px;">Target content</div>
</div>
<ScrollBar scrollRef={target} expanded viewportAttributes={{ 'aria-label': 'External' }} />
