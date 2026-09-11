<script lang="ts" generics="Tag extends CardTagTypes = 'div'">
	import type { Horientation } from '$types';
	import { invokeHandlers } from '../../internal/utils.ts';
	import { setCardContext } from './card-context.svelte.ts';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { CardContext, CardProps, CardTagTypes } from './types.js';
	import { PREFIX } from '../../internal/constants.ts';
	import { onMount } from 'svelte';

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

	onMount(() => {
		if (showFloatingAction && !selectable)
			throw new Error('Floating action can only be shown if the card is selectable.');
		if (selected && !selectable) throw new Error('A card cannot be selected if it is not selectable.');
		if (as === 'a' && selectable) throw new Error('A card cannot be both a link and selectable.');
	});

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
	this={as}
	class={['fs-card', { actionable, disabled, selected }, orientation, appearance, classes]}
	bind:this={ref}
	{id}
	role="group"
	onclick={(e: MouseEvent) => invokeHandlers(e, [disabled, !selectable], [context.methods.handleAction])}
	{...attributes}
>
	{#if selectable && showFloatingAction && as !== 'a'}
		<Checkbox
			wrapperAs="div"
			aria-labelledby={`${id}-title`}
			bind:checked={selected}
			{disabled}
			onclick={(e) => e.stopPropagation()}
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
