<script lang="ts">
	import { page } from '$app/state';

	let { data } = $props();
</script>

{#if data.docs}
	<data.docs />
{/if}

<style>
	:global(#docs table.fs-docs tbody tr td) {
		font-size: var(--fs-caption-font-size);
	}
	:global(#docs table.fs-docs tbody tr td:nth-child(2)) {
		min-width: 160px;
		max-width: 220px;
	}
</style>
