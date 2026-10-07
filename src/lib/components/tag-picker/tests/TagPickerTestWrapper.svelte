<script lang="ts">
	import { FluentUISvelte, Tag, TagPicker, TagPickerOption, TagPickerOptionGroup } from '$lib/index.js';
	import type { ComponentProps } from 'svelte';

	type Option = { value: string; text?: string; disabled?: boolean };

	let {
		options = [
			{ value: 'apple', text: 'Apple' },
			{ value: 'banana', text: 'Banana' },
			{ value: 'cherry', text: 'Cherry' }
		],
		groups,
		selectedOptions = $bindable([]),
		value = $bindable(''),
		open = $bindable(false),
		noList,
		useTagSnippet,
		customExpand,
		withSecondary,
		onSecondary,
		inputProps = { 'aria-label': 'Fruits' },
		...rest
	}: {
		options?: Option[];
		groups?: { label: string; options: Option[] }[];
		noList?: boolean;
		useTagSnippet?: boolean;
		customExpand?: boolean;
		withSecondary?: boolean;
		onSecondary?: () => void;
	} & Omit<ComponentProps<typeof TagPicker>, 'children' | 'tag' | 'secondaryAction'> = $props();
</script>

{#snippet option(opt: Option)}
	<TagPickerOption id={opt.value} value={opt.value} text={opt.text} disabled={opt.disabled}
		>{opt.text ?? opt.value}</TagPickerOption
	>
{/snippet}

{#snippet list()}
	{#if groups}
		{#each groups as group (group.label)}
			<TagPickerOptionGroup label={group.label}>
				{#each group.options as opt (opt.value)}
					{@render option(opt)}
				{/each}
			</TagPickerOptionGroup>
		{/each}
	{:else}
		{#each options as opt (opt.value)}
			{@render option(opt)}
		{/each}
	{/if}
{/snippet}

{#snippet customTag(tag: { value: string; text: string })}
	<Tag role="listitem" value={tag.value} title={tag.text}>custom {tag.text}</Tag>
{/snippet}

{#snippet expand()}
	<span data-testid="custom-expand">v</span>
{/snippet}

{#snippet secondary()}
	<button type="button" onclick={onSecondary}>Clear all</button>
{/snippet}

<FluentUISvelte>
	<button type="button">before</button>
	<TagPicker
		bind:selectedOptions
		bind:value
		bind:open
		{inputProps}
		tag={useTagSnippet ? customTag : undefined}
		{...rest}
		{...customExpand ? { expandIcon: expand } : {}}
		secondaryAction={withSecondary ? secondary : undefined}
		children={noList ? undefined : list}
	/>
</FluentUISvelte>
