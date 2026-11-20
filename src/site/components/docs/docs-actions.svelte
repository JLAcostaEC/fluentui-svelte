<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { Button } from '#lib/index.js';
	import EditRegular from 'fluentui-icons-svelte/EditRegular.svelte';
	import MarkdownRegular from 'fluentui-icons-svelte/MarkdownRegular.svelte';
	import { m } from '#i18n/messages.js';
	import { deLocalizeUrl } from '#i18n/runtime.js';
	import { GITHUB_REPO_URL } from '#site/constants.js';

	let copyStatus = $state<'idle' | 'done' | 'failed'>('idle');
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const path = $derived(deLocalizeUrl(page.url).pathname.replace(/\/$/, ''));
	const componentSlug = $derived(path.match(/^\/docs\/components\/([^/]+)$/)?.[1]);
	const pageFiles: Record<string, string> = {
		'/docs': 'src/routes/docs/+page.svx',
		'/docs/getting-started': 'src/routes/docs/getting-started/+page.svx',
		'/docs/llms': 'src/routes/docs/llms/+page.svx',
		'/docs/types': 'src/routes/docs/types/+page.svx',
		'/docs/components': 'src/routes/docs/components/+page.svelte'
	};
	const editUrl = $derived(
		componentSlug
			? GITHUB_REPO_URL + '/tree/main/src/lib/components/' + componentSlug + '/docs'
			: pageFiles[path] && GITHUB_REPO_URL + '/edit/main/' + pageFiles[path]
	);

	const markdownUrl = $derived(
		componentSlug ? '/docs/components/' + componentSlug + '.md' : path === '/docs/llms' ? '/docs/llms.md' : null
	);

	const copyLabel = $derived(
		copyStatus === 'done'
			? m.docs_copy_markdown_done()
			: copyStatus === 'failed'
				? m.docs_copy_markdown_failed()
				: m.docs_copy_markdown()
	);

	afterNavigate(() => {
		copyStatus = 'idle';
		clearTimeout(copyTimer);
	});

	onDestroy(() => clearTimeout(copyTimer));

	async function copyMarkdown() {
		if (!markdownUrl) return;
		const url = markdownUrl;
		clearTimeout(copyTimer);
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(String(response.status));
			await navigator.clipboard.writeText(await response.text());
			if (markdownUrl !== url) return;
			copyStatus = 'done';
		} catch {
			if (markdownUrl !== url) return;
			copyStatus = 'failed';
		}
		copyTimer = setTimeout(() => (copyStatus = 'idle'), 2000);
	}
</script>

{#if editUrl || markdownUrl}
	<nav class="site-actions docs-actions" aria-label={m.site_docs_actions()}>
		{#if editUrl}
			<Button as="a" href={editUrl} target="_blank" rel="noopener noreferrer" appearance="subtle">
				<EditRegular width="1em" />{m.docs_edit_button()}
			</Button>
		{/if}
		{#if markdownUrl}
			<Button appearance="subtle" onclick={copyMarkdown}>{copyLabel}</Button>
			<Button as="a" href={markdownUrl} target="_blank" rel="noopener" data-sveltekit-reload appearance="subtle">
				<MarkdownRegular width="1em" />{m.docs_view_markdown()}
			</Button>
			<span class="site-sr-only" role="status">{copyStatus === 'idle' ? '' : copyLabel}</span>
		{/if}
	</nav>
{/if}

<style>
	.docs-actions {
		inline-size: 100%;
		padding-block-end: 0.6rem;
		margin-block-end: 0.8rem;
		border-block-end: 1px solid var(--fs-control-stroke-secondary);
		& :global(.fs-button) {
			white-space: normal;
		}
	}
</style>
