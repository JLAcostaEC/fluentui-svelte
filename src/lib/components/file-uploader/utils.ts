import type { UploadStatus } from '@useupup/core';
import type {
	FileUploaderDrive,
	FileUploaderFile,
	FileUploaderLabels,
	FileUploaderSource,
	FileUploaderStatus
} from './types.ts';

/** The English texts of a FileUploader, used for every label the `labels` prop leaves out. */
export const FILE_UPLOADER_LABELS: FileUploaderLabels = {
	dropTitle: (multiple) =>
		multiple ? 'Choose files or drag and drop them here' : 'Choose a file or drag and drop it here',
	dropActive: 'Drop to add',
	browse: 'Browse',
	sources: 'Import from',
	local: 'My device',
	camera: 'Camera',
	microphone: 'Audio',
	screen: 'Screen',
	url: 'Link',
	googleDrive: 'Google Drive',
	oneDrive: 'OneDrive',
	dropbox: 'Dropbox',
	box: 'Box',
	back: 'Back',
	files: 'Files',
	remove: (name) => `Remove ${name}`,
	retry: (name) => `Retry ${name}`,
	pending: 'Waiting',
	processing: 'Processing',
	uploading: (percent) => `Uploading ${percent}%`,
	uploaded: 'Uploaded',
	failed: 'Upload failed',
	uploadPending: 'Wait until the files finish uploading.',
	uploadFailed: 'Some files failed to upload. Retry or remove them.',
	uploadRequired: 'Upload the files before sending the form.',
	upload: (count) => (count === 1 ? 'Upload 1 file' : `Upload ${count} files`),
	limitFiles: (max) => (max === 1 ? '1 file max' : `${max} files max`),
	limitFileSize: (max) => `${max} each`,
	limitTotalSize: (max) => `${max} in total`,
	wrongType: (name) => `${name} is not a type of file this field accepts.`,
	tooLarge: (name, max) => `${name} is larger than ${max}.`,
	tooSmall: (name, min) => `${name} is smaller than ${min}.`,
	tooMany: (max) => `Only ${max} files can be added.`,
	totalTooLarge: (max) => `The files together cannot be larger than ${max}.`,
	dismiss: 'Dismiss',
	link: 'Link to a file',
	import: 'Import',
	linkError: 'The file could not be fetched from that link.',
	takePhoto: 'Take photo',
	record: 'Record',
	stop: 'Stop',
	switchCamera: 'Switch camera',
	shareScreen: 'Choose what to share',
	retake: 'Retake',
	add: 'Add',
	captureError: 'The device could not be started.',
	permissionDenied: 'The browser was not allowed to use the device. Allow it in the site settings and try again.',
	signIn: (drive) => `Sign in to ${drive}`,
	signOut: 'Sign out',
	addSelected: (count) => (count === 1 ? 'Add 1 file' : `Add ${count} files`),
	clearSelection: 'Clear selection',
	loadMore: 'Load more',
	emptyFolder: 'This folder is empty.',
	driveError: 'The files could not be loaded.',
	popupBlocked: 'The browser blocked the sign-in window. Allow pop-ups for this site and try again.',
	loading: 'Loading',
	sourceError: 'This source could not be loaded. Check the connection and try again.',
	tryAgain: 'Try again'
};

/** Whether a source is a cloud drive, made by `googleDriveSource`, `oneDriveSource`, `dropboxSource` or `boxSource`. */
export const isDrive = (source: FileUploaderSource | FileUploaderDrive): source is FileUploaderDrive =>
	typeof source === 'object';

/** The key of a source, for its label and its button. */
export const sourceId = (source: FileUploaderSource | FileUploaderDrive) => (isDrive(source) ? source.id : source);

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

/** A size in bytes the way people read it: `1.2 MB`. */
export function formatSize(bytes: number) {
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < UNITS.length - 1) {
		value /= 1024;
		unit++;
	}
	const digits = unit === 0 || value >= 10 ? 0 : 1;
	return `${value.toFixed(digits).replace(/\.0$/, '')} ${UNITS[unit]}`;
}

/** Whether a file matches an `accept` list of extensions, MIME types and wildcards. */
export function accepts(file: File, accept: string | undefined) {
	if (!accept?.trim()) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return accept
		.split(',')
		.map((item) => item.trim().toLowerCase())
		.filter(Boolean)
		.some((item) => {
			if (item.startsWith('.')) return name.endsWith(item);
			if (item.endsWith('/*')) return type.startsWith(item.slice(0, -1));
			return type === item;
		});
}

/**
 * Where a file of the list is, from the status upup gives it. The values of its `UploadStatus` are written out:
 * importing the enum would bring upup into the server bundle.
 */
export function statusOf(file: FileUploaderFile): FileUploaderStatus {
	switch (file.status as `${UploadStatus}`) {
		case 'PROCESSING':
			return 'processing';
		case 'UPLOADING':
		case 'PAUSED':
			return 'uploading';
		case 'SUCCESSFUL':
			return 'uploaded';
		case 'FAILED':
			return 'failed';
		default:
			return 'pending';
	}
}

/** The extension of a recording, from the MIME type the recorder chose. */
export function extensionOf(mimeType: string) {
	const [type, subtype = ''] = mimeType.split(';')[0].split('/');
	if (subtype === 'mp4') return type === 'audio' ? 'm4a' : 'mp4';
	if (subtype === 'mpeg') return 'mp3';
	return subtype || 'webm';
}

/** A name for a captured file, unique enough to tell several captures apart. */
export const captureName = (kind: string, extension: string) =>
	`${kind}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.${extension}`;
