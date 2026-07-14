<script lang="ts">
	import { watch } from 'runed';
	import CheckmarkFilled from 'fluentui-icons-svelte/CheckmarkFilled.svelte';
	import { Button } from '$lib/index.js';
	import { PREFIX } from '$constants';
	import { invokeHandlers, RenderSoC } from '$internal';
	import { getMenuContext, COMPONENT_NAME as MENU_COMPONENT_NAME } from './menu.svelte.ts';
	import type { MenuItemActionableProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'menu-item-radio';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(),
		icon: Icon,
		secondaryContent,
		children,
		checked = $bindable(),
		disabled,
		class: classes,
		id = ID,
		name = id as string,
		value = id as string,
		onclick,
		subText,
		...attributes
	}: MenuItemActionableProps = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${MENU_COMPONENT_NAME}.`);

	const { hasIcons, persistOnItemActivation } = context.config;

	const { toggleRadio, toggle } = context.methods;

	const { state: _state } = context;

	watch(
		() => _state.checkedValues?.[name]?.includes(value),
		() => {
			checked = _state.checkedValues?.[name]?.includes(value) || false;
		}
	);
</script>

<!--
@component

- Usage:
  ```tsx
    <Menu hasIcons>
      <MenuGroup name="Inputs">
        <MenuItemRadio secondaryContent="Item 1" hint="Ctrl + 1" {Icon}>Item 1</MenuItemRadio>
        <MenuItemRadio secondaryContent="Item 2" hint="Ctrl + 2">Item 2</MenuItemRadio>
      </MenuGroup>
    </Menu>
    ```
-->
<Button
	as="div"
	{disabled}
	appearance="subtle"
	onclick={(e: MouseEvent) =>
		invokeHandlers(e, !!disabled, [onclick, () => toggleRadio(e, value, name), !!persistOnItemActivation && toggle])}
	onkeydown={(e: KeyboardEvent) =>
		invokeHandlers(
			e,
			[e.key !== 'Enter', !!disabled],
			[onkeydown, () => toggleRadio(e, value, name), !!persistOnItemActivation && toggle]
		)}
	aria-checked={checked}
	role="menuitemradio"
	style={`--margin-left: ${hasIcons && !Icon ? 1.5 : 0}rem;}`}
	aria-label={secondaryContent ? `${secondaryContent}, Use ${secondaryContent}` : undefined}
	class="fs-menu-item-radio {hasIcons ? 'align' : ''} {checked ? 'checked' : ''} {classes}"
	bind:ref
	{...attributes}
>
	<span class="label" aria-label="{secondaryContent}, Use {secondaryContent}">
		<CheckmarkFilled class="indicator" />
		{#if Icon}
			<RenderSoC SoC={Icon} class="menu-item-icon" args={[{ class: 'menu-item-icon' }]} />
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
	:global(.fs-menu-item-radio.fs-button) {
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
		}
		& .secondary-content {
			font-size: var(--fs-caption-font-size);
			color: var(--fs-text-secondary);
			margin-left: 0.6rem;
		}
		&:global(.align .label:not(:has(.menu-item-icon))) {
			margin-left: var(--margin-left) !important;
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
		& :global(svg.indicator) {
			width: 20px;
			opacity: 0;
		}
		&.checked :global(svg.indicator) {
			opacity: 1;
		}
	}
</style>
