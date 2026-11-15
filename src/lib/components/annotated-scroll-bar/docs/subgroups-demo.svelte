<script lang="ts">
	import { AnnotatedScrollBar } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { getLocale } from '#i18n/runtime.js';

	const galleryId = $props.id();
	let gallery = $state<HTMLDivElement | null>(null);
	// The months of each year, with the ones in a row side by side.
	const years = [
		{ year: 2024, rows: [[5, 6], [11]] },
		{ year: 2023, rows: [[2], [7, 8]] },
		{ year: 2022, rows: [[0, 1], [9]] }
	];
	const month = $derived(new Intl.DateTimeFormat(getLocale(), { month: 'long' }));
</script>

<div class="collection">
	<div
		id={galleryId}
		class="gallery"
		role="region"
		aria-label={m.annotated_scroll_bar_collection()}
		bind:this={gallery}
	>
		{#each years as { year, rows } (year)}
			<section data-scroll-label={year}>
				<h3>{year}</h3>
				{#each rows as months, index (index)}
					<div class="row">
						{#each months as number (number)}
							{@const name = month.format(new Date(year, number, 1))}
							<div class="month" data-scroll-subgroup={name}>{name}</div>
						{/each}
					</div>
				{/each}
			</section>
		{/each}
	</div>
	<AnnotatedScrollBar scrollRef={gallery} aria-label={m.annotated_scroll_bar_name()} />
</div>

<style>
	.collection {
		display: flex;
		gap: 1rem;
		width: 38rem;
		max-width: 100%;
		height: 420px;
	}
	.gallery {
		flex: 1;
		min-width: 0;
		overflow: auto;
		overscroll-behavior: contain;
		scrollbar-width: none;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-layer-default);
	}
	section {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border-bottom: 1px solid var(--fs-divider-stroke-default);
	}
	h3 {
		margin: 0;
		font-size: var(--fs-subtitle-font-size);
		font-weight: 600;
	}
	.row {
		display: flex;
		gap: 1rem;
	}
	.month {
		display: grid;
		flex: 1;
		place-items: center;
		height: 160px;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-card-background-default);
		text-transform: capitalize;
	}
</style>
