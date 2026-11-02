<script module lang="ts">
	export type Control =
		| 'AutoSuggestBox'
		| 'CalendarDatePicker'
		| 'DatePicker'
		| 'Dropdown'
		| 'DropdownMultiple'
		| 'Rating'
		| 'Slider'
		| 'TagPicker'
		| 'TextBox'
		| 'TimePicker';
</script>

<script lang="ts">
	import {
		AutoSuggestBox,
		AutoSuggestBoxOption,
		CalendarDatePicker,
		DatePicker,
		Dropdown,
		DropdownOption,
		FluentUISvelte,
		Rating,
		Slider,
		TagPicker,
		TagPickerOption,
		TextBox,
		TimePicker
	} from '$lib/index.js';

	let {
		control,
		fieldProps = {},
		fieldset,
		onsubmit
	}: {
		control: Control;
		fieldProps?: Record<string, any>;
		/** Puts the field in a disabled fieldset. */
		fieldset?: boolean;
		onsubmit?: (data: FormData) => void;
	} = $props();
</script>

{#snippet field()}
	{#if control === 'AutoSuggestBox'}
		<AutoSuggestBox id="field" name="field" {...fieldProps}>
			<AutoSuggestBoxOption index={0} value="apple">Apple</AutoSuggestBoxOption>
		</AutoSuggestBox>
	{:else if control === 'CalendarDatePicker'}
		<CalendarDatePicker id="field" name="field" {...fieldProps} />
	{:else if control === 'DatePicker'}
		<DatePicker id="field" name="field" {...fieldProps} />
	{:else if control === 'Dropdown'}
		<Dropdown id="field" name="field" {...fieldProps}>
			<DropdownOption value="apple">Apple</DropdownOption>
			<DropdownOption value="banana">Banana</DropdownOption>
			<DropdownOption value="cherry">Cherry</DropdownOption>
		</Dropdown>
	{:else if control === 'DropdownMultiple'}
		<Dropdown id="field" name="field" multiple {...fieldProps}>
			<DropdownOption value="apple">Apple</DropdownOption>
			<DropdownOption value="banana">Banana</DropdownOption>
			<DropdownOption value="cherry">Cherry</DropdownOption>
		</Dropdown>
	{:else if control === 'Rating'}
		<Rating name="field" {...fieldProps} />
	{:else if control === 'Slider'}
		<Slider id="field" name="field" tooltip={false} {...fieldProps} />
	{:else if control === 'TagPicker'}
		<TagPicker id="field" name="field" {...fieldProps}>
			<TagPickerOption value="apple">Apple</TagPickerOption>
			<TagPickerOption value="banana">Banana</TagPickerOption>
			<TagPickerOption value="cherry">Cherry</TagPickerOption>
		</TagPicker>
	{:else if control === 'TextBox'}
		<TextBox id="field" name="field" {...fieldProps} />
	{:else if control === 'TimePicker'}
		<TimePicker id="field" name="field" {...fieldProps} />
	{/if}
{/snippet}

<FluentUISvelte>
	<form
		style="--fs-system-critical: rgb(255, 0, 0)"
		onsubmit={(event) => {
			event.preventDefault();
			onsubmit?.(new FormData(event.currentTarget));
		}}
	>
		{#if fieldset}
			<fieldset disabled>{@render field()}</fieldset>
		{:else}
			{@render field()}
		{/if}
		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
	</form>
</FluentUISvelte>
