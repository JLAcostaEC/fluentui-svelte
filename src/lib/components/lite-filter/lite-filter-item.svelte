<script lang="ts">
	import { PillButton } from '#lib/index.js';
	import { getLiteFilterContext } from './lite-filter-context.svelte.ts';
	import type { LiteFilterItemProps } from './types.ts';

	let { ref = $bindable(null), value, icon, disabled = false, children }: LiteFilterItemProps = $props();

	const context = getLiteFilterContext();

	if (!context)
		throw new Error('LiteFilter context is not available. Make sure this component is used within a LiteFilter.');

	const { config, methods } = context;
	const checked = $derived(methods.isSelected(value));

	// With single selection, the selected pill stays selected, like a radio.
	const onclick = (e: MouseEvent) => {
		if (!config.multiple && checked) e.preventDefault();
	};
</script>

<PillButton
	bind:ref
	{value}
	{icon}
	{checked}
	name={config.name}
	form={config.form}
	size={config.size}
	appearance={config.appearance}
	disabled={config.disabled || disabled}
	role={config.multiple ? undefined : 'radio'}
	aria-checked={config.multiple ? undefined : checked}
	{onclick}
	onchange={(e) => methods.select(e, value, e.currentTarget.checked)}
	wrapperAttributes={{ class: 'fs-lite-filter-item' }}
>
	{@render children?.()}
</PillButton>
