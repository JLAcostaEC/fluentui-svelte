<script lang="ts" generics="Tag extends CardTagTypes = 'div'">
	import type { Horientation } from '$types';
	import { invokeHandlers } from '../../internal/utils.ts';
	import { setCardContext } from './card-context.svelte.ts';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { CardContext, CardProps, CardTagTypes } from './types.js';
	import { PREFIX } from '../../internal/constants.ts';

	const _ID = $props.id();
	const FALLBACK_ID = PREFIX + '-card-' + _ID;

	let {
		as = 'div' as Tag,
		ref = $bindable(),
		orientation = 'horizontal',
		id = FALLBACK_ID,
		selectable = false,
		showFloatingAction = false,
		selected = $bindable(false),
		disabled = false,
		appearance = 'filled',
		class: classes,
		children,
		onclick,
		onSelectionChange,
		...attributes
	}: CardProps<Tag> = $props();

	const context: CardContext = $state({
		config: {
			get as() {
				return as;
			},
			get appearance() {
				return appearance;
			},
			get selectable() {
				return selectable;
			},
			get showFloatingAction() {
				return showFloatingAction;
			},
			get id() {
				return id;
			}
		},
		state: {
			get selected() {
				return selected;
			},
			set selected(value: boolean) {
				selected = value;
			},
			get disabled() {
				return disabled;
			},
			set disabled(value: boolean) {
				disabled = value;
			},
			get orientation() {
				return orientation;
			},
			set orientation(value: Horientation) {
				orientation = value;
			}
		},
		events: null,
		methods: {
			handleAction(e) {
				if (selectable && !disabled) {
					selected = !selected;
					onSelectionChange?.(id, selected);
				}
				onclick?.(e as any);
			}
		}
	});

	setCardContext(context);

	let actionable = $derived(!disabled && (selectable || as === 'a'));

	/**
	 * The props the invariants rule over. The markup renders them through here, so reading any of
	 * them validates the whole set during SSR and on every prop update.
	 */
	const _card = $derived.by(() => {
		if (showFloatingAction && !selectable)
			throw new Error('Floating action can only be shown if the card is selectable.');
		if (selected && !selectable) throw new Error('A card cannot be selected if it is not selectable.');
		if (as === 'a' && selectable) throw new Error('A card cannot be both a link and selectable.');
		return { as, selected, showFloatingAction };
	});

	let isLink = $derived(as === 'a');

	/** The root carries the selection semantics itself when no floating checkbox is there to carry them. */
	let isRootControl = $derived(selectable && !isLink && !_card.showFloatingAction);

	/**
	 * A focusable root needs an accessible name. The title of the header provides it, unless the
	 * consumer named the card itself.
	 */
	let rootLabelledBy = $derived(
		isRootControl && !attributes['aria-label'] && !attributes['aria-labelledby'] ? `${id}-title` : undefined
	);

	/** Enter and Space toggle the selection, the same way a pointer click does. */
	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
	};
</script>

<!--
	@component
	A card is a container that displays content and actions on a single topic.
	- Usage:
    ```tsx
    <script>
      import { Card, CardHeader } from 'fluentui-svelte';
    </script>

    <Card>
      <CardHeader title="Card title" />
      <p>Content goes here</p>
    </Card>
    ```
 -->
<svelte:element
	this={_card.as}
	class={['fs-card', { actionable, disabled, selected: _card.selected }, orientation, appearance, classes]}
	bind:this={ref}
	{id}
	role={isLink ? undefined : isRootControl ? 'checkbox' : 'group'}
	aria-checked={isRootControl ? _card.selected : undefined}
	aria-labelledby={rootLabelledBy}
	aria-disabled={disabled || undefined}
	tabindex={isRootControl && !disabled ? 0 : undefined}
	onclick={(e: MouseEvent) => invokeHandlers(e, [disabled], [context.methods.handleAction])}
	onkeydown={isRootControl ? handleKeydown : undefined}
	{...attributes}
>
	{#if selectable && _card.showFloatingAction && as !== 'a'}
		<Checkbox
			wrapperAs="div"
			aria-labelledby={`${id}-title`}
			bind:checked={selected}
			{disabled}
			onclick={(e) => e.stopPropagation()}
			onchange={(e) => onSelectionChange?.(id, e.currentTarget.checked)}
		/>
	{/if}
	{@render children?.()}
</svelte:element>

<style>
	.fs-card {
		display: flex;
		position: relative;
		border-radius: var(--fs-control-overlay-border-radius);
		background-clip: padding-box;
		color: var(--fs-text-primary);
		transition: box-shadow var(--fs-fast-duration) var(--fs-point-to-point);
		text-decoration: none;
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
		&.filled {
			background: var(--fs-card-background-default);
			box-shadow: var(--fs-shadow-card);
		}
		&.filled,
		&.outlined {
			border: 1px solid var(--fs-control-stroke-default);
		}
		&.disabled {
			user-select: none;
			box-shadow: unset;
			&.filled {
				background: var(--fs-control-fill-disabled);
				border-color: var(--fs-control-stroke-secondary);
				color: var(--fs-text-disabled);
			}
			&:hover {
				cursor: not-allowed;
			}
		}
		&:hover {
			&.filled:not(.disabled) {
				box-shadow: var(--fs-shadow-card-hover);
			}
			&.outlined:not(.disabled) {
				border-color: var(--fs-control-stroke-secondary);
			}
			&.subtle:not(.disabled) {
				background: var(--fs-subtle-fill-secondary);
			}
		}
		&:active.actionable:not(.disabled) {
			box-shadow: unset;
			&.filled {
				background: var(--fs-card-background-tertiary);
				border-color: var(--fs-control-surface-stroke-default);
				color: var(--fs-text-secondary);
			}
			&.outlined {
				border-color: var(--fs-control-surface-stroke-default);
				color: var(--fs-text-secondary);
			}
			&.subtle {
				background: var(--fs-subtle-fill-tertiary);
				color: var(--fs-text-tertiary);
			}
		}
		&.actionable {
			cursor: pointer;
		}
		&.selected {
			&.filled {
				background: var(--fs-card-background-tertiary);
				box-shadow: var(--fs-shadow-card);
			}
			&.outlined {
				background: var(--fs-card-background-default);
			}
			&.subtle {
				background: var(--fs-subtle-fill-tertiary);
			}
		}
		&.vertical {
			flex-direction: column;
		}
		& :global(.fs-checkbox) {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			z-index: 2;
		}
	}
</style>
