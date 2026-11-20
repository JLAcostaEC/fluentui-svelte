<script lang="ts">
	import { getHighlighter } from '#site/utils/highlighter.js';
	import { fsShikiCopyButton } from '../../../../scripts/shiki-copy-button.js';
	import { fsShikiFocusableCode } from '../../../../scripts/shiki-focusable-code.js';

	let {
		code,
		lang = 'svelte',
		hideCopyButton = false,
		copyLabel
	}: {
		/** The source code to highlight. */
		code: string;
		/** Language grammar to use. Must be one of the langs loaded in `highlighter.ts`. */
		lang?: 'svelte' | 'typescript' | 'css' | 'bash';
		hideCopyButton?: boolean;
		copyLabel?: string;
	} = $props();

	// Re-runs whenever `code` or `lang` change. `{#await}` handles the async
	// resolution, so no manual state/cancellation is needed.
	const highlighted = $derived.by(() => {
		const source = code && code.trim();
		const language = lang;
		const transformers = [fsShikiFocusableCode()];
		if (!hideCopyButton) transformers.unshift(fsShikiCopyButton(copyLabel));

		return getHighlighter().then((highlighter) =>
			highlighter.codeToHtml(source, {
				lang: language,
				themes: {
					light: 'one-light',
					dark: 'one-dark-pro'
				},
				defaultColor: 'light-dark()',
				cssVariablePrefix: '--shiki-',
				tabindex: false,
				transformers
			})
		);
	});
</script>

{#await highlighted}
	<pre class="shiki"><code>{code?.trim()}</code></pre>
{:then html}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
{/await}
