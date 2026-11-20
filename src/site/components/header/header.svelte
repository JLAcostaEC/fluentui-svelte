<script lang="ts">
	import { page } from '$app/state';
	import SettingsRegular from 'fluentui-icons-svelte/SettingsRegular.svelte';
	import NavigationRegular from 'fluentui-icons-svelte/NavigationRegular.svelte';
	import logo from '#site/assets/images/banner.png?w=300;150&enhanced';
	import logoWhite from '#site/assets/images/banner-white.png?w=300;150&enhanced';
	import flagEn from '#site/assets/images/flag-en.svg';
	import flagEs from '#site/assets/images/flag-es.svg';
	import ThemedImage from '#site/components/themed-image/themed-image.svelte';
	import { m } from '#i18n/messages.js';
	import { getLocale, locales, deLocalizeUrl } from '#i18n/runtime.js';
	import {
		Button,
		Drawer,
		DrawerBody,
		DrawerHeader,
		Menu,
		MenuItem,
		MenuItemSwitch,
		MenuList,
		MenuPopover,
		MenuTrigger,
		MenuDivider,
		ScrollBar,
		ToggleSwitch
	} from '#lib/index.js';
	import { getGlobalFSContext } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { GITHUB_REPO_URL, SITE_NAME } from '#site/constants.js';
	import { getDisablePanZoom } from '#site/preferences.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import PageLoader from '#site/components/page-loader/page-loader.svelte';
	import ThemeSelector from '#site/components/theme-selector.svelte';
	import DocsSearch from '#site/components/docs/docs-search.svelte';

	let { height = $bindable(56) }: { height?: number } = $props();
	let scrollY = $state(0);
	let drawerOpen = $state(false);
	let drawerBody = $state<HTMLDivElement | null>(null);
	const flags = { en: flagEn, es: flagEs };
	const languageNames = Object.fromEntries(
		locales.map((locale) => [
			locale,
			new Intl.DisplayNames(locale, { type: 'language', languageDisplay: 'standard' }).of(locale)
		])
	);
	const { state: globalState, methods } = getGlobalFSContext()!;
	const disablePanZoom = getDisablePanZoom();
	const path = $derived(deLocalizeUrl(page.url).pathname);
	const inDocs = $derived(path === '/docs' || path.startsWith('/docs/'));
	const isHome = $derived(path === '/');
	const currentLocale = $derived(page.url.pathname && getLocale());
	const navigation = [
		{ href: '/', label: m.global_home },
		{ href: '/docs', label: m.global_docs },
		{ href: '/about', label: m.global_about }
	];
	const active = (href: string) => ((href === '/docs' ? inDocs : path === href) ? 'page' : undefined);
</script>

<svelte:window bind:scrollY />

