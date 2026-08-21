<script lang="ts">
	import { Label } from '$lib/index.js';
	import type { LabelProps } from '$lib/components/label/types.js';

	let { field = 'Field', ...props }: Partial<LabelProps> & { field?: string } = $props();
</script>

<Label {...props}><input type="text" aria-label={field} /></Label>
