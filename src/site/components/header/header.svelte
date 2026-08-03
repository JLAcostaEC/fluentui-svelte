<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { toggleMode, mode } from 'mode-watcher';
	import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from '$lib/index.js';
	import { getLocale, locales, localizeHref } from '$i18n/runtime.js';
	import { WeatherMoonFilled, WeatherSunnyFilled } from 'fluentui-icons-svelte';
	import PageLoader from '$site/components/page-loader/page-loader.svelte';
	import type { Pathname } from '$app/types';

	let locale = $derived(page.url.pathname && getLocale());
</script>

{#snippet flag(value: 'en' | 'es' = 'en')}
	{#if value === 'en'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-20 w-20 m-4"
			role="img"
			width="24"
			height="24"
			focusable="false"
			viewBox="0 0 7410 3900"
			style="pointer-events: none;"
		>
			<path fill="#b22234" d="M0 0h7410v3900H0z"></path>
			<path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" stroke-width="300"></path>
			<path fill="#3c3b6e" d="M0 0h2964v2100H0z"></path>
			<g fill="#fff">
				<g id="d">
					<g id="c">
						<g id="e">
							<g id="b">
								<path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"></path>
								<use xlink:href="#a" y="420"></use>
								<use xlink:href="#a" y="840"></use>
								<use xlink:href="#a" y="1260"></use>
							</g>
							<use xlink:href="#a" y="1680"></use>
						</g>
						<use xlink:href="#b" x="247" y="210"></use>
					</g>
					<use xlink:href="#c" x="494"></use>
				</g>
				<use xlink:href="#d" x="988"></use>
				<use xlink:href="#c" x="1976"></use>
				<use xlink:href="#e" x="2470"></use>
			</g>
		</svg>
	{:else if value === 'es'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-20 w-20 m-4"
			role="img"
			width="24"
			height="24"
			focusable="false"
			viewBox="0 0 750 500"
			style="pointer-events: none;"
		>
			<path fill="#c60b1e" d="M0 0h750v500H0z"></path><path fill="#ffc400" d="M0 125h750v250H0z"></path>
		</svg>
	{/if}
{/snippet}

<header id="header">
	<section class="container">
		<a href={resolve(localizeHref('/') as any)} class="logo-link">
			<picture>
				<source
					srcset="/images/banner-white.png"
					type="image/png"
					media={`${mode.current === 'dark' ? '' : '(prefers-color-scheme: dark)'}`}
				/>
				<img src="/images/banner.png" alt="Logo" class="logo" />
			</picture>
		</a>
		<nav>
			<div class="nav-links">
				<Button as="a" appearance={page.url.pathname === '/' ? 'accent' : 'subtle'} href={localizeHref('/')}>Home</Button>
				<Button as="a" appearance={page.url.pathname === '/docs' ? 'accent' : 'subtle'} href={localizeHref('/docs')}>Docs</Button>
				<Button as="a" appearance={page.url.pathname === '/about' ? 'accent' : 'subtle'} href={localizeHref('/about')}>About</Button>
			</div>
			<!-- TODO: this is not SEO friendly -->
			 <Menu>
				<MenuTrigger>
					{#snippet children({ state, menuTriggerProps })}
						<Tooltip withArrow content="Navigate to a different page">
							{#snippet children(attrs)}
								<Button
									bind:ref={state.ref as HTMLButtonElement}
									{...menuTriggerProps}
									appearance="subtle"
									aria-label="Navigate to a different page"
									{...attrs}
								>
									...
								</Button>
							{/snippet}
						</Tooltip>
					{/snippet}
				</MenuTrigger>
				<MenuPopover placement="bottom-end">
					<MenuList>
						<MenuItem
							as="a"
							href="/"
						>
							Home
						</MenuItem>
						<MenuItem
							as="a"
							href="/docs"
						>
							Docs
						</MenuItem>
						<MenuItem
							as="a"
							href="/about"
						>
							About
						</MenuItem>
					</MenuList>
				</MenuPopover>
			</Menu>

			<Menu>
				<MenuTrigger>
					{#snippet children({ state, menuTriggerProps })}
						<Tooltip withArrow content="Select language">
							{#snippet children(attrs)}
								<Button
									bind:ref={state.ref as HTMLButtonElement}
									{...menuTriggerProps}
									appearance="subtle"
									aria-label="Select Language"
									{...attrs}
								>
									{@render flag(locale)}
								</Button>
							{/snippet}
						</Tooltip>
					{/snippet}
				</MenuTrigger>
				<MenuPopover placement="bottom-end">
					<MenuList>
						{@const localeNames = new Intl.DisplayNames(locales, { type: 'language' })}
						{#each locales as locale (locale)}
							{@const localeName = localeNames.of(locale)!}
							<MenuItem
								class="language-selector"
								as="a"
								data-sveltekit-reload
								href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
							>
								{@render flag(locale)}
								{localeName[0].toUpperCase() + localeName.slice(1)}
							</MenuItem>
						{/each}
					</MenuList>
				</MenuPopover>
			</Menu>
			<Tooltip withArrow content="Toggle theme mode">
				{#snippet children(attrs)}
					<Button
						appearance={mode.current === 'light' ? 'standard' : 'accent'}
						onclick={toggleMode}
						{...attrs}
						aria-label="Toggle color mode"
					>
						{#if mode.current === 'dark'}
							<WeatherSunnyFilled width="1em" height="1em" />
						{:else}
							<WeatherMoonFilled width="1em" height="1em" />
						{/if}
					</Button>
				{/snippet}
			</Tooltip>
		</nav>
	</section>
	<PageLoader />
</header>

<style>
	#header {
		position: sticky;
		top: 0;
		z-index: 110;
		width: 100%;
		background-color: var(--fs-control-fill-default);
		border-bottom: 1px solid var(--fs-control-stroke-default);
		backdrop-filter: blur(20px);
		& .container {
			display: flex;
			width: 100%;
			max-width: 1600px;
			padding: 1rem 2rem;
			margin-inline: auto;
			justify-content: space-between;
			& .logo-link {
				font-size: 1.5rem;
				font-weight: bold;
				text-decoration: none;
				color: var(--fs-text-primary);
				&:hover {
					color: var(--fs-accent-text-primary);
				}
				& .logo {
					max-width: 150px;
					height: auto;
				}
			}
			& nav {
				display: flex;
				gap: 0.5rem;
				& .nav-links {
					display: flex;
					gap: 0.5rem;
				}
				& :global(.language-selector .label) {
					gap: 0.5rem;
				}
			}

			@media (max-width: 768px) {
				padding: 0.75rem 1rem;
				flex-wrap: wrap;
				gap: 0.5rem;
				align-items: center;
				& .logo-link .logo {
					max-width: 120px;
				}
				& nav {
					flex-wrap: wrap;
					justify-content: space-between;
					& .nav-links {
						display: none;
					}
				}
			}
		}
	}
</style>