{#snippet githubIcon()}
	<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
		<path
			d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.23.48-2.7-.95-2.7-.95-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.81.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.22 2.2.82a7.65 7.65 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.28.82 2.15 0 3.07-1.87 3.74-3.66 3.94.29.25.54.73.54 1.48l-.01 2.21c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"
		/>
	</svg>
{/snippet}

{#snippet language(locale: (typeof locales)[number])}
	<img class="language-flag" src={flags[locale]} alt="" width="22" height="14" />
	{languageNames[locale]}
{/snippet}

<header id="header" class={{ 'docs-header': inDocs, scrolled: scrollY > 1 }} bind:clientHeight={height}>
	<div class={['site-shell', 'header-inner', { 'has-docs-search': inDocs, 'wide-header': !isHome }]}>
		<a href={localizedPath('/')} class="brand">
			<ThemedImage light={logo} dark={logoWhite} alt={SITE_NAME} class="logo" />
		</a>

		<nav class="desktop-nav" aria-label={m.site_navigation()}>
			{#each navigation as { href, label } (href)}
				<Button as="a" appearance="subtle" href={localizedPath(href)} aria-current={active(href)}>
					{label()}
				</Button>
			{/each}
		</nav>

		{#if inDocs}
			<div class="header-search"><DocsSearch /></div>
		{/if}

		<div class="header-actions">
			<ThemeSelector showLabels={isHome} />
			{#if isHome}
				<Button as="a" appearance="subtle" href={GITHUB_REPO_URL} class="desktop-github"
					>{@render githubIcon()}GitHub</Button
				>
				<Button as="a" appearance="accent" href={localizedPath('/docs/getting-started')} class="desktop-start"
					>{m.site_get_started()}</Button
				>
			{/if}

			<div class="desktop-settings">
				<Menu>
					<MenuTrigger>
						{#snippet children({ state: trigger, menuTriggerProps })}
							<Button
								bind:ref={trigger.ref as HTMLButtonElement}
								{...menuTriggerProps}
								appearance="subtle"
								aria-label={m.header_settings_label()}
							>
								<SettingsRegular width="1.1em" />
							</Button>
						{/snippet}
					</MenuTrigger>
					<MenuPopover placement="bottom-end">
						<MenuList>
							<MenuItemSwitch
								bind:checked={() => globalState.reducedMotion, () => null}
								onclick={() => methods.setReducedMotion(!globalState.reducedMotion)}
							>
								{m.header_reduce_motion()}
							</MenuItemSwitch>
							<MenuItemSwitch
								bind:checked={() => disablePanZoom.current, () => null}
								onclick={() => (disablePanZoom.current = !disablePanZoom.current)}
							>
								{m.header_disable_panzoom()}
							</MenuItemSwitch>
							<MenuDivider />
							{#each locales as locale (locale)}
								<MenuItem
									as="a"
									data-sveltekit-reload
									href={localizedPath(path, { locale }) + page.url.search + page.url.hash}
									lang={locale}
									aria-current={locale === currentLocale ? 'true' : undefined}
								>
									{@render language(locale)}
								</MenuItem>
							{/each}
						</MenuList>
					</MenuPopover>
				</Menu>
			</div>

			<div class="mobile-nav">
				<Button
					appearance="subtle"
					aria-label={m.header_nav_menu_tooltip()}
					aria-expanded={drawerOpen}
					onclick={() => (drawerOpen = true)}
				>
					<NavigationRegular width="1.1em" />
				</Button>
				<Drawer bind:open={drawerOpen} size="min(22rem, 100vw)" position="end">
					<DrawerHeader title={m.site_navigation()} closeLabel={m.site_close()} />
					<DrawerBody bind:ref={drawerBody}>
						<nav class="drawer-navigation" aria-label={m.site_navigation()}>
							{#if inDocs && drawerOpen}<DocsSearch hideSuggestionsOnFocus />{/if}
							{#each navigation as { href, label } (href)}
								<Button
									as="a"
									appearance="subtle"
									href={localizedPath(href)}
									aria-current={active(href)}
									onclick={() => (drawerOpen = false)}>{label()}</Button
								>
							{/each}
							<Button
								as="a"
								appearance="subtle"
								href={localizedPath('/docs/getting-started')}
								onclick={() => (drawerOpen = false)}>{m.site_get_started()}</Button
							>
							<Button as="a" appearance="subtle" href={GITHUB_REPO_URL}>{@render githubIcon()}GitHub</Button>
						</nav>
						<div class="drawer-settings">
							<ToggleSwitch
								label={m.header_reduce_motion()}
								checked={globalState.reducedMotion}
								onclick={() => methods.setReducedMotion(!globalState.reducedMotion)}
							/>
							<ToggleSwitch label={m.header_disable_panzoom()} bind:checked={disablePanZoom.current} />
						</div>
						<div class="drawer-languages">
							{#each locales as locale (locale)}
								<Button
									as="a"
									appearance="subtle"
									data-sveltekit-reload
									lang={locale}
									aria-current={locale === currentLocale ? 'true' : undefined}
									href={localizedPath(path, { locale }) + page.url.search + page.url.hash}
								>
									{@render language(locale)}
								</Button>
							{/each}
						</div>
					</DrawerBody>
					<ScrollBar scrollRef={drawerBody} hideArrows size="thin" />
				</Drawer>
			</div>
		</div>
	</div>
	<PageLoader />
</header>

<style>
	#header {
		position: sticky;
		inset-block-start: 0;
		z-index: 110;
		background: var(--fs-solid-background-base);
		border-block-end: 1px solid var(--fs-control-stroke-secondary);
		&.docs-header:not(.scrolled) {
			border-block-end-color: transparent;
		}
		&.scrolled {
			background: color-mix(in srgb, var(--fs-solid-background-base) 80%, transparent);
			backdrop-filter: blur(20px) saturate(1.2);
		}
	}
	.header-inner,
	.desktop-nav,
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.header-inner {
		gap: clamp(0.6rem, 2vw, 1.5rem);
		min-height: 3.5rem;
		font-size: 0.87rem;

		&.wide-header {
			width: 100%;
			padding-inline: 1rem;
		}
	}
	.header-actions {
		flex: none;
		margin-inline-start: auto;
	}
	@media (min-width: 901px) {
		.has-docs-search .header-actions {
			margin-inline-start: 0;
		}
	}
	.desktop-nav {
		gap: 0.1rem;
		& :global(.fs-button) {
			position: relative;
			padding: 0.35rem 0.52rem;
			font-size: 0.8rem;
		}
		& :global(.fs-button[aria-current='page']::before) {
			position: absolute;
			inset-inline: 0.5rem;
			inset-block-end: 0;
			height: 2px;
			content: '';
			background: var(--fs-accent-fill-default);
		}
	}
	.brand {
		display: block;
		width: clamp(6.25rem, 33vw, 9.375rem);
		min-width: 0;
		flex-shrink: 1;
		& :global(.logo) {
			max-width: 100%;
			height: auto;
			vertical-align: middle;
		}
	}
	.language-flag {
		object-fit: cover;
		border-radius: 2px;
	}
	.drawer-navigation,
	.drawer-settings {
		display: grid;
		gap: 0.45rem;
		padding-block: 0.8rem;
		& :global(.fs-button) {
			justify-content: start;
		}
	}
	.drawer-settings,
	.drawer-languages {
		border-block-start: 1px solid var(--fs-control-stroke-secondary);
	}
	.drawer-languages {
		padding-block: 0.65rem;
	}
	.mobile-nav {
		display: none;
	}
	.header-search {
		flex: 0 1 23rem;
		min-width: 0;
		margin-inline: auto;
	}

	@media (max-width: 900px) {
		.desktop-nav,
		.desktop-settings,
		.header-search,
		.header-actions :global(.desktop-github),
		.header-actions :global(.desktop-start) {
			display: none;
		}
		.mobile-nav {
			display: block;
		}
		.header-inner {
			gap: 0.4rem;
		}
	}
</style>
