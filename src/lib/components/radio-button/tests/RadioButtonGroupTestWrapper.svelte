<script lang="ts">
	import { RadioButton } from '$lib/index.js';

	let { group = $bindable('apple'), name = 'fruit' }: { group?: string; name?: string } = $props();
</script>

<fieldset>
	<legend>Fruit</legend>
	<RadioButton {name} value="apple" label="Apple" bind:group />
	<RadioButton {name} value="banana" label="Banana" bind:group />
	<RadioButton {name} value="cherry" label="Cherry" disabled bind:group />
</fieldset>

<p data-testid="selection">{group}</p>
