<script lang="ts">
	import { page } from '$app/state';
	import { m } from '#i18n/messages.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import { Button } from '#lib/index.js';
	import ArrowLeftRegular from 'fluentui-icons-svelte/ArrowLeftRegular.svelte';
	import BookOpenRegular from 'fluentui-icons-svelte/BookOpenRegular.svelte';
	import DocumentSearchRegular from 'fluentui-icons-svelte/DocumentSearchRegular.svelte';
	import ErrorCircleRegular from 'fluentui-icons-svelte/ErrorCircleRegular.svelte';
	import GlobeRegular from 'fluentui-icons-svelte/GlobeRegular.svelte';

	const missing = $derived(page.status === 404);
	const title = $derived(missing ? m.error_not_found_title() : m.error_unavailable_title());
</script>

<svelte:head><title>{page.status} · {title}</title></svelte:head>

<section class="error-page" aria-labelledby="error-title">
	<div class="site-shell error-layout">
		<div class="error-copy">
			<h1 id="error-title"><span class="site-sr-only">{page.status}. </span>{title}</h1>
			<p>{missing ? m.error_not_found_description() : m.error_unavailable_description()}</p>
			<div class="site-actions">
				<Button as="a" href={localizedPath('/')}>
					<ArrowLeftRegular width="1em" height="1em" />{m.global_home()}
				</Button>
				<Button as="a" appearance="standard" href={localizedPath('/docs')}>
					<BookOpenRegular width="1em" height="1em" />{m.global_docs()}
				</Button>
			</div>
		</div>

		<div class="error-art" aria-hidden="true">
			<div class="route-grid"></div>
			<div class="window window-back">
				{@render windowBar()}
				<div class="window-lines"><i></i><i></i><i></i></div>
			</div>
			<div class="window window-front">
				{@render windowBar()}
				<div class="window-content">
					<span class="error-number">{page.status}</span>
					<div class="route"><i></i><i></i><i></i></div>
				</div>
			</div>
			<div class="search-tile">
				<DocumentSearchRegular width="53%" height="53%" />
			</div>
			<div class="route-tile">
				<ErrorCircleRegular width="58%" height="58%" />
			</div>
		</div>
	</div>
</section>

