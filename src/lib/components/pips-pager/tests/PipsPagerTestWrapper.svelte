<script lang="ts">
	import { PipsPager } from '#lib/index.js';
	import type { PipsPagerProps } from '#lib/components/pips-pager/types.js';

	let { index = $bindable(0), ...props }: Partial<PipsPagerProps> = $props();
	let changes: number[] = $state([]);
</script>

<PipsPager aria-label="Pages" numberOfPages={8} bind:index onIndexChange={(i) => changes.push(i)} {...props} />
<output data-testid="index">{index}</output>
<output data-testid="changes">{changes.join(',')}</output>
