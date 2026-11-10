<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { dispatchFieldEvents, floating } from '#internal';
	import { offset, shift } from '@floating-ui/dom';
	import { Flyout, TextBoxButton, TextBox } from '#lib/index.js';
	import { ChevronUpFilled, ChevronDownFilled, ChevronUpDownFilled } from 'fluentui-icons-svelte';
	import type { NumberBoxProps } from './types.ts';
	import { onClickOutside } from 'runed';

	const ID = $props.id();
	/** Half of the width of the button that opens the flyout of the compact variant. */
	const BUTTON_HALF_WIDTH = 16;

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
		readonly,
		disabled,
		hideActionButtons,
		...attributes
	}: NumberBoxProps = $props();

	let openFlyout = $state(false);
	let locked = $derived(!!readonly || !!disabled);

	/** Steps the native field as its own spinner would, honoring `min`, `max` and `step`, then fires `input` and `change`. */
	const step = (direction: 1 | -1) => {
		if (!ref || locked) return;
		const previous = ref.value;
		try {
			if (direction > 0) ref.stepUp();
			else ref.stepDown();
		} catch {
			// `step="any"` has no step to take, so it moves by one.
			ref.valueAsNumber = (Number.isNaN(ref.valueAsNumber) ? 0 : ref.valueAsNumber) + direction;
		}
		if (ref.value !== previous) dispatchFieldEvents(ref);
	};

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
	{readonly}
	{disabled}
	{hideActionButtons}
	bind:value
	bind:ref
	inputmode="numeric"
>
	<!-- The steppers are action buttons too, so `hideActionButtons` hides them. -->
	{#if !hideActionButtons && variant === 'inline'}
		<TextBoxButton aria-label="Increase Number" disabled={locked} onclick={() => step(1)}>
			<ChevronUpFilled />
		</TextBoxButton>
		<TextBoxButton aria-label="Decrease Number" disabled={locked} onclick={() => step(-1)}>
			<ChevronDownFilled />
		</TextBoxButton>
	{:else if !hideActionButtons}
		<TextBoxButton aria-label="Open" disabled={locked} onclick={() => (openFlyout = !openFlyout)}>
			<ChevronUpDownFilled />
		</TextBoxButton>
		{#if openFlyout && !locked}
			<div
				class="flyout-absolute"
				{@attach wrapperRef
					? floating(wrapperRef, {
							placement: 'right',
							middleware: [
								// Centers the flyout on the button that opened it, whatever the width of the box.
								offset(({ rects }) => -(rects.floating.width / 2 + BUTTON_HALF_WIDTH)),
								shift({ crossAxis: true, padding: 8 })
							]
						})
					: undefined}
			>
				<Flyout>
					<div class="flex-column">
						<TextBoxButton aria-label="Increase Number" onclick={() => step(1)}>
							<ChevronUpFilled />
						</TextBoxButton>
						<TextBoxButton aria-label="Decrease Number" onclick={() => step(-1)}>
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
		left: 0;
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
