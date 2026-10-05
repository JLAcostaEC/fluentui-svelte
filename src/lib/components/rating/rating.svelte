<script lang="ts">
	import { PREFIX } from '$constants';
	import StarFilled from 'fluentui-icons-svelte/StarFilled.svelte';
	import StarHalfFilled from 'fluentui-icons-svelte/StarHalfFilled.svelte';
	import StarOneQuarterFilled from 'fluentui-icons-svelte/StarOneQuarterFilled.svelte';
	import StarRegular from 'fluentui-icons-svelte/StarRegular.svelte';
	import StarThreeQuarterFilled from 'fluentui-icons-svelte/StarThreeQuarterFilled.svelte';
	import type { RatingProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'rating';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		value = $bindable(0),
		max = 5,
		step = 1,
		size = 'extra-large',
		iconFilled,
		iconOutline,
		name = ID,
		itemLabel = (rating) => `${rating}`,
		onChange,
		class: classes,
		ref = $bindable(),
		role = 'radiogroup',
		...attributes
	}: RatingProps = $props();

	/** Until the user rates, the value is only displayed, so it is drawn with the precision of a quarter. */
	let rated = $state(false);
	let hovered = $state<number>();

	const _max = $derived.by(() => {
		if (!Number.isInteger(max) || max <= 1) throw new Error('Max must be a whole number greater than 1');
		return max;
	});
	const items = $derived(Array.from({ length: _max }, (_, index) => index + 1));
	const shown = $derived(hovered ?? value);

	const custom = $derived(!!(iconFilled || iconOutline));

	/** How much of the item is filled, snapped to the precision it is shown with. */
	function fillFor(item: number) {
		const fill = Math.min(Math.max(shown - (item - 1), 0), 1);
		const precision = hovered !== undefined || rated ? step / 2 : 0.25;
		return Math.round(fill / precision) * precision;
	}

	function iconFor(snapped: number) {
		if (snapped >= 1) return StarFilled;
		if (snapped >= 0.75) return StarThreeQuarterFilled;
		if (snapped >= 0.5) return StarHalfFilled;
		if (snapped >= 0.25) return StarOneQuarterFilled;
		return StarRegular;
	}

	function select(next: number) {
		rated = true;
		value = next;
		onChange?.(next);
	}
</script>

<!-- 
	@component
	A rating lets users give a value to an item, using a row of symbols such as stars. It supports half-filled items and four sizes.

	- Usage:
	```tsx
	<script>
		import { Rating } from 'fluentui-svelte';

		let value = $state(3);
	</script>

	<Rating bind:value />
	<Rating bind:value step={0.5} size="medium" />
	```
-->
<div
	class={['fs-rating', `size-${size}`, classes]}
	bind:this={ref}
	{role}
	onpointerleave={() => (hovered = undefined)}
	{...attributes}
>
	{#each items as item (item)}
		{@const fill = fillFor(item)}
		<span class="rating-item">
			{#if custom}
				{@const Outline = iconOutline ?? StarRegular}
				{@const Filled = iconFilled ?? StarFilled}
				<span class="rating-icon custom" class:selected={fill > 0} style="--rating-fill: {fill * 100}%">
					<Outline aria-hidden="true" />
					<span class="filled"><Filled aria-hidden="true" /></span>
				</span>
			{:else}
				{@const Icon = iconFor(fill)}
				<span class="rating-icon" class:selected={fill > 0}><Icon aria-hidden="true" /></span>
			{/if}
			{#if step === 0.5}
				<input
					class="half-value"
					type="radio"
					{name}
					value={item - 0.5}
					checked={value === item - 0.5}
					aria-label={itemLabel(item - 0.5)}
					onchange={() => select(item - 0.5)}
					onpointerenter={() => (hovered = item - 0.5)}
				/>
			{/if}
			<input
				class="full-value"
				type="radio"
				{name}
				value={item}
				checked={value === item}
				aria-label={itemLabel(item)}
				onchange={() => select(item)}
				onpointerenter={() => (hovered = item)}
			/>
		</span>
	{/each}
</div>

<style>
	.fs-rating {
		--rating-size: 24px;
		display: inline-flex;
		align-items: center;
		color: var(--fs-accent-fill-default);

		&.size-small {
			--rating-size: 12px;
		}

		&.size-medium {
			--rating-size: 16px;
		}

		&.size-large {
			--rating-size: 20px;
		}
	}

	.rating-item {
		display: inline-flex;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		padding: 2px;

		&:has(input:focus-visible) {
			box-shadow: var(--fs-focus-stroke-outer);
		}

		& input {
			appearance: none;
			position: absolute;
			inset-block: 0;
			inset-inline-start: 0;
			margin: 0;
			outline: none;
			cursor: pointer;
			inline-size: 100%;
			block-size: 100%;
		}

		& .half-value {
			z-index: 1;
			inline-size: 50%;
		}
	}

	.rating-icon {
		display: inline-flex;
		color: var(--fs-text-secondary);

		&.selected {
			color: var(--fs-accent-fill-default);
		}

		& :global(svg) {
			inline-size: var(--rating-size);
			block-size: var(--rating-size);
		}

		&.custom {
			position: relative;

			& .filled {
				display: inline-flex;
				position: absolute;
				inset: 0;
				color: var(--fs-accent-fill-default);
				clip-path: inset(0 calc(100% - var(--rating-fill)) 0 0);

				&:dir(rtl) {
					clip-path: inset(0 0 0 calc(100% - var(--rating-fill)));
				}
			}
		}
	}
</style>
