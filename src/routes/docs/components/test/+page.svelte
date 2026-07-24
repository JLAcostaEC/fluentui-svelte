<script lang="ts">
	import { DATA } from '$lib/components/auto-suggest-box/docs/index.js';
</script>

<DATA.docs />
<DATA.meta.icon />

{#each DATA.examples as Example}
	<Example />
{/each}
