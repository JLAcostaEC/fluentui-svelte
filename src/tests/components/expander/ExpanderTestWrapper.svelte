<script lang="ts">
	import { Expander } from '$lib/index.js';
	import type { ExpanderProps } from '$lib/components/expander/types.ts';

	let { content = 'Expander content', ...props }: Partial<ExpanderProps> & { content?: string } = $props();
</script>

<Expander header="Expander header" {...props}>
	<p data-testid="expander-content">{content}</p>
</Expander>
