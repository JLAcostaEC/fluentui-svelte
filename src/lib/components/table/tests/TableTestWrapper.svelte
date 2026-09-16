<script lang="ts">
	import {
		Button,
		FluentUISvelte,
		Table,
		TableHeader,
		TableHeaderCell,
		TableBody,
		TableRow,
		TableCell,
		TableCellActions,
		TableCellLayout,
		TableSelectionCell
	} from '$lib/index.js';
	import type {
		CellFocusMode,
		ColumnSizing,
		SelectionType,
		SortDirection,
		TableRowAppearance,
		TableSize
	} from '../types.ts';

	let {
		size,
		noNativeElements,
		sortable,
		sortDirection,
		noRowBorders,
		enableTabspot,
		appearance,
		variant = 'plain',
		selectionType,
		checked,
		subtle,
		invisible,
		description,
		actionsVisible,
		cellFocusMode,
		resizableColumns,
		columnWidths = $bindable([]),
		columnSizing,
		onColumnResize,
		onclick,
		onRowClick
	}: {
		size?: TableSize;
		noNativeElements?: boolean;
		sortable?: boolean;
		sortDirection?: SortDirection;
		noRowBorders?: boolean;
		enableTabspot?: boolean;
		appearance?: TableRowAppearance;
		variant?: 'plain' | 'layout' | 'selection' | 'actions';
		selectionType?: SelectionType;
		checked?: boolean | 'mixed';
		subtle?: boolean;
		invisible?: boolean;
		description?: string;
		actionsVisible?: boolean;
		cellFocusMode?: CellFocusMode;
		resizableColumns?: boolean;
		columnWidths?: number[];
		columnSizing?: ColumnSizing[];
		onColumnResize?: (e: Event, data: { index: number; width: number }) => void;
		onclick?: (e: MouseEvent) => void;
		onRowClick?: (e: MouseEvent) => void;
	} = $props();

	const items = ['Meeting notes', 'Purchase order'];
</script>

<!-- The provider is what starts the tabspot engine, so `enableTabspot` only rovers inside it. -->
<FluentUISvelte>
	<Table
		{size}
		{noNativeElements}
		{sortable}
		{noRowBorders}
		{enableTabspot}
		{resizableColumns}
		{columnSizing}
		{onColumnResize}
		bind:columnWidths
		aria-label="Files"
	>
		<TableHeader>
			<TableRow>
				{#if variant === 'selection'}
					<TableSelectionCell
						type={selectionType}
						{checked}
						{subtle}
						{invisible}
						checkboxIndicator={{ 'aria-label': 'Select all rows' }}
						radioIndicator={{ 'aria-label': 'Select all rows' }}
					/>
				{/if}
				<TableHeaderCell {sortDirection} {onclick}>File</TableHeaderCell>
				<TableHeaderCell>Author</TableHeaderCell>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each items as item (item)}
				<TableRow {appearance} onclick={onRowClick}>
					{#if variant === 'selection'}
						<TableSelectionCell
							type={selectionType}
							{checked}
							{subtle}
							{invisible}
							checkboxIndicator={{ 'aria-label': 'Select row' }}
							radioIndicator={{ 'aria-label': 'Select row' }}
						/>
					{/if}
					<TableCell focusMode={variant === 'actions' ? 'group' : undefined}>
						{#if variant === 'layout'}
							<TableCellLayout {description}>{item}</TableCellLayout>
						{:else if variant === 'actions'}
							<TableCellLayout>{item}</TableCellLayout>
							<TableCellActions visible={actionsVisible}>
								<Button appearance="subtle" aria-label="Edit {item}">Edit</Button>
								<Button appearance="subtle" aria-label="Share {item}">Share</Button>
							</TableCellActions>
						{:else}
							{item}
						{/if}
					</TableCell>
					<TableCell focusMode={cellFocusMode}>Max Mustermann</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</FluentUISvelte>
