<script lang="ts">
	import { Button } from '$lib/index.js';
	import { getMenuContext, COMPONENT_NAME as MENU_COMPONENT_NAME } from './menu.svelte.ts';
	import { PREFIX } from '$constants';
	import { invokeHandlers, RenderSoC } from '$internal';
	import type { MenuItemProps } from './types.ts';
	import type { ComponentProps } from 'svelte';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'menu-item';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(),
		icon: Icon,
		secondaryContent,
		children,
		href,
		id = ID,
		disabled,
		class: classes,
		onclick,
		onkeydown,
		subText,
		...attributes
	}: MenuItemProps & ComponentProps<typeof Button> = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${MENU_COMPONENT_NAME}.`);

	const { hasIcons, hasCheckmarks, persistOnItemActivation } = context.config;

	const { toggle } = context.methods;

	const marginLeft = $derived(1.5 * (+!!(hasIcons && !Icon) + +!!hasCheckmarks));
</script>

<!--
@component

- Usage:
  ```tsx
    <Menu hasIcons>
      <MenuGroup name="Inputs">
        <MenuItem secondaryContent="Item 1" hint="Ctrl + 1" {Icon}>Item 1</MenuItem>
        <MenuItem secondaryContent="Item 2" hint="Ctrl + 2">Item 2</MenuItem>
      </MenuGroup>
    </Menu>
    ```
-->
<Button
	{href}
	{disabled}
	{id}
	role="menuitem"
	appearance="subtle"
	onclick={(e: MouseEvent) => invokeHandlers(e, !!disabled, [onclick, () => !!persistOnItemActivation && toggle])}
	onkeydown={(e: KeyboardEvent) =>
		invokeHandlers(e, [e.key !== 'Enter', !!disabled], [onkeydown, () => !!persistOnItemActivation && toggle])}
	as={href ? 'a' : 'button'}
	style={`--margin-left: ${marginLeft}rem;`}
	class="fs-menu-item {hasIcons || hasCheckmarks ? 'align' : ''} {classes}"
	bind:ref
	{...attributes}
>
	<span class="label" aria-label="{secondaryContent}, Use {secondaryContent}">
		{#if Icon}
			<RenderSoC SoC={Icon} args={[{ class: 'menu-item-icon' }]} class="menu-item-icon" />
		{/if}
		{#if subText}
			<span class="sub-text">
				{@render children?.()}
				<small>{subText}</small>
			</span>
		{:else}
			{@render children?.()}
		{/if}
	</span>
	{#if secondaryContent}
		<span class="secondary-content" aria-hidden="true">{secondaryContent}</span>
	{/if}
</Button>

<style>
	:global(.fs-menu-item.fs-button) {
		width: 100%;
		padding: 0.375rem 0.45rem;
		border-radius: var(--fs-control-inner-border-radius);
		justify-content: space-between;
		font-size: var(--fs-body2-font-size);
		line-height: var(--fs-caption-line-height);
		& :global(svg) {
			width: 1.25rem;
			fill: currentColor;
			& > :global(path) {
				fill: currentColor;
			}
		}
		& .label {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			font-size: inherit;
			line-height: inherit;
		}
		& .secondary-content {
			font-size: var(--fs-caption-font-size);
			color: var(--fs-text-secondary);
			margin-left: 0.6rem;
		}
		& :global(svg.indicator) {
			width: 1rem;
			height: auto;
			margin-left: 0.6rem;
			margin-right: 0.2rem;
			color: var(--fs-text-secondary);
		}
		&:global(.align) {
			& .label:not(:has(.menu-item-icon)),
			& .label:not(:has(.fs-menu-item-checkmark, .fs-menu-item-radio, .fs-menu-item-switch)) {
				margin-left: var(--margin-left) !important;
			}
		}
		& .sub-text {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			text-align: left;
			font-size: inherit;
			& small {
				font-size: var(--fs-caption2-font-size);
				color: var(--fs-text-secondary);
			}
		}
	}
</style>
