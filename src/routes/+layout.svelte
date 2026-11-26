<script module lang="ts">
	import { configureI18nMarkup } from '@jlacostaec/paraglide-markup-svelte';
	import { localizeHref as localizeMarkupHref } from '#i18n/runtime.js';

	// Configure the I18nMarkup component to use the localized href function on anchor tags
	configureI18nMarkup({ localizeHref: localizeMarkupHref });
</script>

<script lang="ts">
	import '../app.css';
	import '../shiki.css';
	import '#site/site.css';
	import '#css/theme.css';
	import '#css/class-darkmode.css';
	import '#css/reset.css';
	import '#css/typography.css';

	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { mode, ModeWatcher } from 'mode-watcher';
	import { PersistedState } from 'runed';
	import { FluentUISvelte, ScrollBar } from '#lib/index.js';
	import { locales } from '#i18n/runtime.js';
	import { m } from '#i18n/messages.js';
	import { localizedPath } from '#site/utils/localized-path.js';

	import Header from '#site/components/header/header.svelte';
	import Footer from '#site/components/footer/footer.svelte';
	import { setAccentPreference, setDisablePanZoom } from '#site/preferences.js';
	import {
		accentProperties,
		accentTextColors,
		accentTextProperties,
		defaultAccent,
		generateAccentRamp,
		normalizeAccent,
		normalizeAccentAnchor
	} from '#site/utils/accent-ramp.js';

	let { children } = $props();
	let headerHeight = $state(56);
	let footerHeight = $state(0);
	let body = $state<HTMLElement | null>(null);

	const disablePanZoom = new PersistedState<boolean>('fluentui-svelte-disable-panzoom', false);
	setDisablePanZoom(disablePanZoom);
	const storedAccent = new PersistedState('fs-accent', defaultAccent);
	const storedAnchor = new PersistedState('fs-accent-anchor', 'base');
	const storedTextContrast = new PersistedState('fs-accent-adjust-text-contrast', false);
	const accent = $derived(normalizeAccent(storedAccent.current) ?? defaultAccent);
	const anchor = $derived(normalizeAccentAnchor(storedAnchor.current));
	const ramp = $derived(generateAccentRamp(accent, anchor));
	const textColors = $derived(storedTextContrast.current === true ? accentTextColors(ramp) : undefined);
	const properties = $derived([
		...accentProperties(ramp),
		...(textColors ? accentTextProperties(textColors[mode.current ?? 'light']) : [])
	]);
	setAccentPreference({
		get color() {
			return accent;
		},
		get anchor() {
			return anchor;
		},
		get ramp() {
			return ramp;
		},
		get textColors() {
			return textColors;
		},
		setColor(value) {
			const valid = normalizeAccent(value);
			if (valid) storedAccent.current = valid;
		},
		setAnchor(value) {
			storedAnchor.current = normalizeAccentAnchor(value);
		},
		setAdjustTextContrast(value) {
			storedTextContrast.current = value === true;
		}
	});

	$effect(() => {
		const root = document.documentElement;
		const applied = properties;
		for (const [key, value] of applied) root.style.setProperty(key, value);
		return () => {
			for (const [key] of applied) root.style.removeProperty(key);
		};
	});

	const inDocs = $derived(!!page.route.id?.startsWith('/docs'));
	onMount(() => {
		body = document.body;
	});
</script>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizedPath(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<ModeWatcher />
<FluentUISvelte>
	<a class="skip-link" href={inDocs ? '#docs' : '#content'}>{m.global_skip_to_content()}</a>
	<Header bind:height={headerHeight} />
	<main
		id="content"
		tabindex="-1"
		style:--site-header-height={headerHeight + 'px'}
		style:--site-footer-height={footerHeight + 'px'}
	>
		{@render children?.()}
	</main>
	<Footer bind:height={footerHeight} />
	<ScrollBar scrollRef={body} hideArrows size="thin" defer />
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
		min-width: 0;
		width: 100%;
	}
</style>
