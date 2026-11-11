<script lang="ts">
	import { MediaPlayer, MediaPlayerButton, MenuItem } from '#lib/index.js';
	import type { MediaPlayerProps, MediaPlayerRenderState } from '#lib/components/media-player/types.js';

	let { onShare, ...props }: Partial<MediaPlayerProps> & { onShare?: (time: number | undefined) => void } = $props();
</script>

<MediaPlayer {...props} wrapperAttributes={{ style: 'width: 40rem' }}>
	{#snippet startContent()}
		<MediaPlayerButton label="Repeat">R</MediaPlayerButton>
	{/snippet}
	{#snippet centerContent({ labels }: MediaPlayerRenderState)}
		<MediaPlayerButton label="Chapters">C</MediaPlayerButton>
		<span>labels: {labels.next} / {labels.previous}</span>
	{/snippet}
	{#snippet endContent({ store }: MediaPlayerRenderState)}
		<MediaPlayerButton label="Share" onclick={() => onShare?.(store?.currentTime)}>S</MediaPlayerButton>
	{/snippet}
	{#snippet moreContent()}
		<MenuItem>Download</MenuItem>
	{/snippet}
</MediaPlayer>
