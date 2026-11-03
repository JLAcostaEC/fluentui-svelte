<script lang="ts">
	import {
		CalendarView,
		Checkbox,
		DatePicker,
		Dropdown,
		DropdownOption,
		DropdownSelect,
		DropdownSelectOption,
		ListView,
		ListViewItem,
		TagPicker,
		TagPickerOption,
		TimePicker,
		TreeView,
		TreeViewItem,
		TreeViewItemContent
	} from '#lib/index.js';

	/** The case to render: the server renders one component at a time. */
	let { name }: { name: string } = $props();
</script>

{#if name === 'dropdown'}
	<Dropdown aria-label="Fruit" value="b2">
		<DropdownOption value="a1" text="Apple">Apple</DropdownOption>
		<DropdownOption value="b2" text="Banana">Banana</DropdownOption>
	</Dropdown>
{:else if name === 'dropdown-multiple'}
	<Dropdown aria-label="Fruits" multiple value={['a1', 'b2']}>
		<DropdownOption value="a1" text="Apple">Apple</DropdownOption>
		<DropdownOption value="b2" text="Banana">Banana</DropdownOption>
	</Dropdown>
{:else if name === 'dropdown-select-multiple'}
	<DropdownSelect aria-label="Fruits" multiple value={['b2']}>
		<DropdownSelectOption value="a1">Apple</DropdownSelectOption>
		<DropdownSelectOption value="b2">Banana</DropdownSelectOption>
	</DropdownSelect>
{:else if name === 'tag-picker'}
	<TagPicker aria-label="Fruits" selectedOptions={['a1', 'b2']}>
		<TagPickerOption value="a1" text="Apple">Apple</TagPickerOption>
		<TagPickerOption value="b2" text="Banana">Banana</TagPickerOption>
		<TagPickerOption value="c3" text="Cherry">Cherry</TagPickerOption>
	</TagPicker>
{:else if name === 'time-picker'}
	<TimePicker aria-label="Time" value="13:45:30" />
{:else if name === 'time-picker-12'}
	<TimePicker aria-label="Time" format={12} value="13:45:30" />
{:else if name === 'time-picker-open'}
	<TimePicker aria-label="Time" value="13:45:30" open />
{:else if name === 'date-picker-open'}
	<DatePicker aria-label="Date" value="2024-03-15" open />
{:else if name === 'calendar-view'}
	<CalendarView today={new Date(2024, 2, 5)} />
{:else if name === 'checkbox-indeterminate'}
	<Checkbox indeterminate>Mixed</Checkbox>
{:else if name === 'tree-view'}
	<TreeView>
		<TreeViewItem id="fruits" type="branch" open>
			<TreeViewItemContent>Fruits</TreeViewItemContent>
			<TreeView>
				<TreeViewItem id="apple"><TreeViewItemContent>Apple</TreeViewItemContent></TreeViewItem>
			</TreeView>
		</TreeViewItem>
		<TreeViewItem id="vegetables"><TreeViewItemContent>Vegetables</TreeViewItemContent></TreeViewItem>
	</TreeView>
{:else if name === 'list-view-composite'}
	<ListView aria-label="Packages" selectionMode="single" navigationMode="composite">
		<ListViewItem value="svelte">Svelte</ListViewItem>
		<ListViewItem value="vite">Vite</ListViewItem>
		<ListViewItem value="kit">Kit</ListViewItem>
	</ListView>
{/if}
