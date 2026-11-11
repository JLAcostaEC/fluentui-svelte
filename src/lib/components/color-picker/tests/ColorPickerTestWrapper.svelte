<script lang="ts">
	import { untrack } from 'svelte';
	import ColorPicker from '../color-picker.svelte';
	import type { ColorPickerProps } from '../types.ts';
	let {
		pickerProps = {},
		initial = '#ff0000',
		fieldsetDisabled = false
	}: { pickerProps?: ColorPickerProps; initial?: string; fieldsetDisabled?: boolean } = $props();
	let value = $state(untrack(() => initial));
</script>

<form id="colors" onsubmit={(e) => e.preventDefault()}>
	<fieldset disabled={fieldsetDisabled}>
		<ColorPicker name="color" defaultValue={initial} {...pickerProps} bind:value />
	</fieldset>
	<button type="reset">Reset</button>
	<button type="submit">Submit</button>
</form>
<button onclick={() => (value = '#0000ff')}>Set blue</button>
<output data-testid="value">{value}</output>
