<script lang="ts">
	import { Label, TextBox } from '$lib/index.js';
	import type { LabelProps } from '$lib/components/label/types.js';

	const id = $props.id();
	let { field = 'Field', ...props }: Partial<LabelProps> & { field?: string } = $props();
</script>

<Label label={field} for={id} {...props}><TextBox {id} hideActionButtons /></Label>