{#snippet windowBar()}
	<div class="window-bar">
		<div class="address"><GlobeRegular width="1em" height="1em" /><span></span></div>
		<div class="window-dots"><i></i><i></i><i></i></div>
	</div>
{/snippet}

<style>
	.error-page {
		overflow: clip;
		background:
			radial-gradient(ellipse at 78% 42%, rgba(var(--fs-accent-base), 0.13), transparent 56%),
			var(--fs-solid-background-base);
	}
	.error-layout {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
		align-items: center;
		gap: clamp(1.5rem, 4.8vw, 4.5rem);
		min-height: max(33rem, calc(100dvh - var(--site-header-height, 56px) - var(--site-footer-height, 78px)));
		padding-block: clamp(3rem, 7vw, 6.25rem);
	}
	.error-copy {
		display: grid;
		justify-items: start;
		gap: clamp(0.9rem, 2vw, 1.45rem);
		& p {
			max-width: 36ch;
			color: var(--fs-text-secondary);
			font-size: clamp(1rem, 1.7vw, 1.2rem);
			line-height: 1.55;
		}
		& .site-actions {
			margin-block-start: 0.35rem;
		}
		& :global(.fs-button) {
			min-height: 2.65rem;
			padding-inline: 1rem;
		}
	}
	h1 {
		font-size: clamp(3rem, 5.55vw, 5.3rem);
		line-height: 1;
		font-weight: 650;
		letter-spacing: -0.055em;
		text-wrap: balance;
	}
	.error-art {
		position: relative;
		aspect-ratio: 1.17;
		width: 100%;
		container-type: inline-size;
		isolation: isolate;
	}
	.route-grid {
		position: absolute;
		inset: 1% -7% 0 -5%;
		border-radius: 50%;
		background-image:
			linear-gradient(rgba(var(--fs-accent-base), 0.19) 1px, transparent 1px),
			linear-gradient(90deg, rgba(var(--fs-accent-base), 0.19) 1px, transparent 1px);
		background-size: 6% 7%;
		mask-image: radial-gradient(ellipse, #000 22%, transparent 70%);
		transform: rotate(-14deg) scale(1.1);
	}
	.window {
		position: absolute;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		overflow: hidden;
		border: 1px solid var(--fs-control-stroke-secondary);
		border-radius: 1rem;
		background: var(--fs-solid-background-tertiary);
	}
	.window-back {
		inset: 12% 8% 20% 18%;
		transform: rotate(11deg);
		box-shadow: var(--fs-shell-shadow-inactive);
		opacity: 0.84;
	}
	.window-front {
		inset: 22% 13% 14% 6%;
		transform: rotate(-5deg);
		box-shadow: var(--fs-shell-shadow-active);
	}
	.window-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: clamp(0.36rem, 2cqi, 0.7rem);
	}
	.address {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: min(48%, 10rem);
		padding: 0.24rem 0.4rem;
		border-radius: var(--fs-control-border-radius);
		color: var(--fs-text-secondary);
		background: var(--fs-control-fill-secondary);
		font-size: clamp(0.6rem, 2.6cqi, 0.85rem);
		& span {
			width: 57%;
			height: 0.23rem;
			border-radius: 1rem;
			background: var(--fs-control-strong-stroke-default);
			opacity: 0.55;
		}
	}
	.window-dots {
		display: flex;
		gap: clamp(0.22rem, 1cqi, 0.42rem);
		& i {
			width: clamp(0.25rem, 1.3cqi, 0.48rem);
			aspect-ratio: 1;
			border-radius: 50%;
			background: var(--fs-control-strong-stroke-default);
			opacity: 0.62;
		}
	}
	.window-lines {
		display: grid;
		align-content: start;
		gap: 9%;
		padding: 9% 12%;
		& i {
			height: clamp(0.35rem, 1.6cqi, 0.62rem);
			border-radius: 1em;
			background: var(--fs-subtle-fill-secondary);
		}
		& i:nth-child(2) {
			width: 67%;
		}
		& i:nth-child(3) {
			width: 83%;
		}
	}
	.window-content {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: clamp(0.6rem, 3cqi, 1.2rem);
		margin: 0 0.38rem 0.38rem;
		border-radius: 0.65rem;
		background:
			radial-gradient(ellipse at 65% 105%, rgba(var(--fs-accent-base), 0.82), transparent 62%),
			linear-gradient(145deg, rgb(var(--fs-accent-dark-2)), rgb(var(--fs-accent-dark-3)) 55%, #101725);
	}
	.error-number {
		color: #fff;
		font-size: clamp(3.35rem, 28cqi, 10.75rem);
		line-height: 0.9;
		font-weight: 650;
		letter-spacing: -0.075em;
		font-variant-numeric: lining-nums tabular-nums;
	}
	.route {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 82%;
		&::before {
			position: absolute;
			inset-inline: 0;
			content: '';
			border-block-start: 1px dashed #ffffff8c;
		}
		& i {
			z-index: 1;
			width: clamp(0.38rem, 2cqi, 0.68rem);
			aspect-ratio: 1;
			border: 1px solid #ffffffda;
			border-radius: 50%;
			background: rgb(var(--fs-accent-dark-2));
		}
		& i:nth-child(2) {
			background: rgb(var(--fs-accent-light-2));
		}
	}
	.search-tile,
	.route-tile {
		position: absolute;
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		border: 1px solid var(--fs-control-stroke-default);
		border-radius: 24%;
		box-shadow: var(--fs-shell-shadow-inactive);
	}
	.search-tile {
		inset: 15% 1% auto auto;
		width: 16%;
		transform: rotate(9deg);
		background: var(--fs-accent-fill-default);
		color: var(--fs-text-on-accent-primary);
	}
	.route-tile {
		inset: auto auto 7% 2%;
		width: 11%;
		transform: rotate(-12deg);
		background: var(--fs-acrylic-background-default);
		color: var(--fs-accent-text-primary);
	}
	@media (max-width: 730px) {
		.error-page {
			background:
				radial-gradient(ellipse at 52% 79%, rgba(var(--fs-accent-base), 0.16), transparent 65%),
				var(--fs-solid-background-base);
		}
		.error-layout {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			gap: 0.6rem;
			min-height: 0;
			padding-block: clamp(2.75rem, 10vw, 4rem) 1rem;
		}
		.error-copy {
			justify-items: center;
			text-align: center;
			& .site-actions {
				justify-content: center;
			}
		}
		.error-art {
			width: min(100%, 29rem);
		}
		h1 {
			font-size: clamp(2.5rem, 9.5vw, 4rem);
		}
	}
</style>
