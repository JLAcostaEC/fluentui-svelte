<script lang="ts">
	import {
		AutoSuggestBox,
		AutoSuggestBoxOption,
		CalendarDatePicker,
		CalendarView,
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
		| 'CalendarView'
		| 'Slider'
		| 'Rating';

	let {
		control,
		label = 'Field label',
		labelPosition = 'above',
		required = false
	}: {
		control: Control;
		label?: string;
		labelPosition?: LabelProps['labelPosition'];
		required?: boolean;
	} = $props();

	const id = $props.id();
	const controlId = id + '-control';
	const labelId = id + '-label';
	const native = $derived(control !== 'Slider' && control !== 'Rating' && control !== 'CalendarView');
</script>

<FluentUISvelte>
	<Label
		{label}
		{labelPosition}
		id={labelId}
		for={native ? controlId : undefined}
		required={required ? { message: 'Required field' } : undefined}
	>
		{#if control === 'TextBox'}
			<TextBox id={controlId} value="Existing value" />
		{:else if control === 'NumberBox'}
			<NumberBox id={controlId} value={42} />
		{:else if control === 'TextArea'}
			<TextArea id={controlId} value="Existing value" />
		{:else if control === 'DropdownSelect'}
			<DropdownSelect id={controlId} value="apple">
				<DropdownSelectOption value="apple">Apple</DropdownSelectOption>
			</DropdownSelect>
		{:else if control === 'Checkbox'}
			<Checkbox id={controlId} />
		{:else if control === 'RadioButton'}
			<RadioButton id={controlId} value="apple" />
		{:else if control === 'ToggleSwitch'}
			<ToggleSwitch id={controlId} />
		{:else if control === 'Dropdown'}
			<Dropdown id={controlId} value="apple">
				<DropdownOption value="apple">Apple</DropdownOption>
			</Dropdown>
		{:else if control === 'TagPicker'}
			<TagPicker id={controlId} selectedOptions={['apple']}>
				<TagPickerOption value="apple">Apple</TagPickerOption>
				<TagPickerOption value="banana">Banana</TagPickerOption>
			</TagPicker>
		{:else if control === 'AutoSuggestBox'}
			<AutoSuggestBox id={controlId} value="Apple">
				<AutoSuggestBoxOption index={0} value="apple">Apple</AutoSuggestBoxOption>
			</AutoSuggestBox>
		{:else if control === 'DatePicker'}
			<DatePicker id={controlId} />
		{:else if control === 'TimePicker'}
			<TimePicker id={controlId} />
		{:else if control === 'CalendarDatePicker'}
			<CalendarDatePicker id={controlId} />
		{:else if control === 'CalendarView'}
			<CalendarView id={controlId} role="group" aria-labelledby={labelId} value={new Date(2026, 0, 15)} />
		{:else if control === 'Slider'}
			<Slider id={controlId} aria-labelledby={labelId} tooltip={false} />
		{:else if control === 'Rating'}
			<Rating id={controlId} aria-labelledby={labelId} />
		{/if}
	</Label>
</FluentUISvelte>
