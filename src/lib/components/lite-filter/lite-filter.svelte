<script lang="ts">
	import { getTabspotAttributes, setTabspotAttributes, unsetTabspotSection, type TabspotNodeOptions } from 'tabspot';
	import type { Attachment } from 'svelte/attachments';
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { CaretGlyph } from '#internal';
	import { getGlobalFSContext, getReducedMotion } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { claimLabel } from '../label/label-context.ts';
	import { setLiteFilterContext } from './lite-filter-context.svelte.ts';
	import type { LiteFilterContext, LiteFilterProps } from './types.ts';

	let {
		ref = $bindable(null),
		selectedValue = $bindable(),
		multiple = false,
		name,
		form,
		disabled = false,
		size = 'medium',
		appearance = 'filled',
		onSelectionChange,
		previousLabel = 'Scroll back',
		nextLabel = 'Scroll forward',
		disableTabspot = false,
		class: classes,
		onkeydown,
		children,
		...attributes
	}: LiteFilterProps = $props();

	// A Label around the filter names the group, and none of the pills claims it.
	const labelContext = claimLabel(() => undefined);
	const reducedMotion = getReducedMotion();

	let viewport: HTMLDivElement | null = $state(null);
	let canScrollBack = $state(false);
	let canScrollForward = $state(false);

	const toList = (value: string | string[] | undefined) =>
		Array.isArray(value) ? value : value == null ? [] : [value];
	const selected = $derived(toList(selectedValue));

	// The selection a form reset goes back to: each pill takes it as its default state.
	const initialSelectedValue = untrack(() => selectedValue);
	const initialSelected = toList(initialSelectedValue);

	// A selection kept across a change of `multiple` takes the shape of the new mode.
	$effect.pre(() => {
		if (multiple && !Array.isArray(selectedValue) && selectedValue != null) selectedValue = [selectedValue];
		else if (!multiple && Array.isArray(selectedValue)) selectedValue = selectedValue[0];
	});

	/** The items in the order they mount, to find the first enabled one. */
	let items: { value: string; disabled: () => boolean }[] = $state([]);

	/** With single selection, the one pill in the tab order: the selected one, else the first enabled. */
	const tabStop = $derived.by(() => {
		if (multiple) return undefined;
		const enabled = items.filter((item) => !disabled && !item.disabled());
		return enabled.find((item) => selected.includes(item.value))?.value ?? enabled[0]?.value;
	});

	setLiteFilterContext({
		config: {
			get multiple() {
				return multiple;
			},
			get name() {
				return name;
			},
			get form() {
				return form;
			},
			get disabled() {
				return disabled;
			},
			get size() {
				return size;
			},
			get appearance() {
				return appearance;
			}
		},
		state: {
			get tabStop() {
				return tabStop;
			}
		},
		events: null,
		methods: {
			isSelected: (value) => selected.includes(value),
			isInitiallySelected: (value) => initialSelected.includes(value),
			// Untracked: the item registers from an effect, which must not depend on the list it changes.
			register: (item) => {
				untrack(() => items.push(item));
				return () => {
					items = untrack(() => items.filter((i) => i !== item));
				};
			},
			select: (event, value, checked) => {
				if (multiple) {
					selectedValue = checked ? [...selected, value] : selected.filter((v) => v !== value);
				} else if (checked) {
					selectedValue = value;
				} else return;
				onSelectionChange?.(event, selectedValue);
			}
		}
	} satisfies LiteFilterContext);

	// The arrows show only toward the side that hides pills. RTL scrolls with a negative offset.
	$effect(() => {
		const node = viewport;
		if (!node) return;

		const update = () => {
			const offset = Math.abs(node.scrollLeft);
			const max = node.scrollWidth - node.clientWidth;
			canScrollBack = offset > 1;
			canScrollForward = offset < max - 1;
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(node);
		for (const child of node.children) observer.observe(child);
		const off = on(node, 'scroll', update, { passive: true });

		return () => {
			observer.disconnect();
			off();
		};
	});

	const scroll = (direction: -1 | 1) => {
		if (!viewport) return;
		const rtl = getComputedStyle(viewport).direction === 'rtl';
		viewport.scrollBy({
			left: direction * (rtl ? -1 : 1) * viewport.clientWidth * 0.75,
			behavior: reducedMotion() ? 'instant' : 'smooth'
		});
	};

	// A form reset unchecks the pills natively; the selection follows unless a later listener cancels it.
	const trackForm: Attachment<HTMLDivElement> = (element) => {
		let resetTimer: ReturnType<typeof setTimeout>;
		const unsubscribe = on(document, 'reset', (event) => {
			const owner = form !== undefined ? document.getElementById(form) : element.closest('form');
			if (!(owner instanceof HTMLFormElement) || event.target !== owner) return;
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => {
				if (!event.defaultPrevented) selectedValue = initialSelectedValue;
			});
		});
		return () => {
			unsubscribe();
			clearTimeout(resetTimer);
		};
	};

	const globalContext = getGlobalFSContext();
	const navigation: TabspotNodeOptions = {
		root: { manageSpecialKeys: { Home: true, End: true } },
		mover: {
			axis: 'horizontal',
			cyclic: true,
			items: '.fs-lite-filter-item > input',
			skip: '[disabled]',
			// The pills keep their own tab stop: one with single selection, each one with `multiple`.
			activation: { mode: 'focus', roving: false }
		}
	};

	const registerNavigation: Attachment<HTMLDivElement> = (element) => {
		const instance = globalContext?.state.tabspotInstance;
		if (!instance) return;
		setTabspotAttributes({ element, config: navigation });
		return () => unsetTabspotSection(element, 'root');
	};

	// Arrow keys, Home and End move the focus between the pills; Space and Enter select.
	function keydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(event);
		if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (!(event.target instanceof HTMLInputElement)) return;

		if (event.key === 'Enter' && !event.target.disabled) {
			event.preventDefault();
			event.target.click();
			return;
		}
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

		const inputs = [
			...event.currentTarget.querySelectorAll<HTMLInputElement>('.fs-lite-filter-item > input:not(:disabled)')
		];
		const index = inputs.indexOf(event.target);
		if (index < 0) return;
		const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
		const direction = (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1);
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? inputs.length - 1
					: (index + direction + inputs.length) % inputs.length;
		event.preventDefault();
		event.stopPropagation();
		inputs[next].focus();
	}
