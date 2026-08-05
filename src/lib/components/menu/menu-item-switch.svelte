<script lang="ts">
	import { watch } from 'runed';
	import { PREFIX } from '$constants';
	import { Button, ToggleSwitch } from '$lib/index.js';
	import { invokeHandlers, RenderSoC } from '$internal';
	import { getMenuContext, COMPONENT_NAME as MENU_COMPONENT_NAME } from './menu.svelte.ts';
	import type { MenuItemActionableProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'menu-item-switch';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(),
		icon: Icon,
		secondaryContent,
		children,
		checked = $bindable(),
		disabled,
		id = ID,
		class: classes,
		name = id as string,
		value = id as string,
		subText,
		onclick,
		...attributes
	}: MenuItemActionableProps = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${MENU_COMPONENT_NAME}.`);

	const { hasIcons, hasCheckmarks } = context.config;

	const { toggleCheckbox } = context.methods;

	const { state: _state } = context;

	const marginLeft = $derived(1.5 * (+!!(hasIcons && !Icon) + +!!hasCheckmarks));

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
        <MenuItemSwitch secondaryContent="Item 1" hint="Ctrl + 1" {Icon}>Item 1</MenuItemSwitch>
        <MenuItemSwitch secondaryContent="Item 2" hint="Ctrl + 2">Item 2</MenuItemSwitch>
      </MenuGroup>
    </Menu>
    ```
-->
<Button
	as="div"
	{disabled}
	{id}
	appearance="subtle"
	onclick={(e: MouseEvent) => invokeHandlers(e, disabled, [onclick, () => toggleCheckbox(e, value, name)])}
	onkeydown={(e: KeyboardEvent) =>
		invokeHandlers(e, [e.key !== 'Enter', !!disabled], [onkeydown, () => toggleCheckbox(e, value, name)])}
	aria-checked={checked}
	role="menuitemcheckbox"
	style={`--margin-left: ${marginLeft}rem;}`}
	aria-label={secondaryContent ? `${secondaryContent}, Use ${secondaryContent}` : undefined}
	class="fs-menu-item-switch {hasIcons || hasCheckmarks ? 'align' : ''} {checked ? 'checked' : ''} {classes}"
	bind:ref
	{...attributes}
>
	<span class="label" aria-label="{secondaryContent}, Use {secondaryContent}">
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
		<ToggleSwitch
			{checked}
			aria-hidden="true"
			tabindex={-1}
			class="item-switch"
			labelAttributes={{ 'aria-hidden': 'true', tabindex: -1 }}
		/>
	</span>
	{#if secondaryContent}
		<span class="secondary-content" aria-hidden="true">{secondaryContent}</span>
	{/if}
</Button>

<style>
	:global(.fs-menu-item-switch.fs-button) {
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
			gap: 0.5rem;
			font-size: inherit;
			justify-content: space-between;
			flex: 1;
			& :global(> .item-switch) {
				margin-left: 1rem;
				pointer-events: none;
			}
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
