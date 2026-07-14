<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/index.js';
	import PageLoader from '$site/components/page-loader/page-loader.svelte';
	import { localizeHref } from '$i18n/runtime.js';
</script>

<header id="header">
	<section class="container">
		<a href={resolve(localizeHref('/'))} class="logo-link">
			<picture>
				<source srcset="/images/banner-white.png" type="image/png" media="(prefers-color-scheme: dark)" class="logo" />
				<img src="/images/banner.png" alt="Logo" class="logo" />
			</picture>
		</a>
		<nav>
			<Button as="a" appearance="subtle" href={localizeHref('/')}>Home</Button>
			<Button as="a" appearance="subtle" href={localizeHref('/docs')}>Docs</Button>
			<Button as="a" appearance="subtle" href={localizeHref('/about')}>About</Button>
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
			}
		}
	}
</style>
