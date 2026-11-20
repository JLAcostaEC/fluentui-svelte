<script lang="ts">
	import CopyText from './copy-text.svelte';
	import RenderShiki from './render-shiki/render-shiki.svelte';
	import { m } from '#i18n/messages.js';

	let { command, terminal = false }: { command: string; terminal?: boolean } = $props();
</script>

<div class={['site-command', { terminal }]}>
	{#if terminal}
		<div class="terminal-bar"><span>{m.site_gs_terminal()}</span><CopyText value={command} /></div>
	{/if}
	<RenderShiki code={command} lang="bash" hideCopyButton />
	{#if !terminal}<CopyText value={command} />{/if}
</div>

<style>
	.site-command {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		max-width: 100%;
		min-width: 0;
		min-height: var(--site-action-height, 2.5rem);
		padding-inline: 0.75rem 0.125rem;
		border: 1px solid var(--fs-control-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-default);
		color: var(--fs-text-primary);

		& :global(pre.shiki) {
			display: flex;
			min-width: 0;
			background: transparent !important;
			border: 0;
			padding: 0;
			margin: 0;
			font-size: 0.84rem;
			line-height: 1.3;
		}
		& :global(pre.shiki code) {
			white-space: pre-wrap;
			overflow-wrap: anywhere;
		}
	}
	.terminal {
		display: block;
		width: 100%;
		padding: 0;
		background: var(--fs-solid-background-secondary);
		border-radius: var(--fs-control-overlay-border-radius);

		& :global(pre.shiki) {
			padding: 0.85rem;
			font-size: 0.95rem;
		}
	}
	.terminal-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 0.85rem 0.2rem;
		border-block-end: 1px solid var(--fs-control-stroke-secondary);
		color: var(--fs-text-secondary);
		font-size: var(--fs-caption-font-size);
	}
	:global(.site-on-vivid) .site-command {
		color-scheme: dark;
		background: color-mix(in srgb, var(--fs-control-fill-default), #060b18 45%);
	}
</style>
