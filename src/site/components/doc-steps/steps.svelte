<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!--
	@component
	A numbered list of steps, joined by a line. Fill it with `Step` components.
-->
<ol class="doc-steps">
	{@render children()}
</ol>

<style>
	.doc-steps {
		align-self: stretch;
		min-width: 0;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: doc-step;
	}
</style>
