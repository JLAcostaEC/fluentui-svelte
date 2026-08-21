<script lang="ts">
	import { ToggleSwitch } from '$lib/index.js';
	import type { ToggleSwitchProps } from '$lib/components/toggle-switch/types.js';

	let { checked = $bindable(false), ...props }: Partial<ToggleSwitchProps> = $props();
</script>

<ToggleSwitch bind:checked {...props} />

<p data-testid="state">{checked ? 'on' : 'off'}</p>
