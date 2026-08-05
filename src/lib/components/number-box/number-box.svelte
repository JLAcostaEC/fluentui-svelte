<script lang="ts">
	import { on } from 'svelte/events';
	import { floating } from '$internal';
	import { offset, shift } from '@floating-ui/dom';
	import { Flyout, TextBoxButton, TextBox } from '$lib/index.js';
	import { ChevronUpFilled, ChevronDownFilled, ChevronUpDownFilled } from 'fluentui-icons-svelte';
	import type { NumberBoxProps } from './types.ts';

	const ID = $props.id();

	let {
		id = 'input-' + ID,
		name = id,
		value = $bindable(),
		variant = 'inline',
		ref = $bindable(),
		placeholder = '',
		class: classes,
		...attributes
	}: NumberBoxProps = $props();

	let openFlyout = $state(false);
	let cleanEvent: () => void;

	let handler = (e: Event) => {
		if (!(e.target as HTMLElement).closest(`.${id}`)) {
			openFlyout = false;
			cleanEvent();
		}
	};

	const compactToggler = () => {
		openFlyout = true;
		cleanEvent = on(document, 'click', handler);
	};
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
<TextBox class={['fs-number-box', classes]} type="number" {id} {name} {placeholder} bind:value bind:ref {...attributes}>
	{#if variant === 'inline'}
		<TextBoxButton aria-label="Increase Number" onclick={() => (value = value ? ++value : 1)}>
			<ChevronUpFilled />
		</TextBoxButton>
		<TextBoxButton aria-label="Decrease Number" onclick={() => (value = value ? --value : -1)}>
			<ChevronDownFilled />
		</TextBoxButton>
	{:else}
		<TextBoxButton aria-label="Open" onclick={() => compactToggler()}>
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
		z-index: 2;
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
