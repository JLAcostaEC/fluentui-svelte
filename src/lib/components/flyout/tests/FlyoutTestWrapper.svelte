<script lang="ts">
	import { Flyout } from '$lib/index.js';
	import type { FlyoutProps } from '$lib/components/flyout/types.js';

	let { content = 'Flyout content', ...props }: Partial<FlyoutProps> & { content?: string } = $props();
</script>

<Flyout {...props}>
	<span data-testid="flyout-content">{content}</span>
</Flyout>
