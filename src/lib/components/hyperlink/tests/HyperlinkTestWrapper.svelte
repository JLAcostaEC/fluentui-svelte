<script lang="ts">
	import { Hyperlink } from '$lib/index.js';
	import type { HyperlinkProps } from '$lib/components/hyperlink/types.js';

	let { label = 'Fluent UI Svelte', ...props }: Partial<HyperlinkProps> & { label?: string } = $props();
</script>

<Hyperlink {...props}>{label}</Hyperlink>
