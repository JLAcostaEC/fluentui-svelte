<script lang="ts">
	import {
		AutoSuggestBox,
		AutoSuggestBoxOption,
		Dropdown,
		DropdownOption,
		DropdownSelect,
		DropdownSelectOption,
		FluentUISvelte,
		TagPicker,
		TagPickerOption
	} from '#lib/index.js';
	import type { Shapes } from '#types';

	let {
		shape = 'circular',
		positioned,
		above = false
	}: { shape?: Shapes; positioned?: string; above?: boolean } = $props();

	const wrapper = (id: string) => ({
		'data-testid': id,
		class: positioned === id ? `input-shapes-positioned ${above ? 'above' : ''}` : undefined
	});
</script>

<FluentUISvelte>
	<AutoSuggestBox {shape} value="Svelte" aria-label="Search" wrapperAttributes={wrapper('search')}>
		<AutoSuggestBoxOption index={0} value="Svelte">Svelte</AutoSuggestBoxOption>
	</AutoSuggestBox>
	<Dropdown {shape} value="svelte" aria-label="Choice" wrapperAttributes={wrapper('choice')}>
		<DropdownOption value="svelte" text="Svelte">Svelte</DropdownOption>
	</Dropdown>
	<DropdownSelect {shape} name="native" value="svelte" aria-label="Native choice" wrapperAttributes={wrapper('native')}>
		<DropdownSelectOption value="svelte">Svelte</DropdownSelectOption>
	</DropdownSelect>
	<TagPicker {shape} selectedOptions={['svelte']} aria-label="Tags" wrapperAttributes={wrapper('tags')}>
		<TagPickerOption value="svelte">Svelte</TagPickerOption>
	</TagPicker>
</FluentUISvelte>

<style>
	:global(.input-shapes-positioned) {
		position: fixed !important;
		z-index: 100;
		width: 300px !important;
		top: 4px !important;
	}

	:global(.input-shapes-positioned.above) {
		top: auto !important;
		bottom: 4px;
	}
</style>
