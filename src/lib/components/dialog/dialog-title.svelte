<script lang="ts" generics="T extends DialogTitleTag">
	import { PREFIX } from '$constants';
	import { getDialogContext } from './dialog.svelte.ts';
	import { TITLE_TAG } from './utils.ts';
	import type { DialogTitleProps, DialogTitleTag } from './types.ts';

	const _ID = $props.id();
	const FALLBACK_ID = `${PREFIX}dialog-title-${_ID}`;

	let {
		as = 'h3' as T,
		ref = $bindable(),
		id = FALLBACK_ID,
		class: classes,
		children,
		...attributes
	}: DialogTitleProps<T> = $props();

	/**
	 * The tag the invariant rules over. The markup renders it through here, so it is checked
	 * during SSR and on every prop update rather than only once on mount.
	 */
	const _as = $derived.by(() => {
		if (!TITLE_TAG.includes(as)) throw new Error(`Invalid tag: ${as}. Must be one of ${TITLE_TAG.join(', ')}`);
		return as;
	});

	const context = getDialogContext();

	$effect.pre(() => {
		if (!context) return;

		context.state.titleId = id ?? undefined;

		return () => {
			context.state.titleId = undefined;
		};
	});
</script>

<svelte:element this={_as} {id} class={['dialog-title', classes]} bind:this={ref} {...attributes}>
	{@render children?.()}
</svelte:element>

<style>
	.dialog-title {
		padding: 1.4rem 2rem 0 2rem;
		grid-row: 1 / 1;
	}
</style>
