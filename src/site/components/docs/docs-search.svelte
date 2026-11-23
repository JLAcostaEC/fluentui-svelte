<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import SearchRegular from 'fluentui-icons-svelte/SearchRegular.svelte';
	import { AutoSuggestBox, AutoSuggestBoxOption } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { docsNavigation } from '#site/utils/docs-navigation.js';
	import { localizedPath } from '#site/utils/localized-path.js';

	let { hideSuggestionsOnFocus = false, onSelect }: { hideSuggestionsOnFocus?: boolean; onSelect?: () => void } =
		$props();
	let input = $state<HTMLInputElement | null>(null);
	let query = $state('');
	let open = $state(false);

	afterNavigate(() => (query = ''));

	function focusSearch(event: KeyboardEvent) {
		if (event.key !== '/' || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
		const { target } = event;
		if (target instanceof HTMLElement && (target.isContentEditable || target.matches('textarea, select'))) return;
		if (
			target instanceof HTMLInputElement &&
			['text', 'search', 'email', 'tel', 'url', 'password', 'number'].includes(target.type)
		)
			return;
		if (!input?.getClientRects().length) return;
		event.preventDefault();
		input.focus();
	}

	function navigate(_: Event, label: string) {
		const result = docsNavigation.find((entry) => entry.label() === label);
		if (!result) return;
		open = false;
		onSelect?.();
		void goto(localizedPath(result.url));
	}
</script>

<svelte:window onkeydown={focusSearch} />

<search
	class="docs-search"
	aria-label={m.docs_search_placeholder()}
	onfocusout={(event) => {
		const next = event.relatedTarget;
		if (!(next instanceof Node) || !event.currentTarget.contains(next)) open = false;
	}}
>
	<AutoSuggestBox
		bind:ref={input}
		bind:value={query}
		bind:open
		aria-label={m.docs_search_placeholder()}
		aria-keyshortcuts="/"
		style="padding-inline: 2rem"
		placeholder={m.docs_search_placeholder()}
		notFoundText={m.site_docs_no_results()}
		suggestionChosen={navigate}
		openOnFocus={!hideSuggestionsOnFocus}
		hideActionButtons
	>
		{#each docsNavigation as { url, label }, index (url)}
			{@const title = label()}
			<AutoSuggestBoxOption {index} value={title}>{title}</AutoSuggestBoxOption>
		{/each}
	</AutoSuggestBox>
	<span class="search-icon" aria-hidden="true"><SearchRegular width="1em" /></span>
	<kbd aria-hidden="true">/</kbd>
</search>

<style>
	.docs-search {
		position: relative;
		min-width: 0;
		& :global(.fs-auto-suggest-box) {
			width: 100%;
		}
	}
	.search-icon {
		pointer-events: none;
		position: absolute;
		inset-block-start: 50%;
		inset-inline-start: 0.65rem;
		transform: translateY(-50%);
		display: grid;
		color: var(--fs-text-secondary);
	}
	kbd {
		pointer-events: none;
		position: absolute;
		inset-block-start: 50%;
		inset-inline-end: 0.65rem;
		transform: translateY(-50%);
		display: grid;
		place-items: center;
		border: 1px solid var(--fs-control-stroke-secondary);
		border-radius: 0.2rem;
		inline-size: 1.15rem;
		block-size: 1.45rem;
		color: var(--fs-text-secondary);
		font-size: 0.85rem;
		line-height: 1;
	}
	@media (pointer: coarse) {
		kbd {
			display: none;
		}
	}
</style>
