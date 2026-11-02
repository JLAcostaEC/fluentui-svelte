<script lang="ts">
	import {
		AutoSuggestBox,
		AutoSuggestBoxOption,
		CalendarDatePicker,
		Checkbox,
		DatePicker,
		Dropdown,
		DropdownOption,
		DropdownSelect,
		DropdownSelectOption,
		FluentUISvelte,
		Label,
		NumberBox,
		RadioButton,
		Rating,
		Slider,
		TagPicker,
		TagPickerOption,
		TextArea,
		TextBox,
		TimePicker,
		ToggleSwitch
	} from '$lib/index.js';
	import type { LabelProps } from '../types.ts';

	type Control =
		| 'TextBox'
		| 'NumberBox'
		| 'TextArea'
		| 'DropdownSelect'
		| 'Checkbox'
		| 'RadioButton'
		| 'ToggleSwitch'
		| 'Dropdown'
		| 'TagPicker'
		| 'AutoSuggestBox'
		| 'DatePicker'
		| 'TimePicker'
		| 'CalendarDatePicker'
		| 'Slider'
		| 'Rating';

	let {
		control,
		fieldId,
		labelFor,
		label = 'Field label',
		labelPosition = 'above',
		required = false,
		second = false
	}: {
		control: Control;
		/** An id of the field's own. */
		fieldId?: string;
		/** The `for` of the Label. */
		labelFor?: string;
		label?: string;
		labelPosition?: LabelProps['labelPosition'];
		required?: boolean;
		/** Puts a second field in the Label, after the control. */
		second?: boolean;
	} = $props();
</script>

<FluentUISvelte>
	<Label {label} {labelPosition} for={labelFor} required={required ? { message: 'Required field' } : undefined}>
		{#if control === 'TextBox'}
			<TextBox id={fieldId} value="Existing value" />
		{:else if control === 'NumberBox'}
			<NumberBox id={fieldId} value={42} />
		{:else if control === 'TextArea'}
			<TextArea id={fieldId} value="Existing value" />
		{:else if control === 'DropdownSelect'}
			<DropdownSelect id={fieldId} value="apple">
				<DropdownSelectOption value="apple">Apple</DropdownSelectOption>
			</DropdownSelect>
		{:else if control === 'Checkbox'}
			<Checkbox id={fieldId}>Inner text</Checkbox>
		{:else if control === 'RadioButton'}
			<RadioButton id={fieldId} value="apple" label="Inner text" />
		{:else if control === 'ToggleSwitch'}
			<ToggleSwitch id={fieldId} label="Inner text" />
		{:else if control === 'Dropdown'}
			<Dropdown id={fieldId} value="apple">
				<DropdownOption value="apple">Apple</DropdownOption>
			</Dropdown>
		{:else if control === 'TagPicker'}
			<TagPicker id={fieldId} selectedOptions={['apple']}>
				<TagPickerOption value="apple">Apple</TagPickerOption>
				<TagPickerOption value="banana">Banana</TagPickerOption>
			</TagPicker>
		{:else if control === 'AutoSuggestBox'}
			<AutoSuggestBox id={fieldId} value="Apple">
				<AutoSuggestBoxOption index={0} value="apple">Apple</AutoSuggestBoxOption>
			</AutoSuggestBox>
		{:else if control === 'DatePicker'}
			<DatePicker id={fieldId} />
		{:else if control === 'TimePicker'}
			<TimePicker id={fieldId} />
		{:else if control === 'CalendarDatePicker'}
			<CalendarDatePicker id={fieldId} />
		{:else if control === 'Slider'}
			<Slider id={fieldId} tooltip={false} />
		{:else if control === 'Rating'}
			<Rating />
		{/if}
		{#if second}
			<TextBox placeholder="Second" />
		{/if}
	</Label>
</FluentUISvelte>
