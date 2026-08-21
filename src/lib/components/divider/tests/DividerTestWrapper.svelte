<script lang="ts">
	import { Divider } from '$lib/index.js';
	import type { DividerProps } from '$lib/components/divider/types.js';

	let { label = 'Section', ...props }: Partial<DividerProps<'div'>> & { label?: string } = $props();
</script>

<Divider {...props}>{label}</Divider>
