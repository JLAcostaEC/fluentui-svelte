<script lang="ts">
	import { Checkbox } from '$lib/index.js';
	import type { CheckboxProps } from '$lib/components/checkbox/types.js';

	let { label = 'Checkbox', ...props }: Partial<CheckboxProps> & { label?: string } = $props();
</script>

<Checkbox {...props}>{label}</Checkbox>
