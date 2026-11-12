<script lang="ts">
	import { getTabspotAttributes, setTabspotAttributes, unsetTabspotSection, type TabspotNodeOptions } from 'tabspot';
	import type { Attachment } from 'svelte/attachments';
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { getGlobalFSContext } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { setSegmentedControlContext } from './segmented-control.svelte.ts';
	import type { SegmentedControlProps } from './types.ts';
	import { claimLabel } from '../label/label-context.ts';
	const ID = $props.id();
	const labelContext = claimLabel(() => undefined);

	let {
		ref = $bindable(null),
		selectedValue = $bindable(''),
		name = `fs-segmented-control-${ID}`,
		form,
		required = false,
		validationMessage = '',
		hideIndicator = false,
		selectOnFocus = false,
		onSelectionChange,
		size = 'medium',
		equalWidth = true,
		disabled = false,
		disableTabspot = false,
		class: classes,
		onkeydown,
		children,
		...attributes
	}: SegmentedControlProps = $props();

	const initialSelectedValue = untrack(() => selectedValue);
	const trackForm: Attachment<HTMLDivElement> = (element) => {
		const owner = form !== undefined ? document.getElementById(form) : element.closest('form');
		if (!(owner instanceof HTMLFormElement)) return;
		let resetTimer: ReturnType<typeof setTimeout>;
		const unsubscribe = on(owner, 'reset', (event) => {
			// Defer until propagation and the native reset finish; later listeners can cancel it.
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

	setSegmentedControlContext({
		config: {
			get name() {
				return name;
			},
			get form() {
				return form;
			},
			get required() {
				return required;
			},
			get validationMessage() {
				return validationMessage;
			},
			get hideIndicator() {
				return hideIndicator;
			},
			get disabled() {
				return disabled;
			}
		},
		state: {
			get selectedValue() {
				return selectedValue;
			}
		},
		events: null,
		methods: {
			selectItem: (event, value) => {
				if (disabled || selectedValue === value) return;
				selectedValue = value;
				onSelectionChange?.(event, value);
			}
		}
	});

	const globalContext = getGlobalFSContext();
	const navigation: TabspotNodeOptions = {
		root: { manageSpecialKeys: { Home: true, End: true } },
		mover: {
			axis: 'horizontal',
			cyclic: true,
			items: '.fs-segmented-control-item > input',
			skip: '[disabled]',
			// Native radio groups already provide one tab stop at the checked item.
			activation: { mode: 'focus', roving: false }
		}
	};
	const registerNavigation: Attachment<HTMLDivElement> = (element) => {
		const instance = globalContext?.state.tabspotInstance;
		if (!instance) return;
		setTabspotAttributes({ element, config: navigation });
		const unsubscribe = instance.subscribe(element, (event) => {
			if (selectOnFocus && !event.cancelled && ['left', 'right', 'home', 'end'].includes(event.direction)) {
				if (event.to instanceof HTMLInputElement) event.to.click();
			}
		});
		return () => {
			unsubscribe();
			unsetTabspotSection(element, 'root');
		};
	};

	function keydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(event);
		if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'radio') return;
		if (event.key === 'Enter' && !selectOnFocus && !event.target.disabled) {
			event.preventDefault();
			event.stopPropagation();
			event.target.click();
			return;
		}
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		const items = [
			...event.currentTarget.querySelectorAll<HTMLInputElement>('.fs-segmented-control-item > input:not(:disabled)')
		];
		const index = items.indexOf(event.target);
		if (index < 0 || !items.length) return;
		const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
		const direction = (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1);
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? items.length - 1
					: (index + direction + items.length) % items.length;
		event.preventDefault();
		event.stopPropagation();
		items[next].focus();
		if (selectOnFocus) items[next].click();
	}
</script>

<!--
	@component
	A single selection from a compact group of segments. Provide an accessible group name.

	```svelte
	<SegmentedControl bind:selectedValue aria-label="View">
		<SegmentedControlItem value="day">Day</SegmentedControlItem>
		<SegmentedControlItem value="week">Week</SegmentedControlItem>
	</SegmentedControl>
	```
-->
<div
	{...attributes}
	bind:this={ref}
	{@attach trackForm}
	{@attach !disableTabspot && registerNavigation}
	role="radiogroup"
	aria-labelledby={attributes['aria-labelledby'] ?? (attributes['aria-label'] ? undefined : labelContext?.labelId)}
	aria-orientation="horizontal"
	aria-disabled={disabled || undefined}
	aria-required={required || undefined}
	onkeydown={keydown}
	class={['fs-segmented-control', size, { 'equal-width': equalWidth }, classes]}
	{...!disableTabspot && getTabspotAttributes(navigation)}
>
	{@render children?.()}
</div>

<style>
	.fs-segmented-control {
		display: inline-grid;
		grid-auto-flow: column;
		grid-auto-columns: max-content;
		gap: 0.125rem;
		padding: 0.125rem;
		box-sizing: border-box;
		border: 1px solid var(--fs-control-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-alt-fill-secondary);
		font-family: var(--fs-font-family-base);
		--fs-segmented-control-item-padding: 0.25rem;
		--fs-segmented-control-font-size: var(--fs-caption-font-size);
		--fs-segmented-control-line-height: 1.125rem;
		&:has(:global(input:user-invalid)),
		&[aria-invalid='true'] {
			--fs-segmented-control-text-color: var(--fs-system-critical);
			border-color: var(--fs-system-critical);
		}
		&.equal-width {
			grid-auto-columns: minmax(0, 1fr);
		}
		&.small {
			--fs-segmented-control-item-padding: 0.1875rem;
			--fs-segmented-control-font-size: 0.6875rem;
			--fs-segmented-control-line-height: 1rem;
		}
		&.large {
			--fs-segmented-control-item-padding: 0.375rem;
			--fs-segmented-control-font-size: var(--fs-body2-font-size);
			--fs-segmented-control-line-height: 1.25rem;
		}
	}
</style>
