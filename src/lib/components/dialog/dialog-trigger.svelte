<script lang="ts">
	import { Button } from '$lib/index.js';
	import { getDialogContext } from './dialog.svelte.ts';
	import type { DialogTriggerProps } from './types.ts';

	let { children }: DialogTriggerProps = $props();

	const CONTEXT = getDialogContext();

	if (!CONTEXT) {
		throw new Error('DialogTrigger must be used within a Dialog component');
	}

	const { methods } = CONTEXT;
</script>

<Button class="dialog-trigger" onclick={methods.openDialog}>
	{#if children}
		{@render children()}
	{:else}
		Open Dialog
	{/if}
</Button>
