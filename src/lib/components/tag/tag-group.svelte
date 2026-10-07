<script lang="ts">
	import { tick } from 'svelte';
	import { getTabspotAttributes } from 'tabspot';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { setTagGroupContext } from './tag-group.ts';
	import type { TagGroupContext, TagGroupProps } from './types.ts';

	let {
		size,
		appearance,
		disabled,
		dismissible,
		selectedValues = $bindable([]),
		onTagSelect,
		onDismiss,
		role = 'toolbar',
		class: classes,
		ref = $bindable(),
		children,
		...attributes
	}: TagGroupProps = $props();

	const globalFSContext = getGlobalFSContext();

	// Arrow keys walk the tags, as the toolbar role promises. A wrapped group is a grid of rows told apart by geometry.
	const tabspotAttrs = getTabspotAttributes({
		root: {},
		mover: { layout: 'grid', flow: 'linear', rows: { by: 'geometry' }, cyclic: true }
	});

	const context: TagGroupContext = $state({
		config: {
			get size() {
				return size;
			},
			get appearance() {
				return appearance;
			},
			get disabled() {
				return disabled;
			},
			get dismissible() {
				return dismissible;
			}
		},
		state: {
			get selectedValues() {
				return selectedValues;
			}
		},
		events: null,
		methods: {
			select(e, value) {
				const selected = !selectedValues.includes(value);
				selectedValues = selected ? [...selectedValues, value] : selectedValues.filter((v) => v !== value);
				onTagSelect?.(e, { value, selected });
			},
			async dismiss(e, value) {
				// The tag will most likely leave the DOM, so hand its focus to the next tag (or the last one before it).
				const tag = (e.target as Element).closest('.fs-tag');
				const others = [...(ref?.querySelectorAll<HTMLButtonElement>('button.fs-tag, .fs-tag-primary') ?? [])].filter(
					(el) => !el.disabled && el.closest('.fs-tag') !== tag
				);
				(
					others.find((el) => (tag?.compareDocumentPosition(el) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING) ??
					others.at(-1)
				)?.focus();
				onDismiss?.(e, { value });
				// Tabspot does not notice a removed tag, so it learns the new tags once the consumer has dropped it.
				// The last tag leaving takes the group with it, and a rebuild without a root would walk every one.
				await tick();
				if (ref?.isConnected) globalFSContext?.state?.tabspotInstance?.rebuild(ref);
			}
		}
	});

	setTagGroupContext(context);
</script>

<!--
	@component
	Fluent UI TagGroup: A container for multiple tags. It gives them a size, an appearance and a disabled state,
	handles the selection of interactive tags and lets arrow keys move between them.
	- Usage:
    ```tsx
		<script>
			import { Tag, TagGroup } from 'fluentui-svelte';
			let selectedValues = $state([]);
		</script>

		<TagGroup bind:selectedValues aria-label="Fruits">
			<Tag interactive value="apple">Apple</Tag>
			<Tag interactive value="banana">Banana</Tag>
		</TagGroup>
		```
-->
<div bind:this={ref} class={['fs-tag-group', size ?? 'medium', classes]} {role} {...tabspotAttrs} {...attributes}>
	{@render children?.()}
</div>

<style>
	.fs-tag-group {
		display: inline-flex;
		flex-wrap: wrap;
		max-width: 100%;
		gap: 0.5rem;
		&.small {
			gap: 0.375rem;
		}
		&.extra-small {
			gap: 0.25rem;
		}
	}
</style>
