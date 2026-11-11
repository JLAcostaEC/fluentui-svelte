<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbButton,
		BreadcrumbDivider,
		BreadcrumbItem,
		Button,
		Checkbox,
		ProgressBar,
		ProgressRing
	} from '#lib/index.js';
	import { onMount, untrack } from 'svelte';
	import type { UpupCore } from '@useupup/core';
	import { DriveBrowserController } from '@useupup/core/internal';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';
	import SignOutRegular from 'fluentui-icons-svelte/SignOutRegular.svelte';
	import DriveIcon from './drive-icon.svelte';
	import type { FileUploaderDrive, FileUploaderLabels } from './types.ts';
	import { formatSize } from './utils.ts';

	let {
		core,
		source,
		labels,
		multiple,
		onAdd
	}: {
		core: UpupCore;
		source: FileUploaderDrive;
		labels: FileUploaderLabels;
		multiple: boolean;
		onAdd: (files: File[]) => void;
	} = $props();

	// The source is fixed for the life of the view: the uploader opens a new one for another drive.
	const { descriptor, configured, controller } = untrack(() => {
		const descriptor = source.descriptor;
		return {
			descriptor,
			configured: Boolean(core.getPlugin(descriptor.pluginId)),
			controller: new DriveBrowserController(core, descriptor, {
				onFilesSelected: (files) => onAdd(files),
				// The uploader closes the view once the files are added.
				onClose: () => {}
			})
		};
	});

	let drive = $state.raw(controller.getSnapshot());

	const gis = descriptor.auth === 'gis';
	const signedIn = $derived(gis ? Boolean(drive.token) : drive.isAuthenticated);
	const authReady = $derived(gis ? drive.isAuthReady : !drive.isLoading);
	const items = $derived(drive.folder?.children ?? []);
	const selected = $derived(new Set(drive.selectedFiles.map((file) => file.id)));
	const errorText = $derived(
		drive.error?.messageKey === 'popupBlocked' ? labels.popupBlocked : drive.error ? labels.driveError : ''
	);

	onMount(() => {
		const off = controller.subscribe(() => (drive = controller.getSnapshot()));
		controller.init();
		drive = controller.getSnapshot();
		return () => {
			off();
			controller.destroy();
		};
	});

	function toggle(file: (typeof items)[number]) {
		// One file at a time when the uploader takes one: picking another replaces it.
		if (!multiple && !selected.has(file.id)) drive.selectedFiles.forEach((other) => controller.handleClick(other));
		controller.handleClick(file);
	}

	function signIn() {
		if (drive.authCancelled || drive.error) controller.retryAuth();
		else controller.signIn();
	}
</script>

<div class="fs-file-uploader-drive">
	{#if !configured}
		<div class="placeholder">
			<span class="error" role="alert">{labels.driveError}</span>
		</div>
	{:else if !signedIn}
		<div class="placeholder">
			<span class="brand" aria-hidden="true"><DriveIcon icon={source.icon} /></span>
			{#if errorText}
				<span class="error" role="alert">{errorText}</span>
			{/if}
			<Button type="button" appearance="accent" disabled={!authReady} onclick={signIn}>
				{labels.signIn(labels[source.id])}
			</Button>
		</div>
	{:else}
		<div class="toolbar">
			<Breadcrumb size="small" aria-label={labels[source.id]}>
				{#each drive.path as folder, index (folder.id)}
					{#if index > 0}<BreadcrumbDivider />{/if}
					<BreadcrumbItem>
						{#if index === drive.path.length - 1}
							<BreadcrumbButton current>{folder.name}</BreadcrumbButton>
						{:else}
							<BreadcrumbButton type="button" onclick={() => controller.handleClick(folder)}>
								{folder.name}
							</BreadcrumbButton>
						{/if}
					</BreadcrumbItem>
				{/each}
			</Breadcrumb>
			<span class="user">{drive.user?.email ?? drive.user?.name ?? ''}</span>
			<Button type="button" appearance="subtle" aria-label={labels.signOut} onclick={() => controller.signOut()}>
				<SignOutRegular />
			</Button>
		</div>

		{#if drive.isClickLoading}
			<ProgressBar aria-label={labels.loading} />
		{/if}
		{#if errorText}
			<span class="error" role="alert">{errorText}</span>
		{/if}

		{#if items.length === 0 && !drive.isClickLoading}
			<div class="placeholder"><span class="empty">{labels.emptyFolder}</span></div>
		{:else}
			<ul class="items" aria-label={drive.path.at(-1)?.name ?? labels[source.id]} aria-busy={drive.isClickLoading}>
				{#each items as item (item.id)}
					<li>
						{#if item.isFolder}
							<button type="button" class="row folder" onclick={() => controller.handleClick(item)}>
								<FolderRegular class="row-icon" aria-hidden="true" />
								<span class="row-name">{item.name}</span>
							</button>
						{:else}
							<Checkbox
								checked={selected.has(item.id)}
								onchange={() => toggle(item)}
								wrapperAttributes={{ class: 'row file' }}
							>
								<span class="row-name">{item.name}</span>
								<span class="row-size">{formatSize(item.size)}</span>
							</Checkbox>
						{/if}
					</li>
				{/each}
			</ul>
			{#if drive.hasMore}
				<Button type="button" appearance="subtle" disabled={drive.isLoadingMore} onclick={() => controller.loadMore()}>
					{labels.loadMore}
				</Button>
			{/if}
		{/if}

		{#if drive.selectedFiles.length > 0}
			<div class="footer">
				{#if drive.showLoader}<ProgressRing size={20} aria-label={labels.loading} />{/if}
				<Button type="button" disabled={drive.showLoader} onclick={() => controller.handleCancelDownload()}>
					{labels.clearSelection}
				</Button>
				<Button type="button" appearance="accent" disabled={drive.showLoader} onclick={() => controller.handleSubmit()}>
					{labels.addSelected(drive.selectedFiles.length)}
				</Button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.fs-file-uploader-drive {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-block-size: 10rem;
	}

	.placeholder {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
		text-align: center;
	}

	.brand {
		font-size: 2.5rem;
		line-height: 0;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-inline-size: 0;

		& > :global(:first-child) {
			flex: 1;
			min-inline-size: 0;
		}
	}

	.user {
		overflow: hidden;
		max-inline-size: 12rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}

	.items {
		display: flex;
		flex-direction: column;
		max-block-size: 18rem;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		list-style: none;
	}

	.items :global(.row) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		inline-size: 100%;
		min-block-size: 2.25rem;
		padding: 0.25rem 0.5rem;
		box-sizing: border-box;
		border: none;
		border-radius: var(--fs-control-border-radius);
		background: transparent;
		color: var(--fs-text-primary);
		font: inherit;
		font-size: var(--fs-body-font-size);
		text-align: start;
		cursor: pointer;
	}

	.items :global(.row:hover) {
		background: var(--fs-subtle-fill-secondary);
	}

	.folder:focus-visible {
		outline: 2px solid var(--fs-focus-stroke-outer);
		outline-offset: -2px;
	}

	.items :global(.row-icon) {
		flex: none;
		font-size: 1.25rem;
		color: var(--fs-accent-text-primary);
	}

	.row-name {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.row-size {
		margin-inline-start: auto;
		padding-inline-start: 0.5rem;
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
		padding-block-start: 0.5rem;
		border-block-start: 1px solid var(--fs-divider-stroke-default);
	}

	.error {
		font-size: var(--fs-caption-font-size);
		color: var(--fs-system-critical);
	}

	.empty {
		color: var(--fs-text-secondary);
	}
</style>
