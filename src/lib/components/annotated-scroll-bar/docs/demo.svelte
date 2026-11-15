<script lang="ts">
	import { AnnotatedScrollBar, Checkbox } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import type { AnnotatedScrollBarProps } from '../types.ts';

	let {
		count = 9,
		height = 240,
		photos,
		events = false,
		...props
	}: Partial<AnnotatedScrollBarProps> & {
		count?: number;
		height?: number;
		photos?: Record<number, number>;
		events?: boolean;
	} = $props();

	const galleryId = $props.id();
	let gallery = $state<HTMLDivElement | null>(null);
	let locked = $state(false);
	let request = $state('');
	const years = $derived(Array.from({ length: count }, (_, index) => 2023 - index));
	// The default labels come from `data-scroll-label`.
	const marked = $derived(!props.labels && !props.selector);
</script>

<div class="demo">
	{#if events}<Checkbox bind:checked={locked}>{m.annotated_scroll_bar_cancel()}</Checkbox>{/if}
	<div class={['collection', { left: props.position === 'left' }]} style:--section-height="{height}px">
		<div
			id={galleryId}
			class="gallery"
			role="region"
			aria-label={m.annotated_scroll_bar_collection()}
			bind:this={gallery}
		>
			{#each years as year (year)}
				<section data-year={year} data-scroll-label={marked ? year : undefined}>
					<h3>{year}</h3>
					{#if height > 160}
						<div class="albums">
							{#each [1, 2, 3] as number (number)}
								<div class="album">{m.annotated_scroll_bar_album({ number: `${number}` })}</div>
							{/each}
						</div>
					{/if}
				</section>
			{/each}
		</div>
		<AnnotatedScrollBar
			scrollRef={gallery}
			aria-label={m.annotated_scroll_bar_name()}
			detail={photos ? preview : undefined}
			onScrolling={events
				? (offset, kind) => {
						request = m.annotated_scroll_bar_request({ kind, offset: `${Math.round(offset)}` });
						return !locked;
					}
				: undefined}
			{...props}
		/>
	</div>
	{#if events}<output>{request}</output>{/if}
</div>

{#snippet preview({ label }: { label?: string })}
	<strong>{label}</strong>: {m.annotated_scroll_bar_photos({ count: `${photos?.[Number(label)]}` })}
{/snippet}

<style>
	.demo {
		display: grid;
		gap: 1rem;
		width: 38rem;
		max-width: 100%;
	}
	.collection {
		display: flex;
		gap: 1rem;
		height: 360px;

		&.left {
			flex-direction: row-reverse;
		}
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
		box-sizing: border-box;
		height: var(--section-height);
		padding: 1rem;
		border-bottom: 1px solid var(--fs-divider-stroke-default);
	}
	h3 {
		margin: 0 0 1rem;
		font-size: var(--fs-subtitle-font-size);
		font-weight: 600;
	}
	.albums {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
	}
	.album {
		display: grid;
		place-items: center;
		height: 7rem;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-card-background-default);
		font-size: var(--fs-caption-font-size);
	}
	output {
		min-height: 1lh;
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}
</style>