</script>

<div
	{...attributes}
	bind:this={ref}
	{@attach trackForm}
	{@attach !disableTabspot && registerNavigation}
	class={['fs-lite-filter', classes]}
	role={attributes.role ?? (multiple ? 'group' : 'radiogroup')}
	aria-labelledby={attributes['aria-labelledby'] ?? (attributes['aria-label'] ? undefined : labelContext?.labelId)}
	aria-orientation={multiple ? undefined : 'horizontal'}
	onkeydown={keydown}
	{...!disableTabspot && getTabspotAttributes(navigation)}
>
	<!-- Off the tab order: Tab moves through the pills, and a focused pill scrolls into view. -->
	{#if canScrollBack}
		<button
			type="button"
			class="fs-lite-filter-scroll"
			tabindex="-1"
			aria-label={previousLabel}
			onclick={() => scroll(-1)}
		>
			<CaretGlyph direction="left" />
		</button>
	{/if}
	<div class="fs-lite-filter-viewport" bind:this={viewport}>
		<div class="fs-lite-filter-items">
			{@render children?.()}
		</div>
	</div>
	{#if canScrollForward}
		<button type="button" class="fs-lite-filter-scroll" tabindex="-1" aria-label={nextLabel} onclick={() => scroll(1)}>
			<CaretGlyph direction="right" />
		</button>
	{/if}
</div>

<style>
	.fs-lite-filter {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		max-inline-size: 100%;
		min-inline-size: 0;

		& .fs-lite-filter-viewport {
			flex: 0 1 auto;
			min-inline-size: 0;
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scrollbar-width: none;
			/* Room for the focus outline of the pills. */
			padding: 0.25rem;
			margin: -0.25rem;
			&::-webkit-scrollbar {
				display: none;
			}
		}

		& .fs-lite-filter-items {
			display: flex;
			gap: 0.25rem;
			inline-size: max-content;
		}

		& .fs-lite-filter-scroll {
			display: flex;
			flex: none;
			align-items: center;
			justify-content: center;
			inline-size: 1.25rem;
			block-size: 1.5rem;
			margin: 0;
			padding: 0;
			border: none;
			border-radius: var(--fs-control-border-radius);
			background: none;
			color: var(--fs-text-primary);
			cursor: default;
			&:hover {
				background: var(--fs-subtle-fill-secondary);
			}
			&:active {
				background: var(--fs-subtle-fill-tertiary);
				color: var(--fs-text-secondary);
			}
			&:dir(rtl) :global(svg) {
				scale: -1 1;
			}
		}
	}
</style>
