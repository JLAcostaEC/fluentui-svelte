<script lang="ts">
	import '../app.css';
	import '../shiki.css';
	import '$css/theme.css';
	import '$css/class-darkmode.css';
	import '$css/reset.css';
	import '$css/typography.css';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	import { FluentUISvelte } from '$lib/index.js';
	import { locales, localizeHref } from '$i18n/runtime.js';
	import type { Pathname } from '$app/types';

	import Header from '$site/components/header/header.svelte';
	import Footer from '$site/components/footer/footer.svelte';

	let { children } = $props();
</script>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<ModeWatcher />
<FluentUISvelte>
	<Header />
	<main id="content">
		{@render children?.()}
	</main>
	<Footer />
</FluentUISvelte>

<style>
	#content {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		max-width: min(100%, 1600px);
		margin-inline: auto;
		overflow: hidden;
	}
</style>
