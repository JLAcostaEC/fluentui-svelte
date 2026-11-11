import type { Meta } from '#types';
import ArrowUploadRegular from 'fluentui-icons-svelte/ArrowUploadRegular.svelte';

export const META: Meta = {
	// SEO
	title: 'File Uploader',
	description:
		'A drop zone and file list that picks, drops, captures and imports files, and uploads them to any S3-compatible storage, powered by upup.',
	keywords: ['file uploader', 'file upload', 'drag and drop', 'dropzone', 'upup', 's3 upload', 'svelte'],
	canonical: '/docs/components/file-uploader',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'File Uploader — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte file uploader with drag and drop, cloud drives and resumable uploads, powered by upup.',
		type: 'article',
		url: '/docs/components/file-uploader',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'File Uploader — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte file uploader with drag and drop, cloud drives and resumable uploads, powered by upup.'
	},
	// Library-only
	slug: 'file-uploader',
	status: 'AI',
	icon: ArrowUploadRegular
};
