<script lang="ts">
	import { RenderSoC } from '$internal';
	import RenderSoCIcon from './RenderSoCIcon.svelte';

	let { as }: { as: 'snippet' | 'component' | 'snippet-no-args' } = $props();
</script>

{#snippet icon(attrs: { class?: string; width?: string })}
	<i data-testid="snippet" class={attrs.class} style:width={attrs.width}>snippet</i>
{/snippet}

{#snippet bare()}
	<i data-testid="bare">bare</i>
{/snippet}

{#if as === 'snippet'}
	<RenderSoC SoC={icon} args={{ class: 'from-args', width: '10px' }} />
{:else if as === 'component'}
	<RenderSoC SoC={RenderSoCIcon} args={{ class: 'from-args', width: '10px' }} />
{:else}
	<RenderSoC SoC={bare} />
{/if}
