<script lang="ts">
	import { Badge, Card } from '#lib/index.js';
	import { m } from '#i18n/messages.js';

	const templates = [
		{
			id: 'signin',
			label: m.site_block_signin,
			description: m.site_block_signin_text,
			layout: 'none title title none; none body body none; none aside aside none; none action action none'
		},
		{
			id: 'settings',
			label: m.site_block_settings,
			description: m.site_block_settings_text,
			layout: 'title title title title; aside body body body; aside detail detail detail; aside action action none'
		},
		{
			id: 'cta',
			label: m.site_block_cta,
			description: m.site_block_cta_text,
			layout: 'none title title none; none body body none; none action aside none; none none none none'
		},
		{
			id: 'header',
			label: m.site_block_header,
			description: m.site_block_header_text,
			layout: 'title detail detail action; body body body body; body body body body; aside aside none none'
		},
		{
			id: 'blog',
			label: m.site_block_blog,
			description: m.site_block_blog_text,
			layout: 'title body aside; title body aside; detail action footer; detail action footer'
		},
		{
			id: 'pricing',
			label: m.site_block_pricing,
			description: m.site_block_pricing_text,
			layout: 'none title none; body action aside; body action aside; body action aside'
		},
		{
			id: 'dashboard',
			label: m.site_block_dashboard,
			description: m.site_block_dashboard_text,
			layout: 'title detail action; body body body; body body body; aside aside aside'
		},
		{
			id: 'landing',
			label: m.site_block_landing,
			description: m.site_block_landing_text,
			layout: 'title title title; title title title; body detail aside; footer footer footer'
		}
	];
	const areas = ['title', 'body', 'aside', 'detail', 'action', 'footer'];
</script>

<section class="site-shell site-section">
	<div class="site-heading">
		<span class="site-section-label">{m.site_soon()}</span>
		<h2>{m.site_blocks_title()}</h2>
		<p>{m.site_blocks_description()}</p>
	</div>
	<div class="templates">
		{#each templates as { id, label, description, layout } (id)}
			<Card as="article" orientation="vertical" class="template">
				<div
					class={['wireframe', id]}
					style:grid-template-areas={layout
						.split('; ')
						.map((row) => '"' + row.replaceAll('none', '.') + '"')
						.join(' ')}
					aria-hidden="true"
				>
					{#each areas as area (area)}
						{#if layout.includes(area)}<span class={area} style:grid-area={area}></span>{/if}
					{/each}
				</div>
				<div class="card-title">
					<h3>{label()}</h3>
					<Badge shape="rounded" appearance="tint">{m.site_soon()}</Badge>
				</div>
				<p>{description()}</p>
			</Card>
		{/each}
	</div>
</section>

<style>
	.templates {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.8rem;

		& :global(.template) {
			min-width: 0;
			padding: 0.9rem;
			gap: 0.75rem;
		}
		& h3 {
			font-weight: 650;
		}
		& p {
			color: var(--fs-text-secondary);
			font-size: 0.88rem;
		}
	}
	.card-title {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.35rem 0.6rem;
		justify-content: space-between;
	}
	.wireframe {
		display: grid;
		gap: 0.35rem;
		width: 100%;
		aspect-ratio: 1.9;
		padding: 0.85rem;
		overflow: hidden;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background:
			linear-gradient(145deg, rgba(var(--fs-accent-base), 0.07), transparent 80%), var(--fs-solid-background-secondary);

		& span {
			min-width: 0;
			border-radius: 0.25rem;
			border: 1px solid var(--fs-card-stroke-default);
			background: var(--fs-solid-background-quaternary);
		}
		& .title {
			background: rgba(var(--fs-accent-base), 0.32);
		}
		& .action {
			background: rgba(var(--fs-accent-base), 0.6);
		}
		& .footer {
			background: var(--fs-control-fill-secondary);
		}
		&.blog span:nth-child(-n + 3),
		&.landing .title {
			background: linear-gradient(135deg, rgba(var(--fs-accent-light-2), 0.65), rgba(var(--fs-accent-dark-1), 0.88));
		}
		&.pricing .action {
			border: 2px solid var(--fs-accent-fill-default);
			background: var(--fs-solid-background-quaternary);
		}
		&.cta .title {
			inline-size: 86%;
			justify-self: center;
		}
	}
	@media (max-width: 960px) {
		.templates {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 510px) {
		.templates {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
