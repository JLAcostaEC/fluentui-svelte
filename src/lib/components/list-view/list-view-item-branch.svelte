<script lang="ts">
	import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
	import { getTabspotAttributes, type TabspotNavigationEvent, type TabspotNodeOptions } from 'tabspot';
	import { getGlobalFSContext } from '../../providers/fluentui-svelte/fluentui-svelte.ts';
	import { invokeHandlers } from '$internal';
	import {
		attachTabspot,
		getListViewContext,
		getListViewItemContext,
		LIST_VIEW_SKIP,
		setListViewItemContext
	} from './utils.ts';
	import type { ListViewItemBranchProps } from './types.ts';

	const ID = $props.id();
	const REGION_ID = `fs-list-view-branch-${ID}`;
	const parent = getListViewContext();
	const owner = getListViewItemContext();
	const globalContext = getGlobalFSContext();
	if (!parent) throw new Error('ListViewItemBranch must be used within a ListView');
	const context = parent;

	let {
		label,
		expanded = $bindable(false),
		disabled = false,
		shape,
		ref = $bindable(),
		class: classes,
		onclick,
		onkeydown,
		onExpandedChange,
		children,
		...attributes
	}: ListViewItemBranchProps = $props();
	let wrapperRef: HTMLElement | undefined;
	let regionRef: HTMLDivElement | undefined;
	const wrapperTag = $derived.by(() => {
		if (context.config.role !== undefined && context.config.role !== 'list') {
			throw new Error('ListViewItemBranch requires a native list. Set role="list" on selectable navigation lists.');
		}
		if (owner?.as === 'a' || owner?.as === 'button') {
			throw new Error('ListViewItemBranch must be outside links and buttons.');
		}
		return context.config.as === 'div' ? 'div' : 'li';
	});
	setListViewItemContext({
		get as() {
			return wrapperTag;
		}
	});
	const tabspotConfig: TabspotNodeOptions | undefined = $derived(
		context.config.disableTabspot
			? undefined
			: {
					mover: {
						axis: 'vertical',
						items: '.fs-list-view-item-branch-trigger',
						visibilityAware: 'Visible',
						skip: LIST_VIEW_SKIP,
						ignoreKeys: expanded ? ['ArrowLeft'] : ['ArrowRight']
					}
				}
	);
	const tabspotAttributes = $derived(tabspotConfig && getTabspotAttributes(tabspotConfig));
	const canceledKeys = new WeakSet<KeyboardEvent>();

	function changeExpanded(event: Event, next: boolean) {
		if (disabled || expanded === next) return;
		expanded = next;
		onExpandedChange?.(event, expanded);
	}

	function handleKeydown(event: KeyboardEvent) {
		// Tabspot prevents Escape before native handlers. Record further cancellation by the consumer.
		const preventDefault = event.preventDefault;
		if (onkeydown)
			event.preventDefault = () => {
				canceledKeys.add(event);
				preventDefault.call(event);
			};
		try {
			invokeHandlers(event, disabled, [onkeydown]);
		} finally {
			event.preventDefault = preventDefault;
		}
		if (event.defaultPrevented || disabled) return;
		if (context.config.disableTabspot && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) return;
		if ((event.key === 'ArrowRight' && !expanded) || (event.key === 'ArrowLeft' && expanded)) {
			event.preventDefault();
			changeExpanded(event, !expanded);
		}
	}

	function handleEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape' || (event.target as Element).closest('.fs-list-view-item-branch') !== wrapperRef) return;
		if (disabled || canceledKeys.has(event) || (context.config.disableTabspot && event.defaultPrevented)) return;
		event.preventDefault();
		event.stopPropagation();
		changeExpanded(event, false);
		ref?.focus();
	}

	function guardEscape(event: TabspotNavigationEvent) {
		if (event.direction === 'escape' && event.from?.closest('.fs-list-view-item-branch') === wrapperRef)
			event.preventDefault();
	}

	function restoreFocusBeforeCollapse() {
		if (!expanded && regionRef?.contains(document.activeElement)) ref?.focus();
	}
	$effect.pre(restoreFocusBeforeCollapse);
</script>

<svelte:element
	this={wrapperTag}
	role={wrapperTag === 'div' ? 'listitem' : undefined}
	{@attach (element: HTMLElement) => {
		wrapperRef = element;
		return () => {
			wrapperRef = undefined;
		};
	}}
	class="fs-list-view-item-branch"
	onkeydown={handleEscape}
	{...tabspotAttributes}
	{@attach attachTabspot(tabspotConfig, guardEscape, globalContext?.state.tabspotInstance)}
>
	<button
		{...attributes}
		class={['fs-list-view-item-branch-trigger', shape ?? context.config.shape, classes]}
		{@attach (element) => {
			ref = element;
			return () => {
				ref = null;
			};
		}}
		type="button"
		role={undefined}
		{disabled}
		aria-expanded={expanded}
		aria-controls={REGION_ID}
		onclick={(event) => {
			invokeHandlers(event, disabled, [onclick]);
			if (!event.defaultPrevented) changeExpanded(event, !expanded);
		}}
		onkeydown={handleKeydown}
	>
		<span>{label}</span>
		<ChevronDownRegular aria-hidden="true" width="1rem" height="1rem" class={['branch-chevron', { expanded }]} />
	</button>
	<div
		id={REGION_ID}
		{@attach (element) => {
			regionRef = element;
			return () => {
				regionRef = undefined;
			};
		}}
		class="fs-list-view-item-branch-region"
		hidden={!expanded}
	>
		{@render children?.()}
	</div>
</svelte:element>

<style>
	.fs-list-view-item-branch {
		list-style: none;
		margin: 0.3rem 0;
	}
	.fs-list-view-item-branch-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
		box-sizing: border-box;
		padding: 0.275rem 0.713rem 0.4rem;
		border: none;
		border-radius: var(--fs-control-border-radius);
		font: inherit;
		font-size: var(--fs-body2-font-size);
		text-align: start;
		color: var(--fs-text-primary);
		background: var(--fs-subtle-fill-transparent);
		cursor: pointer;
		&:hover:not(:disabled) {
			background: var(--fs-subtle-fill-secondary);
		}
		&:active:not(:disabled) {
			background: var(--fs-subtle-fill-tertiary);
		}
		&:focus-visible {
			outline: 0.125rem solid var(--fs-focus-stroke-outer);
			outline-offset: 0.063rem;
		}
		&:disabled {
			color: var(--fs-text-disabled);
			cursor: not-allowed;
		}
		&.square {
			border-radius: 0;
		}
		&.circular {
			border-radius: 50vw;
		}
		& :global(.branch-chevron) {
			flex-shrink: 0;
			font-size: 1rem;
		}
		& :global(.branch-chevron.expanded) {
			rotate: 180deg;
		}
	}
	.fs-list-view-item-branch-region > :global(.fs-list-view) {
		padding-inline-start: 1rem;
		box-sizing: border-box;
	}
</style>
