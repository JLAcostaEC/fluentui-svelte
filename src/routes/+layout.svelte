<script module lang="ts">
	import { configureI18nMarkup } from '@jlacostaec/paraglide-markup-svelte';
	import { localizeHref as localizeMarkupHref } from '#i18n/runtime.js';

	// Configure the I18nMarkup component to use the localized href function on anchor tags
	configureI18nMarkup({ localizeHref: localizeMarkupHref });
</script>

<script lang="ts">
	import '../app.css';
	import '../shiki.css';
	import '#css/theme.css';
	import '#css/class-darkmode.css';
	import '#css/reset.css';
	import '#css/typography.css';

	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import { PersistedState } from 'runed';
	import { FluentUISvelte, ScrollBar } from '#lib/index.js';
	import { locales } from '#i18n/runtime.js';
	import { m } from '#i18n/messages.js';
	import { localizedPath } from '#site/utils/localized-path.js';

	import Header from '#site/components/header/header.svelte';
	import Footer from '#site/components/footer/footer.svelte';
	import { setDisablePanZoom } from '#site/preferences.js';

	let { children } = $props();

	const disablePanZoom = new PersistedState<boolean>('fluentui-svelte-disable-panzoom', false);
	setDisablePanZoom(disablePanZoom);

	const inDocs = $derived(!!page.route.id?.startsWith('/docs'));
</script>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizedPath(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<ModeWatcher />
<FluentUISvelte>
	<a class="skip-link" href={inDocs ? '#docs' : '#content'}>{m.global_skip_to_content()}</a>
	<Header />
	<main id="content" tabindex="-1">
		{@render children?.()}
	</main>
	<Footer />
	<ScrollBar scrollRef={globalThis.document?.querySelector('body')} />
</FluentUISvelte>

<style>
	.skip-link {
		position: fixed;
		inset-block-start: 0.5rem;
		inset-inline-start: 0.5rem;
		z-index: 1000;
		padding: 0.5rem 1rem;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-accent-fill-default);
		color: var(--fs-text-on-accent-primary);
		text-decoration: none;
		transform: translateY(-200%);
		&:focus {
			transform: none;
		}
	}
	#content {
		outline: none;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		max-width: min(100%, 1600px);
		margin-inline: auto;
	}
</style>
