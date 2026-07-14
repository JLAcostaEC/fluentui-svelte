<script lang="ts">
	let { data } = $props();
</script>

{#if data.docs}
	<data.docs />
{/if}
