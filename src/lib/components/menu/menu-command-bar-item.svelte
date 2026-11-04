<script lang="ts">
	import { Button } from '#lib/index.js';
	import { RenderSoC } from '#internal';
	import { getMenuCommandBarContext, getMenuContext, COMPONENT_NAME as MENU_COMPONENT_NAME } from './menu.svelte.ts';
	import type { MenuCommandBarItemProps } from './types.ts';

	let {
		ref = $bindable(null),
		icon,
		label,
		disabled,
		onclick,
		class: classes,
		...attributes
	}: MenuCommandBarItemProps = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${MENU_COMPONENT_NAME}.`);

	const { toggle } = context.methods;

	const commandBarContext = getMenuCommandBarContext();

	// A visible label names the button itself, a hidden one names it and shows as its tooltip.
	const showLabel = $derived(!!commandBarContext?.showLabels);
</script>

<!--
@component

A command of a `MenuCommandBar`: a square icon whose label names it and shows as its tooltip, or the icon with the label below it when the bar shows labels.

- Usage:
  ```tsx
    <MenuCommandBar>
      <MenuCommandBarItem icon={CutRegular} label="Cut" onclick={cut} />
    </MenuCommandBar>
  ```
-->
<Button
	{...attributes}
	bind:ref
	{disabled}
	role="menuitem"
	appearance="subtle"
	aria-label={showLabel ? undefined : label}
	title={showLabel ? undefined : label}
	class={['fs-menu-command-bar-item', classes]}
	onclick={(e: MouseEvent) => {
		if (disabled) return;
		onclick?.(e);
		if (!context.config.persistOnItemActivation) toggle(e);
	}}
>
	<RenderSoC SoC={icon} args={{ class: 'fs-menu-command-bar-item-icon' }} />
	{#if showLabel}
		<span class="fs-menu-command-bar-item-label">{label}</span>
	{/if}
</Button>
<!-- The layout is drawn by MenuCommandBar, which styles the overflow button the same way. -->
