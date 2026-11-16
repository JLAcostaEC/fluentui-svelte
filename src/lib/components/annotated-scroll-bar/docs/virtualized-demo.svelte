<script lang="ts">
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
	import { AnnotatedScrollBar } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { getLocale } from '#i18n/runtime.js';
	import type { Attachment } from 'svelte/attachments';

	const rowHeight = 48;
	const perMonth = 50;
	const years = Array.from({ length: 10 }, (_, index) => 2024 - index);
	const photos = years.flatMap((year) =>
		Array.from({ length: 12 * perMonth }, (_, index) => ({
			id: `${year}-${index}`,
			year,
			month: Math.floor(index / perMonth),
			number: (index % perMonth) + 1
		}))
	);

	const numbers = $derived(new Intl.NumberFormat(getLocale()));
	const month = $derived(new Intl.DateTimeFormat(getLocale(), { month: 'long' }));
	const monthName = (index: number) => month.format(new Date(2024, index, 1));

	// Rows that are not rendered cannot be measured: the offsets come from the row height.
	const labels = $derived(
		years.map((year, y) => ({
			label: String(year),
			offset: y * 12 * perMonth * rowHeight,
			subgroups: Array.from({ length: 12 }, (_, index) => ({
				label: monthName(index),
				offset: (y * 12 + index) * perMonth * rowHeight
			}))
		}))
	);

	let viewport = $state<HTMLElement | null>(null);
	let rendered = $state(0);

	const findViewport: Attachment<HTMLDivElement> = (host) => {
		viewport = host.querySelector<HTMLElement>('.photos-viewport');
		return () => (viewport = null);
	};
</script>

<div class="demo">
	<div class="collection">
		<div class="list" {@attach findViewport}>
			<SvelteVirtualList
				items={photos}
				itemKey={(photo) => photo.id}
				defaultEstimatedItemHeight={rowHeight}
				bufferSize={5}
				viewportClass="virtual-list-viewport photos-viewport"
				viewportLabel={m.annotated_scroll_bar_collection()}
				onRangeChange={({ start, end }) => (rendered = end - start)}
			>
				{#snippet renderItem(photo)}
					<div class="row" style:height="{rowHeight}px">
						{m.annotated_scroll_bar_photo({
							month: monthName(photo.month),
							year: `${photo.year}`,
							number: `${photo.number}`
						})}
					</div>
				{/snippet}
			</SvelteVirtualList>
		</div>
		<AnnotatedScrollBar
			scrollRef={viewport}
			{labels}
			hideSubgroups
			arrowStep={rowHeight}
			aria-label={m.annotated_scroll_bar_name()}
		/>
	</div>
	<output>
		{m.annotated_scroll_bar_virtualization_rendered({
			rendered: numbers.format(rendered),
			total: numbers.format(photos.length)
		})}
	</output>
</div>

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
	}
	.list {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-layer-default);

		& :global(.photos-viewport) {
			scrollbar-width: none;
			overscroll-behavior: contain;
		}
	}
	.row {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0 1rem;
		border-bottom: 1px solid var(--fs-divider-stroke-default);
		font-size: var(--fs-body2-font-size);

		&::first-letter {
			text-transform: uppercase;
		}
	}
	output {
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}
</style>
