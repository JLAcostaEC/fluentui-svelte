<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { invokeHandlers } from '$internal';
	import { PREFIX } from '$constants';
	import StarFilled from 'fluentui-icons-svelte/StarFilled.svelte';
	import StarHalfRegular from 'fluentui-icons-svelte/StarHalfRegular.svelte';
	import StarOneQuarterRegular from 'fluentui-icons-svelte/StarOneQuarterRegular.svelte';
	import StarRegular from 'fluentui-icons-svelte/StarRegular.svelte';
	import StarThreeQuarterRegular from 'fluentui-icons-svelte/StarThreeQuarterRegular.svelte';
	import type { RatingProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'rating';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;
	const VALUE_ID = `${ID}-value`;

	const labelContext = claimLabel(() => undefined);

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
		wrapperRef = $bindable(),
		wrapperAttributes,
		onclick,
		onpointerenter,
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
	const checkedValue = $derived(value === 0 ? 0 : Math.min(_max, Math.max(step, Math.round(value / step) * step)));

	const custom = $derived(!!(iconFilled || iconOutline));

	/** How much of the item is filled, snapped to the precision it is shown with. */
	function fillFor(item: number) {
		const fill = Math.min(Math.max(shown - (item - 1), 0), 1);
		const precision = hovered !== undefined || rated ? step / 2 : 0.25;
		return Math.round(fill / precision) * precision;
	}

	function iconFor(snapped: number) {
		if (snapped >= 1) return StarFilled;
		if (snapped >= 0.75) return StarThreeQuarterRegular;
		if (snapped >= 0.5) return StarHalfRegular;
		if (snapped >= 0.25) return StarOneQuarterRegular;
		return StarRegular;
	}

	function select(next: number) {
		rated = true;
		value = next;
		onChange?.(next);
	}

	/** The value of the checked radio. Clicks select, the arrow keys included; a form reset unchecks every radio, which the binding reports as `null`. */
	let checked = $derived<number | null>(checkedValue);

	$effect(() => {
		if (checked !== null) return;
		rated = false;
		value = 0;
	});

	function hover(event: PointerEvent & { currentTarget: HTMLInputElement }, item: number) {
		invokeHandlers(event, [], [() => (hovered = item), onpointerenter]);
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
	{...wrapperAttributes}
	class={['fs-rating', `size-${size}`, wrapperAttributes?.class]}
	bind:this={wrapperRef}
	role="radiogroup"
	onpointerleave={(e) => invokeHandlers(e, [], [() => (hovered = undefined), wrapperAttributes?.onpointerleave])}
	aria-labelledby={wrapperAttributes?.['aria-labelledby'] ?? labelContext?.labelId}
	aria-label={wrapperAttributes?.['aria-label'] ??
		(wrapperAttributes?.['aria-labelledby'] || labelContext ? undefined : 'Rating')}
	aria-describedby={[wrapperAttributes?.['aria-describedby'], VALUE_ID].filter(Boolean).join(' ')}
>
	<span id={VALUE_ID} hidden>Current rating: {value} out of {_max}.</span>
	{#each items as item (item)}
		{@const fill = fillFor(item)}
		<span class="rating-item">
			{#if custom}
				{@const Outline = iconOutline ?? StarRegular}
				{@const Filled = iconFilled ?? StarFilled}
				<span class={['rating-icon custom', { selected: fill > 0 }]} style="--rating-fill: {fill * 100}%">
					<Outline aria-hidden="true" />
					<span class="filled"><Filled aria-hidden="true" /></span>
				</span>
			{:else}
				{@const Icon = iconFor(fill)}
				<span class={['rating-icon', { selected: fill > 0 }]}><Icon aria-hidden="true" /></span>
			{/if}
			{#if step === 0.5}
				<input
					{...attributes}
					class="half-value"
					type="radio"
					{name}
					value={item - 0.5}
					aria-label={itemLabel(item - 0.5)}
					bind:group={checked}
					onclick={(e) => invokeHandlers(e, [], [() => value !== item - 0.5 && select(item - 0.5), onclick])}
					onpointerenter={(e) => hover(e, item - 0.5)}
				/>
			{/if}
			<input
				{...attributes}
				class="full-value"
				type="radio"
				{name}
				value={item}
				aria-label={itemLabel(item)}
				bind:group={checked}
				onclick={(e) => invokeHandlers(e, [], [() => value !== item && select(item), onclick])}
				onpointerenter={(e) => hover(e, item)}
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

		&:is([aria-invalid='true'], :has(input:user-invalid)) .rating-icon {
			color: var(--fs-system-critical);
		}

		&:has(input:disabled) .rating-icon {
			color: var(--fs-text-disabled);
			& .filled {
				color: inherit;
			}
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
