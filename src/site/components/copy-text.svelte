<script lang="ts">
	import { onDestroy } from 'svelte';
	import CopyRegular from 'fluentui-icons-svelte/CopyRegular.svelte';
	import CheckmarkRegular from 'fluentui-icons-svelte/CheckmarkRegular.svelte';
	import { Button } from '#lib/index.js';
	import { m } from '#i18n/messages.js';

	let {
		value,
		label = m.site_copy(),
		showLabel = false
	}: { value: string; label?: string; showLabel?: boolean } = $props();
	let status = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => clearTimeout(timer));

	async function copy() {
		clearTimeout(timer);
		try {
			await navigator.clipboard.writeText(value);
			status = m.site_copied();
		} catch {
			status = m.site_copy_failed();
		}
		timer = setTimeout(() => (status = ''), 2000);
	}
</script>

<Button appearance="subtle" type="button" aria-label={label} title={label} onclick={copy}>
	{#if status === m.site_copied()}<CheckmarkRegular width="1em" />{:else}<CopyRegular width="1em" />{/if}
	{#if showLabel}{status || label}{/if}
</Button>
<span class="site-sr-only" role="status">{status}</span>
