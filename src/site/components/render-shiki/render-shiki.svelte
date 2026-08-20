<script lang="ts">
	import { getHighlighter } from '$site/utils/highlighter.js';
	import { fsShikiCopyButton } from '../../../../scripts/shiki-copy-button.js';

	let {
		code,
		lang = 'svelte'
	}: {
		/** The source code to highlight. */
		code: string;
		/** Language grammar to use. Must be one of the langs loaded in `highlighter.ts`. */
		lang?: 'svelte' | 'typescript' | 'css' | 'bash';
	} = $props();

	// Re-runs whenever `code` or `lang` change. `{#await}` handles the async
	// resolution, so no manual state/cancellation is needed.
	const highlighted = $derived(
		getHighlighter().then((highlighter) =>
			highlighter.codeToHtml(code && code.trim(), {
				lang,
				themes: {
					light: 'one-light',
					dark: 'one-dark-pro'
				},
				defaultColor: 'light-dark()',
				cssVariablePrefix: '--shiki-',
				transformers: [fsShikiCopyButton()]
			})
		)
	);
</script>

{#await highlighted}
	<pre class="shiki"><code>{code?.trim()}</code></pre>
{:then html}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
{/await}
