<script lang="ts">
	// Spreads attributes the test replaces, as a form library does with its constraints and errors.
	import { Checkbox, FluentUISvelte, TagPicker, TagPickerOption, TextBox } from '#lib/index.js';

	let { attributes = {} }: { attributes?: Record<string, unknown> } = $props();
</script>

<FluentUISvelte>
	<TextBox aria-label="Name" {...attributes} />
	<Checkbox {...attributes}>Agree</Checkbox>
	<TagPicker {...attributes}>
		<TagPickerOption value="apple">Apple</TagPickerOption>
	</TagPicker>
</FluentUISvelte>
