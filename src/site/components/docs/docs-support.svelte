<script lang="ts">
	import { Button, InfoBar } from '#lib/index.js';
	import HeartFilled from 'fluentui-icons-svelte/HeartFilled.svelte';
	import HeartRegular from 'fluentui-icons-svelte/HeartRegular.svelte';
	import StarRegular from 'fluentui-icons-svelte/StarRegular.svelte';
	import { m } from '#i18n/messages.js';
	import { GITHUB_REPO_URL, SPONSOR_URL } from '#site/constants.js';
</script>

{#snippet heart()}
	<span class="support-icon"><HeartFilled width="1.3rem" aria-hidden="true" /></span>
{/snippet}

<section class="docs-support" aria-label={m.site_docs_support()}>
	<InfoBar icon={heart} hideCloseButton>
		<div class="support-layout">
			<div>
				<h2>{m.site_docs_support()}</h2>
				<p>{m.site_docs_support_description()}</p>
			</div>
			<div class="site-actions">
				<Button as="a" href={SPONSOR_URL}><HeartRegular width="1em" />{m.site_sponsor()}</Button>
				<Button as="a" appearance="standard" href={GITHUB_REPO_URL}><StarRegular width="1em" />{m.site_star()}</Button>
			</div>
		</div>
	</InfoBar>
</section>

<style>
	.docs-support {
		width: 100%;
		margin-block: 2rem 0.75rem;
		& :global(.fs-info-bar) {
			border-radius: var(--fs-control-overlay-border-radius);
			gap: 1rem;
			padding: 1.2rem;
			background:
				linear-gradient(120deg, rgba(var(--fs-accent-base), 0.055), transparent 65%), var(--fs-card-background-default);
		}
		& :global(.icon-wrapper) {
			width: auto;
		}
	}
	.support-icon {
		display: grid;
		place-items: center;
		width: 3rem;
		aspect-ratio: 1;
		border-radius: 50%;
		color: var(--fs-text-on-accent-primary);
		background: var(--fs-accent-fill-default);
	}
	.support-layout {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.85rem;
		justify-content: space-between;
		& > div:first-child {
			flex: 1 1 16rem;
		}
		& p {
			color: var(--fs-text-secondary);
			margin-block-start: 0.28rem;
		}
	}
	h2 {
		font-size: 1rem;
		font-weight: 650;
	}
</style>
