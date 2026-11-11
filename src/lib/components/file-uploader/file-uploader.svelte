<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import type {
		FileUploaderDrive,
		FileUploaderFile,
		FileUploaderProps,
		FileUploaderRejection,
		FileUploaderSource
	} from './types.ts';
	import { Button, Card, CardHeader, ListView, ListViewItem, ProgressBar, ProgressRing } from '#lib/index.js';
	import { dispatchFieldEvents, invokeHandlers, NativeField } from '#internal';
	import { PREFIX } from '#constants';
	import { tick, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { SvelteMap } from 'svelte/reactivity';
	import { UpupCore } from '@useupup/core';
	import { collectDroppedFiles } from '@useupup/core/internal';
	import ArrowClockwiseRegular from 'fluentui-icons-svelte/ArrowClockwiseRegular.svelte';
	import ArrowLeftRegular from 'fluentui-icons-svelte/ArrowLeftRegular.svelte';
	import ArrowUploadRegular from 'fluentui-icons-svelte/ArrowUploadRegular.svelte';
	import CameraRegular from 'fluentui-icons-svelte/CameraRegular.svelte';
	import CheckmarkCircleFilled from 'fluentui-icons-svelte/CheckmarkCircleFilled.svelte';
	import DatabaseRegular from 'fluentui-icons-svelte/DatabaseRegular.svelte';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import DocumentCopyRegular from 'fluentui-icons-svelte/DocumentCopyRegular.svelte';
	import DocumentRegular from 'fluentui-icons-svelte/DocumentRegular.svelte';
	import ErrorCircleFilled from 'fluentui-icons-svelte/ErrorCircleFilled.svelte';
	import HardDriveRegular from 'fluentui-icons-svelte/HardDriveRegular.svelte';
	import ImageRegular from 'fluentui-icons-svelte/ImageRegular.svelte';
	import LinkRegular from 'fluentui-icons-svelte/LinkRegular.svelte';
	import MicRegular from 'fluentui-icons-svelte/MicRegular.svelte';
	import MusicNote2Regular from 'fluentui-icons-svelte/MusicNote2Regular.svelte';
	import ShareScreenStartRegular from 'fluentui-icons-svelte/ShareScreenStartRegular.svelte';
	import VideoRegular from 'fluentui-icons-svelte/VideoRegular.svelte';
	import DriveIcon from './drive-icon.svelte';
	import { accepts, FILE_UPLOADER_LABELS, formatSize, isDrive, sourceId, statusOf } from './utils.ts';

	const labelContext = claimLabel(() => id);

	let {
		files = $bindable([]),
		sources = ['local'],
		upload,
		autoUpload = false,
		uploadedValue = (file) => file.key ?? '',
		fetchLink,
		accept,
		multiple = false,
		maxFiles,
		maxFileSize,
		minFileSize,
		maxTotalFileSize,
		description,
		showLimits = false,
		labels: labelsProp,
		// A `null` default keeps the binding when a spread of the parent changes (see `spread.svelte.spec.ts`).
		// eslint-disable-next-line no-useless-assignment
		uploader = $bindable(null),
		onFilesAdded,
		onFileRemoved,
		onReject,
		onUploadComplete,
		onUploadError,
		id = labelContext?.fieldId,
		name = id,
		ref = $bindable(null),
		buttonRef = $bindable(null),
		buttonAttributes,
		wrapperRef = $bindable(null),
		wrapperAttributes,
		disabled,
		onfocus,
		onblur,
		onchange,
		oninput,
		...attributes
	}: FileUploaderProps = $props();

	const UID = $props.id();
	const TITLE_ID = `${PREFIX}file-uploader-${UID}-title`;
	const DESCRIPTION_ID = `${PREFIX}file-uploader-${UID}-description`;
	const LIMITS_ID = `${PREFIX}file-uploader-${UID}-limits`;
	const BROWSE_ID = `${PREFIX}file-uploader-${UID}-browse`;
	const SOURCE_ID = `${PREFIX}file-uploader-${UID}-source`;

	const labels = $derived({ ...FILE_UPLOADER_LABELS, ...labelsProp });
	const isDisabled = $derived(Boolean(disabled));
	/** More than one file is accepted with `multiple`, or with room for more than one. */
	const isMultiple = $derived(Boolean(multiple) || (maxFiles ?? 0) > 1);

	// The engine is created with the component, on the server too, where it does nothing but hold the options.
	// Only the drives passed in `sources` bring their upup plugins.
	const core = new UpupCore(untrack(() => ({ ...upload })));
	untrack(() => {
		uploader = core;
		for (const source of sources) if (isDrive(source)) core.use(source.plugin());
	});
	$effect(() => {
		const options = { ...upload };
		untrack(() => core.updateOptions(options));
	});

	/** With somewhere to upload to, the files are uploaded and the form submits their keys instead of the files. */
	const uploads = $derived(
		Boolean(
			upload?.uploadEndpoint ||
			upload?.serverUrl ||
			(upload?.resumable?.protocol === 'tus' && upload.resumable.endpoint)
		)
	);
	const hasLocal = $derived(sources.includes('local'));
	const otherSources = $derived(sources.filter((source) => source !== 'local'));

	/** The limits shown with `showLimits`, the ones that are set. */
	const limits = $derived(
		[
			isMultiple && maxFiles !== undefined && { icon: DocumentCopyRegular, text: labels.limitFiles(maxFiles) },
			maxFileSize !== undefined && { icon: DatabaseRegular, text: labels.limitFileSize(formatSize(maxFileSize)) },
			maxTotalFileSize !== undefined && {
				icon: HardDriveRegular,
				text: labels.limitTotalSize(formatSize(maxTotalFileSize))
			}
		].filter((limit) => limit !== false)
	);

	/** The share of each file uploaded, from 0 to 1. */
	const progress = new SvelteMap<string, number>();
	/** The object URLs of the images of the list, for their thumbnails. */
	const previews = new SvelteMap<string, string>();

	let rejections: FileUploaderRejection[] = $state.raw([]);
	const messages = $derived([...new Set(rejections.map((rejection) => rejection.message))]);

	let dragging = $state(false);
	let dragDepth = 0;
	let activeSource: FileUploaderSource | FileUploaderDrive | null = $state(null);
	let opener: HTMLElement | null = null;
	/** Bumped to try again a source whose code failed to download. */
	let sourceAttempt = $state(0);
	let backRef: HTMLButtonElement | null = $state(null);
	let sourcesRef: HTMLElement | null = $state(null);
	let listRef: HTMLUListElement | null = $state(null);
	/** Set while the uploader dispatches the events of the field, which are not a pick of the user. */
	let syncing = false;
	/** Whether an upload run of the engine is going on. */
	let running = false;
	/** An upload asked for while a run goes on, started when it ends. */
	let queued = false;
	/** Failed files to try again, one run each: upup joins a run that goes on instead of starting another. */
	const retries = new Set<string>();
	/** Whether the run that goes on reported a failed file. */
	let fileFailed = false;

	const native = new NativeField(
		() => ref,
		() => buttonRef ?? sourcesRef?.querySelector('button'),
		labelContext
	);

	const naming = $derived(native.aria(attributes, buttonAttributes, 'button'));
	const describedBy = $derived(
		[naming['aria-describedby'], description && DESCRIPTION_ID, showLimits && limits.length > 0 && LIMITS_ID]
			.filter(Boolean)
			.join(' ') || undefined
	);

	const statuses = $derived(files.map(statusOf));
	const waiting = $derived(uploads ? files.filter((file) => statusOf(file) === 'pending') : []);
	const busy = $derived(uploads && statuses.some((status) => status === 'processing' || status === 'uploading'));
	const failed = $derived(uploads && statuses.includes('failed'));

	$effect(() => {
		const offs = [
			core.on('state-change', () => (files = [...core.files.values()])),
			core.on('upload-progress', ({ fileId, loaded, total }) => progress.set(fileId, total ? loaded / total : 0)),
			core.on('files-added', (added) => onFilesAdded?.(added)),
			core.on('file-removed', (file) => {
				progress.delete(file.id);
				onFileRemoved?.(file);
			}),
			core.on('upload-start', () => (fileFailed = false)),
			// A failed run reports each failed file, then the run without a file: the run is reported only when no file was.
			core.on('upload-error', ({ error, file }) => {
				if (file) fileFailed = true;
				else if (fileFailed) return;
				onUploadError?.(error, file);
			}),
			// A run that more files wait for is not the end of the uploads.
			core.on('upload-all-complete', (all) => {
				if (!(queued && hasWork())) onUploadComplete?.(all);
			})
		];

		// Files given at the start join the engine, which holds the list from then on.
		const initial = untrack(() => files);
		if (initial.length > 0) {
			void (isMultiple ? core.addFiles(initial) : core.setFiles(initial.slice(0, 1))).then(notifyField);
		}

		return () => {
			offs.forEach((off) => off());
			core.destroy();
		};
	});

	// The native field holds the files of the list: the form validates and submits them.
	$effect(() => {
		const list = files;
		untrack(() => syncField(list));
	});

	// Files not uploaded yet, still uploading or failed stop a submission, with a message.
	$effect(() => {
		ref?.setCustomValidity(
			busy
				? labels.uploadPending
				: failed
					? labels.uploadFailed
					: waiting.length > 0
						? autoUpload
							? labels.uploadPending
							: labels.uploadRequired
						: ''
		);
	});

	$effect(() => {
		const form = ref?.form;
		if (!form) return;
		return on(form, 'reset', () => {
			core.removeAll();
			progress.clear();
			rejections = [];
		});
	});

	// Thumbnails for the images, released with their files.
	$effect(() => {
		const ids = new Set(files.map((file) => file.id));
		untrack(() => {
			for (const file of files) {
				if (file.type.startsWith('image/') && !previews.has(file.id)) previews.set(file.id, URL.createObjectURL(file));
			}
			for (const [fileId, url] of previews) {
				if (ids.has(fileId)) continue;
				URL.revokeObjectURL(url);
				previews.delete(fileId);
			}
		});
	});
	$effect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)));

	function syncField(list: File[]) {
		if (!ref || typeof DataTransfer === 'undefined') return;
		const transfer = new DataTransfer();
		for (const file of list) transfer.items.add(file);
		ref.files = transfer.files;
	}

	/** Tells the form, and whoever listens to the field, that the files changed. */
	function notifyField() {
		syncField(files);
		syncing = true;
		dispatchFieldEvents(ref);
		syncing = false;
	}

	/** Adds the files that pass the limits, and reports the others. */
	async function addFiles(incoming: File[]) {
		if (isDisabled || incoming.length === 0) return;

		const rejected: FileUploaderRejection[] = [];
		const reject = (file: File, reason: FileUploaderRejection['reason'], message: string) =>
			rejected.push({ file, reason, message });

		let accepted = incoming.filter((file) => {
			if (!accepts(file, accept)) reject(file, 'type', labels.wrongType(file.name));
			else if (maxFileSize !== undefined && file.size > maxFileSize)
				reject(file, 'size', labels.tooLarge(file.name, formatSize(maxFileSize)));
			else if (minFileSize !== undefined && file.size < minFileSize)
				reject(file, 'size', labels.tooSmall(file.name, formatSize(minFileSize)));
			else return true;
			return false;
		});

		const max = isMultiple ? (maxFiles ?? Infinity) : 1;
		const room = isMultiple ? max - files.length : 1;
		for (const file of accepted.slice(Math.max(0, room))) reject(file, 'count', labels.tooMany(max));
		accepted = accepted.slice(0, Math.max(0, room));

		if (maxTotalFileSize !== undefined) {
			let total = isMultiple ? files.reduce((sum, file) => sum + file.size, 0) : 0;
			accepted = accepted.filter((file) => {
				if (total + file.size > maxTotalFileSize) {
					reject(file, 'total', labels.totalTooLarge(formatSize(maxTotalFileSize)));
					return false;
				}
				total += file.size;
				return true;
			});
		}

		rejections = rejected;
		if (rejected.length > 0) onReject?.(rejected);

		try {
			if (accepted.length === 0) return;
			if (isMultiple) await core.addFiles(accepted);
			else await core.setFiles(accepted);
			notifyField();
			if (uploads && autoUpload) await startUpload();
		} catch (error) {
			onUploadError?.(error instanceof Error ? error : new Error(String(error)));
		} finally {
			// A pick left the picked files in the field: it goes back to the list.
			syncField(files);
		}
	}

	const hasWaiting = () => [...core.files.values()].some((file) => statusOf(file) === 'pending');
	const hasWork = () => retries.size > 0 || hasWaiting();

	/** Runs the engine until nothing waits: the files to try again, then the waiting files. Files added during a run go in the next one. */
	async function startUpload() {
		if (running) {
			queued = true;
			return;
		}
		running = true;
		// Each failed file is reported by `upload-error`, and shown failed in the list.
		const run = (upload: () => Promise<unknown>) => upload().catch(() => {});
		try {
			do {
				queued = false;
				for (const fileId of retries) {
					retries.delete(fileId);
					if (core.files.has(fileId)) await run(() => core.retry(fileId));
				}
				if (hasWaiting()) await run(() => core.upload());
			} while (queued || retries.size > 0);
		} finally {
			running = false;
			queued = false;
		}
	}

	async function removeFile(file: FileUploaderFile, index: number) {
		const status = statusOf(file);
		const active = status === 'uploading' || status === 'processing';
		// upup cancels a whole run, not one file: the run stops, the file leaves, and the others start again.
		if (active) {
			if (running) queued = true;
			core.cancel();
		}
		core.removeFile(file.id);
		if (active && !running && hasWaiting()) void startUpload();
		rejections = [];
		notifyField();
		await tick();
		const buttons = listRef?.querySelectorAll<HTMLButtonElement>('.remove-button');
		(buttons?.[Math.min(index, buttons.length - 1)] ?? buttonRef ?? sourcesRef?.querySelector('button'))?.focus();
	}

	function retryFile(file: FileUploaderFile) {
		retries.add(file.id);
		void startUpload();
	}

	async function openSource(source: FileUploaderSource | FileUploaderDrive, event: MouseEvent) {
		opener = event.currentTarget as HTMLElement;
		activeSource = source;
		await tick();
		backRef?.focus();
	}

	async function closeSource() {
		const source = activeSource;
		activeSource = null;
		await tick();
		const id = source && sourceId(source);
		(sourcesRef?.querySelector<HTMLElement>(`[data-source="${id}"]`) ?? opener)?.focus();
	}

	async function addFromSource(added: File[]) {
		await addFiles(added);
		await closeSource();
	}

	const canDrop = $derived(hasLocal && !isDisabled && !activeSource);
	const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes('Files') ?? false;

	function handleDragEnter(event: DragEvent) {
		if (!canDrop || !hasFiles(event)) return;
		event.preventDefault();
		dragDepth++;
		dragging = true;
	}

	function handleDragOver(event: DragEvent) {
		if (!canDrop || !hasFiles(event)) return;
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'copy';
	}

	function handleDragLeave() {
		if (!dragging) return;
		dragDepth = Math.max(0, dragDepth - 1);
		if (dragDepth === 0) dragging = false;
	}

	async function handleDrop(event: DragEvent) {
		if (!canDrop || !event.dataTransfer) return;
		event.preventDefault();
		dragDepth = 0;
		dragging = false;
		const { files: dropped } = await collectDroppedFiles(event.dataTransfer, isMultiple);
		await addFiles(dropped);
	}

	/** A press on the empty part of the zone opens the file picker, as the button does. */
	function handleZoneClick(event: MouseEvent) {
		if (!hasLocal || isDisabled || activeSource) return;
		if ((event.target as Element).closest('button, a, input, label')) return;
		ref?.click();
	}

	function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
		if (syncing) return onchange?.(event);
		// The picker put the picked files in the field: they join the list, and the events go out once it is updated.
		void addFiles([...(event.currentTarget.files ?? [])]);
	}

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		if (syncing) oninput?.(event);
	}

	const iconOf = (file: File) =>
		file.type.startsWith('image/')
			? ImageRegular
			: file.type.startsWith('video/')
				? VideoRegular
				: file.type.startsWith('audio/')
					? MusicNote2Regular
					: DocumentRegular;

	const SOURCE_ICONS = {
		local: DocumentRegular,
		camera: CameraRegular,
		microphone: MicRegular,
		screen: ShareScreenStartRegular,
		url: LinkRegular
	};

	function statusText(file: FileUploaderFile) {
		const status = statusOf(file);
		if (status === 'uploading') return labels.uploading(Math.round((progress.get(file.id) ?? 0) * 100));
		return labels[status];
	}
