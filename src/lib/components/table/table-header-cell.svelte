<script lang="ts" generics="Tag extends 'th' | 'div' = 'th'">
	import ArrowUpRegular from 'fluentui-icons-svelte/ArrowUpRegular.svelte';
	import { on } from 'svelte/events';
	import { RenderSoC } from '$internal';
	import { colIndex, focusGroup, getTag, requireTableContext } from './table.svelte.ts';
	import type { TableDOM, TableHeaderCellProps } from './types.ts';

	let {
		as,
		ref = $bindable(),
		sortable,
		sortDirection,
		sortIcon,
		aside,
		focusMode,
		resizable,
		resizeLabel = 'Resize column',
		class: classes,
		children,
		...attributes
	}: TableHeaderCellProps<Tag> = $props();

	const context = requireTableContext();

	const noNativeElements = $derived(context.config.noNativeElements);

	const _as = $derived(getTag(as, 'th', noNativeElements));

	/** A cell opts in on its own, or inherits the choice the table made for every column. */
	const _sortable = $derived(sortable ?? context.config.sortable);

	const enableTabspot = $derived(context.config.enableTabspot);

	/** A column opts in on its own, or inherits the choice the table made for every column. */
	const _resizable = $derived(resizable ?? context.config.resizableColumns);

	/**
	 * A resizable header holds a handle, which the arrows would otherwise skip straight past: the
	 * grid moves between cells, not into them. Entering the cell is what puts the handle in reach.
	 */
	const _focusMode = $derived(focusMode ?? (_resizable && enableTabspot ? 'group' : 'cell'));

	/** Set by the attachment, because only the DOM knows which column a cell ended up in. */
	let index = $state(-1);

	const width = $derived(index < 0 ? undefined : context.methods.getColumnWidth(index));

	/** Pointer drags and arrow presses both land here, so the clamp lives in one place. */
	const resizeTo = (e: Event, next: number) => context.methods.resizeColumn(e, index, next);

	const startDrag = (e: PointerEvent) => {
		// The handle sits inside the sort button's cell, and a drag is not a click on the column.
		e.preventDefault();
		e.stopPropagation();

		const handle = e.currentTarget as HTMLElement;
		const origin = e.clientX;
		const start = width ?? handle.closest<HTMLElement>('.fs-table-header-cell')!.getBoundingClientRect().width;

		handle.setPointerCapture(e.pointerId);

		/** Filled right below, so ending the drag can unhook every listener it started. */
		let stop: (() => void)[] = [];

		const onmove = (move: PointerEvent) => resizeTo(move, start + move.clientX - origin);
		const onup = () => {
			for (const off of stop) off();
			stop = [];
		};

		stop = [on(handle, 'pointermove', onmove), on(handle, 'pointerup', onup), on(handle, 'pointercancel', onup)];
	};

	/** One nudge per press, the way the WAI window splitter pattern describes. */
	const STEP = 16;

	const onHandleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		const handle = e.currentTarget as HTMLElement;
		const current = width ?? handle.closest<HTMLElement>('.fs-table-header-cell')!.getBoundingClientRect().width;
		// The arrows belong to the handle here, not to the grid underneath it.
		e.preventDefault();
		e.stopPropagation();
		resizeTo(e, current + (e.key === 'ArrowRight' ? STEP : -STEP));
	};
</script>

<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={_as === 'div' ? 'columnheader' : undefined}
	scope={_as === 'th' ? 'col' : undefined}
	aria-sort={sortDirection}
	data-fs-focus-mode={enableTabspot ? _focusMode : undefined}
	class={['fs-table-header-cell', { flex: _as === 'div', sortable: _sortable, resizable: _resizable }, classes]}
	style:width={width === undefined ? undefined : `${width}px`}
	{@attach enableTabspot || _resizable ? colIndex((i) => (index = i)) : undefined}
	{@attach enableTabspot && _focusMode === 'group' ? focusGroup : undefined}
	{...attributes}
>
	<span class="inner">
		{#if _sortable}
			<button class="sort-button" type="button">
				<span class="content">{@render children?.()}</span>
				<span class={['sort-icon', sortDirection]} aria-hidden="true">
					<RenderSoC SoC={sortIcon ?? ArrowUpRegular} args={{ class: 'fs-table-sort-icon' }} />
				</span>
			</button>
		{:else}
			<span class="content">{@render children?.()}</span>
		{/if}
		{#if aside}
			<span class="aside">
				<RenderSoC SoC={aside} args={{ class: 'fs-table-header-cell-aside' }} />
			</span>
		{/if}
	</span>
	{#if _resizable}
		<!--
			The WAI window splitter: a `separator` that takes the focus is interactive by definition,
			which is what makes the arrows resize the column. The linter only knows the static role.
		-->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<span
			class="resize-handle"
			role="separator"
			aria-orientation="vertical"
			aria-label={resizeLabel}
			aria-valuenow={width}
			tabindex="0"
			onpointerdown={startDrag}
			onkeydown={onHandleKeydown}
		></span>
	{/if}
</svelte:element>

<style>
	.fs-table-header-cell {
		height: var(--fs-table-row-height);
		padding: 0 var(--fs-table-cell-padding);
		vertical-align: middle;
		text-align: left;
		font-size: var(--fs-caption-font-size);
		line-height: var(--fs-caption-line-height);
		font-weight: 600;
		color: var(--fs-text-primary);
		& .inner {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			min-width: 0;
		}
		& .content {
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		& .sort-button {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			flex-grow: 1;
			min-width: 0;
			padding: 0;
			margin: 0;
			border: none;
			border-radius: var(--fs-control-inner-border-radius);
			background: none;
			color: inherit;
			font: inherit;
			font-weight: inherit;
			text-align: inherit;
			cursor: pointer;
			&:focus-visible {
				outline: 0.125rem solid var(--fs-focus-stroke-outer);
				outline-offset: 0.063rem;
			}
		}
		& .sort-icon {
			display: inline-flex;
			/* The arrow is a hint while the column is unsorted, and the answer once it is. */
			opacity: 0;
			transition: opacity var(--fs-fast-duration) var(--fs-point-to-point);
			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
			& :global(svg) {
				width: 0.75rem;
				height: 0.75rem;
				fill: currentColor;
			}
			&.descending {
				transform: rotate(180deg);
			}
			&.ascending,
			&.descending {
				opacity: 1;
			}
		}
		&.sortable:hover .sort-icon {
			opacity: 0.5;
			&.ascending,
			&.descending {
				opacity: 1;
			}
		}
		& .aside {
			display: inline-flex;
			align-items: center;
			color: var(--fs-text-secondary);
		}
		&.flex {
			display: flex;
			align-items: center;
			flex: 1 1 0;
			min-width: 0;
		}
		&.resizable {
			position: relative;
			overflow: hidden;
			&.flex {
				flex: 0 0 auto;
			}
		}
		& .resize-handle {
			position: absolute;
			top: 0;
			right: 0;
			width: 0.5rem;
			height: 100%;
			cursor: col-resize;
			touch-action: none;
			/* The grab area is comfortable, the line it draws is hairline. */
			&::after {
				content: '';
				position: absolute;
				top: 20%;
				right: 0.188rem;
				width: 1px;
				height: 60%;
				background: var(--fs-control-stroke-default);
			}
			&:hover::after,
			&:focus-visible::after {
				top: 0;
				height: 100%;
				width: 2px;
				background: var(--fs-accent-fill-default);
			}
			&:focus-visible {
				outline: none;
			}
		}
	}
</style>
