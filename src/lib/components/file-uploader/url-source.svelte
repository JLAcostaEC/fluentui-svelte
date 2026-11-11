<script lang="ts">
	import { Button, ProgressRing, TextBox } from '#lib/index.js';
	import { PREFIX } from '#constants';
	import { deriveFetchedFileName } from '@useupup/core/internal';
	import type { FileUploaderLabels } from './types.ts';

	let {
		labels,
		fetchLink = (url, signal) => fetch(url, { signal }),
		onAdd
	}: {
		labels: FileUploaderLabels;
		fetchLink?: (url: string, signal: AbortSignal) => Promise<Response>;
		onAdd: (file: File) => void;
	} = $props();

	const UID = $props.id();
	const ERROR_ID = `${PREFIX}file-uploader-${UID}-link-error`;

	let url = $state('');
	let loading = $state(false);
	let error = $state(false);
	let controller: AbortController | null = null;

	async function fetchFile() {
		const link = url.trim();
		if (!link || loading) return;
		controller?.abort();
		controller = new AbortController();
		loading = true;
		error = false;
		try {
			const response = await fetchLink(link, controller.signal);
			if (!response.ok) throw new Error(`${response.status}`);
			const blob = await response.blob();
			onAdd(new File([blob], deriveFetchedFileName(link, response, blob), { type: blob.type }));
		} catch (cause) {
			if ((cause as Error).name !== 'AbortError') error = true;
		} finally {
			loading = false;
		}
	}

	$effect(() => () => controller?.abort());
</script>

<div class="fs-file-uploader-link">
	<div class="row">
		<TextBox
			type="url"
			bind:value={url}
			placeholder="https://"
			aria-label={labels.link}
			aria-invalid={error || undefined}
			aria-describedby={error ? ERROR_ID : undefined}
			justify
			oninput={() => (error = false)}
			onkeydown={(event: KeyboardEvent) => {
				// The uploader may be inside a form, which Enter would submit.
				if (event.key !== 'Enter') return;
				event.preventDefault();
				void fetchFile();
			}}
		/>
		<Button type="button" appearance="accent" disabled={!url.trim() || loading} onclick={fetchFile}>
			{labels.import}
		</Button>
	</div>
	{#if loading}
		<ProgressRing size={24} aria-label={labels.loading} />
	{/if}
	{#if error}
		<span class="error" id={ERROR_ID}>{labels.linkError}</span>
	{/if}
</div>

<style>
	.fs-file-uploader-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 0.5rem;
	}

	.row {
		display: flex;
		gap: 0.5rem;
		inline-size: 100%;
		max-inline-size: 32rem;

		& > :global(:first-child) {
			flex: 1;
		}
	}

	.error {
		font-size: var(--fs-caption-font-size);
		line-height: var(--fs-caption-line-height);
		color: var(--fs-system-critical);
	}
</style>
