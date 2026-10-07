<script lang="ts">
	import { Button } from '$lib/index.js';
	import { invokeHandlers } from '$internal';
	import { getDialogContext } from './dialog.svelte.ts';
	import type { DialogTriggerProps } from './types.ts';

	let { ref = $bindable(), class: classes, onclick, children, ...attributes }: DialogTriggerProps = $props();

	const CONTEXT = getDialogContext();

	if (!CONTEXT) {
		throw new Error('DialogTrigger must be used within a Dialog component');
	}

	const { methods } = CONTEXT;
</script>

<Button
	bind:ref
	class={['dialog-trigger', classes]}
	onclick={(e: MouseEvent) => invokeHandlers(e, [], [onclick, methods.openDialog])}
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		Open Dialog
	{/if}
</Button>
