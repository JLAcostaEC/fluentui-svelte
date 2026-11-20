<script lang="ts">
	import Docs from '#site/components/docs/docs.svelte';
	let { children } = $props();
</script>

<Docs>{@render children()}</Docs>
