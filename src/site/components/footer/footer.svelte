<script lang="ts">
	import { Button } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { GITHUB_REPO_URL, SPONSOR_URL } from '#site/constants.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	let { height = $bindable(0) }: { height?: number } = $props();
</script>

<footer id="footer" bind:clientHeight={height}>
	<div class="site-shell footer-inner">
		<div>
			<p>{m.footer_copyright_design_system()}. {m.footer_copyright_components()}.</p>
			<p>{m.about_disclaimer_title()}.</p>
		</div>
		<nav class="site-actions" aria-label={m.site_navigation()}>
			<Button as="a" appearance="subtle" href={localizedPath('/docs')}>{m.global_docs()}</Button>
			<Button as="a" appearance="subtle" href={localizedPath('/about')}>{m.global_about()}</Button>
			<Button as="a" appearance="subtle" href={GITHUB_REPO_URL}>GitHub</Button>
			<Button as="a" appearance="subtle" href={SPONSOR_URL}>{m.site_sponsor()}</Button>
			<Button as="a" appearance="subtle" href="https://jorgelacosta.com">{m.global_contact()}</Button>
		</nav>
	</div>
</footer>

<style>
	#footer {
		background: var(--fs-card-background-default);
		border-block-start: 1px solid var(--fs-control-stroke-secondary);
	}

	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding-block: 1.25rem;
		color: var(--fs-text-secondary);
		font-size: var(--fs-caption-font-size);

		& p {
			margin: 0;
		}

		@media (max-width: 600px) {
			flex-direction: column;
			text-align: center;

			& nav {
				justify-content: center;
			}
		}
	}
</style>