</script>

<div
	{...wrapperAttributes}
	class={['fs-file-uploader', isDisabled && 'disabled', native.invalid && 'invalid', wrapperAttributes?.class]}
	bind:this={wrapperRef}
>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class={['fs-file-uploader-zone', dragging && 'dragging', activeSource && 'source-open']}
		ondragenter={handleDragEnter}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={handleZoneClick}
	>
		{#if activeSource}
			<div class="fs-file-uploader-source" role="group" aria-labelledby={SOURCE_ID}>
				<div class="source-header">
					<Button type="button" appearance="subtle" aria-label={labels.back} onclick={closeSource} bind:ref={backRef}>
						<ArrowLeftRegular />
					</Button>
					<span class="source-title" id={SOURCE_ID}>{labels[sourceId(activeSource)]}</span>
				</div>
				{#snippet loadingSource()}
					<div class="source-status">
						<ProgressRing size={24} aria-label={labels.loading} />
					</div>
				{/snippet}
				{#snippet failedSource()}
					<div class="source-status">
						<span class="source-error" role="alert">{labels.sourceError}</span>
						<Button type="button" onclick={() => sourceAttempt++}>{labels.tryAgain}</Button>
					</div>
				{/snippet}
				<!-- Each source loads its code when it is opened; a failed download can be tried again. -->
				{#key sourceAttempt}
					{#if isDrive(activeSource)}
						{#await import('./drive-source.svelte')}
							{@render loadingSource()}
						{:then { default: DriveSource }}
							<DriveSource {core} source={activeSource} {labels} multiple={isMultiple} onAdd={addFromSource} />
						{:catch}
							{@render failedSource()}
						{/await}
					{:else if activeSource === 'url'}
						{#await import('./url-source.svelte')}
							{@render loadingSource()}
						{:then { default: UrlSource }}
							<UrlSource {labels} {fetchLink} {maxFileSize} onAdd={(file) => addFromSource([file])} />
						{:catch}
							{@render failedSource()}
						{/await}
					{:else if activeSource !== 'local'}
						{#await import('./capture-source.svelte')}
							{@render loadingSource()}
						{:then { default: CaptureSource }}
							<CaptureSource kind={activeSource} {labels} onAdd={(file) => addFromSource([file])} />
						{:catch}
							{@render failedSource()}
						{/await}
					{/if}
				{/key}
			</div>
		{:else}
			{#if hasLocal}
				<span class="fs-file-uploader-title" id={TITLE_ID}>
					{dragging ? labels.dropActive : labels.dropTitle(isMultiple)}
				</span>
				{#if description}
					<span class="fs-file-uploader-description" id={DESCRIPTION_ID}>
						{#if typeof description === 'string'}{description}{:else}{@render description({ dragging, labels })}{/if}
					</span>
				{/if}
				<Button
					{...buttonAttributes}
					{...naming}
					type="button"
					appearance="accent"
					class={['browse-button', buttonAttributes?.class]}
					disabled={isDisabled}
					aria-labelledby={naming['aria-labelledby'] ? `${naming['aria-labelledby']} ${BROWSE_ID}` : undefined}
					aria-describedby={describedBy}
					onclick={(e) => invokeHandlers(e, [], [() => ref?.click(), buttonAttributes?.onclick])}
					onfocus={(e) => invokeHandlers(e, [], [onfocus, buttonAttributes?.onfocus])}
					onblur={(e) => invokeHandlers(e, [], [onblur, buttonAttributes?.onblur])}
					bind:ref={buttonRef}
				>
					<span id={BROWSE_ID}>{labels.browse}</span>
				</Button>
			{/if}
			{#if otherSources.length > 0}
				<div class="sources" role="group" aria-label={labels.sources} bind:this={sourcesRef}>
					{#each otherSources as source (sourceId(source))}
						{@const Icon = isDrive(source) ? null : SOURCE_ICONS[source]}
						<Button
							type="button"
							appearance="standard"
							class="source-button"
							data-source={sourceId(source)}
							disabled={isDisabled}
							onclick={(event: MouseEvent) => openSource(source, event)}
						>
							{#if isDrive(source)}<DriveIcon icon={source.icon} />{:else if Icon}<Icon aria-hidden="true" />{/if}
							{labels[sourceId(source)]}
						</Button>
					{/each}
				</div>
			{/if}
			{#if showLimits && limits.length > 0}
				<span class="fs-file-uploader-limits" id={LIMITS_ID}>
					{#each limits as limit, index (limit.text)}
						{#if index > 0}<span class="separator" aria-hidden="true">·</span>{/if}
						<span class="limit"><limit.icon aria-hidden="true" />{limit.text}</span>
					{/each}
				</span>
			{/if}
		{/if}

		<!-- The field of the form: submitted, validated and reset like any file input, behind the
		     drop zone and out of the tab order, since the button is what people use. See `NativeField`. -->
		<input
			{...attributes}
			{id}
			name={uploads ? undefined : name}
			type="file"
			class="native-field"
			aria-hidden={native.reported ? undefined : 'true'}
			tabindex={-1}
			{accept}
			multiple={isMultiple}
			disabled={isDisabled}
			bind:this={ref}
			onchange={handleChange}
			oninput={handleInput}
			onclick={(event) => {
				// A Label activates the field: the picker opens, and the focus goes to the button.
				if (!hasLocal || activeSource) event.preventDefault();
				buttonRef?.focus();
			}}
		/>
	</div>

	{#if messages.length > 0}
		<div class="fs-file-uploader-messages" role="alert">
			<ErrorCircleFilled class="message-icon" aria-hidden="true" />
			<div class="message-list">
				{#each messages as message (message)}
					<span>{message}</span>
				{/each}
			</div>
			<Button type="button" appearance="subtle" aria-label={labels.dismiss} onclick={() => (rejections = [])}>
				<DismissRegular />
			</Button>
		</div>
	{/if}

	{#if files.length > 0}
		<ListView class="fs-file-uploader-list" aria-label={labels.files} navigationMode="composite" bind:ref={listRef}>
			{#each files as file, index (file.id)}
				{@const status = statusOf(file)}
				{@const Icon = iconOf(file)}
				{@const preview = previews.get(file.id)}
				{#snippet thumbnail()}
					<span class="thumbnail" aria-hidden="true">
						{#if preview}
							<!-- An image the browser cannot decode keeps the icon of its type. -->
							<img
								src={preview}
								alt=""
								onerror={() => {
									URL.revokeObjectURL(preview);
									previews.delete(file.id);
								}}
							/>
						{:else}<Icon />{/if}
					</span>
				{/snippet}
				{#snippet details()}
					<span class="details">
						<span>{formatSize(file.size)}</span>
						{#if uploads}
							<span class="status">
								{#if status === 'uploaded'}<CheckmarkCircleFilled aria-hidden="true" />{/if}
								{#if status === 'failed'}<ErrorCircleFilled aria-hidden="true" />{/if}
								{statusText(file)}
							</span>
						{/if}
					</span>
				{/snippet}
				{#snippet actions()}
					<span class="actions">
						{#if status === 'failed'}
							<Button
								type="button"
								appearance="subtle"
								aria-label={labels.retry(file.name)}
								disabled={isDisabled}
								onclick={() => retryFile(file)}
							>
								<ArrowClockwiseRegular />
							</Button>
						{/if}
						<Button
							type="button"
							appearance="subtle"
							class="remove-button"
							aria-label={labels.remove(file.name)}
							disabled={isDisabled}
							onclick={() => removeFile(file, index)}
						>
							<DismissRegular />
						</Button>
					</span>
				{/snippet}
				<ListViewItem class={['fs-file-uploader-item', uploads && status]}>
					<Card class="item-card" orientation="vertical">
						<CardHeader image={thumbnail} title={file.name} description={details} action={actions} />
						{#if uploads && status !== 'uploaded'}
							<ProgressBar
								class="item-progress"
								value={status === 'uploading'
									? Math.round((progress.get(file.id) ?? 0) * 100)
									: status === 'failed'
										? 100
										: status === 'pending'
											? 0
											: null}
								status={status === 'failed' ? 'error' : undefined}
								aria-label={statusText(file)}
							/>
						{/if}
					</Card>
				</ListViewItem>
			{/each}
		</ListView>
	{/if}

	{#if uploads && !autoUpload && waiting.length > 0}
		<div class="fs-file-uploader-footer">
			<Button type="button" appearance="accent" disabled={isDisabled || busy} onclick={startUpload}>
				<ArrowUploadRegular />
				{labels.upload(waiting.length)}
			</Button>
		</div>
	{/if}

	{#if uploads && name}
		{#each files.filter((file) => statusOf(file) === 'uploaded') as file (file.id)}
			<input type="hidden" {name} value={uploadedValue(file)} form={attributes.form} disabled={isDisabled} />
		{/each}
	{/if}
</div>

<style>
	/* A drop zone fills its container, also inside a Label that lays out its field at the start. */
	.fs-file-uploader {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		inline-size: 100%;
		min-inline-size: 0;
		box-sizing: border-box;
		font-family: var(--fs-font-family-base);
		color: var(--fs-text-primary);
	}

	.fs-file-uploader-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		position: relative;
		box-sizing: border-box;
		min-block-size: 10rem;
		padding: 1.5rem 1rem;
		border: 1px dashed var(--fs-control-stroke-secondary);
		border-radius: var(--fs-control-overlay-border-radius, 0.5rem);
		background: var(--fs-control-alt-fill-secondary);
		text-align: center;
		cursor: pointer;
		transition:
			background var(--fs-fast-duration) ease,
			border-color var(--fs-fast-duration) ease;

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}

		&:hover:not(.source-open) {
			background: var(--fs-control-alt-fill-tertiary);
		}
		&.dragging {
			border-color: var(--fs-accent-fill-default);
			border-style: solid;
			background: var(--fs-subtle-fill-secondary);
		}
		&.source-open {
			align-items: stretch;
			justify-content: flex-start;
			padding: 0.5rem;
			border-style: solid;
			border-color: var(--fs-card-stroke-default);
			background: var(--fs-card-background-default);
			text-align: start;
			cursor: default;
		}
	}

	/* A submission found the field invalid: no file while required, or files not uploaded. */
	.invalid .fs-file-uploader-zone {
		border-color: var(--fs-system-critical);
		& .fs-file-uploader-title {
			color: var(--fs-system-critical);
		}
	}

	.disabled .fs-file-uploader-zone {
		cursor: default;
		border-color: var(--fs-control-strong-stroke-disabled);
		background: var(--fs-control-fill-disabled);
		color: var(--fs-text-disabled);
		& :is(.fs-file-uploader-description, .fs-file-uploader-limits) {
			color: var(--fs-text-disabled);
		}
	}

	.fs-file-uploader-title {
		font-size: var(--fs-subtitle-font-size);
		line-height: var(--fs-subtitle-line-height);
		font-weight: 400;
	}

	.fs-file-uploader-description {
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);
		color: var(--fs-text-secondary);
	}

	.fs-file-uploader-zone :global(.browse-button) {
		margin-block-start: 0.5rem;
	}

	.sources {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-block-start: 0.75rem;

		& :global(.source-button) {
			gap: 0.375rem;
		}
		& :global(.source-button svg) {
			flex: none;
			width: 1.125rem;
			height: 1.125rem;
		}
	}

	.fs-file-uploader-limits {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.25rem 0.5rem;
		margin-block-start: 0.5rem;
		font-size: var(--fs-caption-font-size);
		line-height: var(--fs-caption-line-height);
		color: var(--fs-text-secondary);

		& .limit {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
		}
		& :global(svg) {
			flex: none;
			inline-size: 1rem;
			block-size: 1rem;
		}
	}

	.fs-file-uploader-source {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-block-size: 0;
	}

	.source-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.source-status {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-block-size: 8rem;
		text-align: center;
	}

	.source-error {
		color: var(--fs-system-critical);
	}

	.source-title {
		font-size: var(--fs-body-font-size);
		font-weight: 600;
	}

	.native-field {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		margin: 0;
		box-sizing: border-box;
		opacity: 0;
		pointer-events: none;
	}

	.fs-file-uploader-messages {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.5rem 0.5rem 0.5rem 0.75rem;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-system-critical-bg);
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);

		& :global(.message-icon) {
			flex: none;
			margin-block-start: 0.125rem;
			color: var(--fs-system-critical);
		}
	}

	.message-list {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-self: center;
	}

	.fs-file-uploader :global(.fs-file-uploader-list) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
	}

	.fs-file-uploader :global(.fs-file-uploader-item) {
		padding: 0;
	}

	.fs-file-uploader :global(.item-card) {
		inline-size: 100%;
		min-inline-size: 0;
		box-sizing: border-box;
	}

	/* The header takes the width of the card, and a long name is cut with an ellipsis. */
	.fs-file-uploader :global(.item-card .fs-card-header) {
		inline-size: 100%;
		box-sizing: border-box;
		min-inline-size: 0;
	}

	.fs-file-uploader :global(.item-card .fs-card-header-content) {
		flex: 1;
		min-inline-size: 0;
	}

	.fs-file-uploader :global(.item-card .fs-card-header-content > .body) {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.fs-file-uploader :global(.item-progress) {
		inline-size: calc(100% - 1rem);
		margin: 0 0.5rem 0.5rem;
	}

	.thumbnail {
		display: grid;
		place-items: center;
		overflow: hidden;
		inline-size: 2.5rem;
		block-size: 2.5rem;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-secondary);
		color: var(--fs-text-secondary);
		font-size: 1.25rem;

		& img {
			inline-size: 100%;
			block-size: 100%;
			object-fit: cover;
		}
	}

	.details {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.5rem;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;

		:global(.uploaded) & {
			color: var(--fs-system-success);
		}
		:global(.failed) & {
			color: var(--fs-system-critical);
		}
	}

	.actions {
		display: flex;
		gap: 0.25rem;
	}

	.fs-file-uploader-footer {
		display: flex;
		justify-content: flex-end;
	}
</style>
