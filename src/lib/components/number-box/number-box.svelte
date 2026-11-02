<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { floating } from '$internal';
	import { offset, shift } from '@floating-ui/dom';
	import { Flyout, TextBoxButton, TextBox } from '$lib/index.js';
	import { ChevronUpFilled, ChevronDownFilled, ChevronUpDownFilled } from 'fluentui-icons-svelte';
	import type { NumberBoxProps } from './types.ts';
	import { onClickOutside } from 'runed';

	const ID = $props.id();

	const label = claimLabel(() => id);

	let {
		id = label?.fieldId ?? 'input-' + ID,
		name = id,
		value = $bindable(null),
		variant = 'inline',
		ref = $bindable(null),
		wrapperRef = $bindable(null),
		wrapperAttributes,
		placeholder = '',
		...attributes
	}: NumberBoxProps = $props();

	let openFlyout = $state(false);

	onClickOutside(
		() => wrapperRef,
		() => (openFlyout = false)
	);
</script>

<!-- @component
  A number box component that displays a number input with an optional increase and decrease button.
  - Usage:
    ```tsx
    <script>
      import { NumberBox } from 'fluentui-svelte';
    </script>

    <NumberBox />
    ```
-->
<TextBox
	{...attributes}
	bind:wrapperRef
	wrapperAttributes={{ ...wrapperAttributes, class: ['fs-number-box', wrapperAttributes?.class] }}
	type="number"
	{id}
	{name}
	{placeholder}
	bind:value
	bind:ref
	inputmode="numeric"
>
	{#if variant === 'inline'}
		<TextBoxButton aria-label="Increase Number" onclick={() => (value = value ? ++value : 1)}>
			<ChevronUpFilled />
		</TextBoxButton>
		<TextBoxButton aria-label="Decrease Number" onclick={() => (value = value ? --value : -1)}>
			<ChevronDownFilled />
		</TextBoxButton>
	{:else}
		<TextBoxButton aria-label="Open" onclick={() => (openFlyout = !openFlyout)}>
			<ChevronUpDownFilled />
		</TextBoxButton>
		{#if openFlyout}
			<div
				class="flyout-absolute"
				{@attach ref
					? floating(ref, {
							placement: 'right',
							middleware: [
								shift({
									crossAxis: true
								}),
								offset(({ rects }) => {
									return -rects.reference.width / 1.4;
								})
							]
						})
					: undefined}
			>
				<Flyout>
					<div class="flex-column">
						<TextBoxButton aria-label="Increase Number" onclick={() => (value = value ? ++value : 1)}>
							<ChevronUpFilled />
						</TextBoxButton>
						<TextBoxButton aria-label="Decrease Number" onclick={() => (value = value ? --value : -1)}>
							<ChevronDownFilled />
						</TextBoxButton>
					</div>
				</Flyout>
			</div>
		{/if}
	{/if}
</TextBox>

<style>
	.flyout-absolute {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 3;
		& :global(.fs-flyout) {
			padding: 8px;
		}
		& div.flex-column {
			display: flex;
			flex-direction: column;
			gap: 12px;
			& :global(button) {
				margin: 0;
				& :global(svg) {
					width: 1.6rem;
					height: 1.6rem;
				}
			}
		}
	}
</style>
