<script lang="ts">
	import { createRawSnippet, type Snippet } from 'svelte';
	import { RenderSoC } from '#internal';
	import RenderSoCIcon from './RenderSoCIcon.svelte';

	let { as }: { as: 'snippet' | 'component' | 'snippet-no-args' | 'snippet-two-params' } = $props();

	type Attrs = { class?: string };
	const raw = createRawSnippet((attrs: () => Attrs) => ({
		render: () => `<i data-testid="two-params" class="${attrs().class}">two params</i>`
	}));
	// The shape of a production snippet with a destructured parameter, like `{ shape }`: an arrow with two parameters.
	const twoParams = ((anchor: never, attrs: never) => (raw as (...args: never[]) => void)(anchor, attrs)) as Snippet<
		[Attrs]
	>;
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
{:else if as === 'snippet-two-params'}
	<RenderSoC SoC={twoParams} args={{ class: 'from-args' }} />
{:else}
	<RenderSoC SoC={bare} />
{/if}
