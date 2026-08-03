<script lang="ts">
	import { Checkbox } from '$lib/index.js';
	import type { CheckboxProps } from '$lib/components/checkbox/types.js';

	let { label = 'Checkbox', ...props }: Partial<CheckboxProps<'label'>> & { label?: string } = $props();
</script>

<Checkbox wrapperAs="label" {...props}>{label}</Checkbox>
