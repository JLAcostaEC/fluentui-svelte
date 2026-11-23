<script lang="ts">
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

	let visible = $state(false);
	function observe(element: HTMLPreElement) {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				visible = true;
				observer.disconnect();
			},
			{ rootMargin: '150px' }
		);
		observer.observe(element);
		return () => observer.disconnect();
	}

	const highlighted = $derived.by(() => {
		if (!visible) return;
		const source = code && code.trim();
		const language = lang;
		const transformers = [fsShikiFocusableCode()];
		if (!hideCopyButton) transformers.unshift(fsShikiCopyButton(copyLabel));

		return import('#site/utils/highlighter.js').then(({ codeToHtml }) =>
			codeToHtml(source, {
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

{#snippet plain()}
	<pre class="shiki" {@attach observe}><code>{code?.trim()}</code></pre>
{/snippet}

{#if highlighted}
	{#await highlighted}
		{@render plain()}
	{:then html}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html html}
	{:catch}
		{@render plain()}
	{/await}
{:else}
	{@render plain()}
{/if}
