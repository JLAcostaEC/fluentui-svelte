import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { CoreOptions, UploadFile, UpupCore, UpupPlugin } from '@useupup/core';
import type { DriveProviderDescriptor } from '@useupup/core/internal';
import type { NativeFieldAttributes } from '#internal';

/** A source built into a FileUploader. `local` is the file picker and the drop zone. */
export type FileUploaderSource = 'local' | 'camera' | 'microphone' | 'screen' | 'url';

/** A cloud drive as a source, made by `googleDriveSource`, `oneDriveSource`, `dropboxSource` or `boxSource` with the ids of the provider. */
export type FileUploaderDrive = {
	readonly id: 'googleDrive' | 'oneDrive' | 'dropbox' | 'box';
	/** How upup browses the drive. */
	readonly descriptor: DriveProviderDescriptor;
	/** The brand mark of the drive. */
	readonly icon: { viewBox: string; inner: string; color?: string };
	/** Creates the upup plugin of the drive, configured. */
	readonly plugin: () => UpupPlugin;
};

/** A file of the list: a `File` with the id, status and upload result upup gives it. */
export type FileUploaderFile = UploadFile;

/** Where a file of the list is: waiting, being prepared, uploading, uploaded or failed. */
export type FileUploaderStatus = 'pending' | 'processing' | 'uploading' | 'uploaded' | 'failed';

/** Why a file was left out of the list. */
export type FileUploaderRejection = {
	file: File;
	reason: 'type' | 'size' | 'count' | 'total';
	/** The message shown for it, from the labels. */
	message: string;
};

/** How and where the files are uploaded, passed to the upup engine. The limits and the cloud drives have props of their own. */
export type FileUploaderUploadOptions = Omit<
	CoreOptions,
	| 'allowedFileTypes'
	| 'limit'
	| 'maxFileSize'
	| 'minFileSize'
	| 'maxTotalFileSize'
	| 'cloudDrives'
	| 'locale'
	| 'autoUpload'
>;

/** The texts of a FileUploader: its drop zone, its file list, its sources and its messages. */
export type FileUploaderLabels = {
	/** The title of the drop zone. Receives whether several files are accepted. */
	dropTitle: (multiple: boolean) => string;
	/** The title of the drop zone while files are dragged over it. */
	dropActive: string;
	browse: string;
	/** The name of the group of the other sources. */
	sources: string;
	local: string;
	camera: string;
	microphone: string;
	screen: string;
	url: string;
	googleDrive: string;
	oneDrive: string;
	dropbox: string;
	box: string;
	/** The button that leaves a source and goes back to the drop zone. */
	back: string;
	/** The name of the file list. */
	files: string;
	/** Receives the name of the file. */
	remove: (name: string) => string;
	/** Receives the name of the file. */
	retry: (name: string) => string;
	pending: string;
	processing: string;
	/** Receives the percentage uploaded. */
	uploading: (percent: number) => string;
	uploaded: string;
	failed: string;
	/** The validation message of a form submitted while files are still uploading. */
	uploadPending: string;
	/** The validation message of a form submitted with files that failed to upload. */
	uploadFailed: string;
	/** The validation message of a form submitted with files not uploaded yet, when `autoUpload` is off. */
	uploadRequired: string;
	/** The button that uploads the waiting files, when `autoUpload` is off. Receives their number. */
	upload: (count: number) => string;
	/** The maximum number of files, with `showLimits`. Receives the number. */
	limitFiles: (max: number) => string;
	/** The maximum size of a file, with `showLimits`. Receives the formatted size. */
	limitFileSize: (max: string) => string;
	/** The maximum size of all the files, with `showLimits`. Receives the formatted size. */
	limitTotalSize: (max: string) => string;
	/** Receives the name of the file. */
	wrongType: (name: string) => string;
	/** Receives the name of the file and the formatted limit. */
	tooLarge: (name: string, max: string) => string;
	/** Receives the name of the file and the formatted limit. */
	tooSmall: (name: string, min: string) => string;
	/** Receives the maximum number of files. */
	tooMany: (max: number) => string;
	/** Receives the formatted limit. */
	totalTooLarge: (max: string) => string;
	dismiss: string;
	/** The name of the field of the link source. */
	link: string;
	import: string;
	/** The message of a link that could not be fetched. */
	linkError: string;
	takePhoto: string;
	record: string;
	stop: string;
	switchCamera: string;
	/** The button that asks for the screen to share. */
	shareScreen: string;
	retake: string;
	add: string;
	/** The message of a device that could not be started. */
	captureError: string;
	/** The message of a device the browser was not allowed to use. */
	permissionDenied: string;
	/** Receives the name of the cloud drive. */
	signIn: (drive: string) => string;
	signOut: string;
	/** Receives the number of selected files. */
	addSelected: (count: number) => string;
	clearSelection: string;
	loadMore: string;
	emptyFolder: string;
	/** The message of a cloud drive that failed to sign in or to load. */
	driveError: string;
	/** The message of a sign-in window the browser blocked. */
	popupBlocked: string;
	loading: string;
	/** The message of a source whose code failed to download. */
	sourceError: string;
	/** The button that downloads a failed source again. */
	tryAgain: string;
};

/** What a custom description receives. */
export type FileUploaderRenderState = {
	/** Whether files are dragged over the drop zone. */
	dragging: boolean;
	/** The texts of the uploader, the given ones over the English defaults. */
	labels: FileUploaderLabels;
};

/** @propsmith FileUploaderProps */
export type FileUploaderProps = {
	/** The files of the list. Read it, or bind it, to know what the user chose and what was uploaded. The files it starts with join the list.
	 * @default []
	 * @bindable
	 */
	files?: FileUploaderFile[];
	/** Where the files can come from. Each source other than `local` adds a button to the drop zone. Cloud drives use `googleDriveSource`, `oneDriveSource`, `dropboxSource` or `boxSource`; only the ones passed are bundled. Read once, on creation.
	 * @type (FileUploaderSource | FileUploaderDrive)[]
	 * @default ['local']
	 */
	sources?: (FileUploaderSource | FileUploaderDrive)[];
	/** Where and how the files are uploaded. With an `uploadEndpoint` or a `serverUrl`, the files are uploaded, and the form submits what `uploadedValue` returns for each one instead of the file. Without them, the form submits the files.
	 * @type FileUploaderUploadOptions
	 */
	upload?: FileUploaderUploadOptions;
	/** Uploads each file as soon as it is added. Without it, a button uploads the waiting files, and the form cannot be submitted until they are uploaded.
	 * @default false
	 */
	autoUpload?: boolean;
	/** Fetches the file of the link source. A browser reads a file of another site only when that site allows it (CORS); point this at a route of your server that fetches the link instead.
	 * @default (url, signal) => fetch(url, { signal })
	 */
	fetchLink?: (url: string, signal: AbortSignal) => Promise<Response>;
	/** What the form submits for an uploaded file.
	 * @default (file) => file.key
	 */
	uploadedValue?: (file: FileUploaderFile) => string;
	/** The file types accepted, like the `accept` attribute: extensions, MIME types or wildcards such as `image/*`. */
	accept?: string;
	/** The maximum number of files. Above 1, it accepts several files, as `multiple` does. */
	maxFiles?: number;
	/** The maximum size of a file, in bytes. */
	maxFileSize?: number;
	/** The minimum size of a file, in bytes. */
	minFileSize?: number;
	/** The maximum size of all the files together, in bytes. */
	maxTotalFileSize?: number;
	/** The line under the title of the drop zone, usually the accepted types and sizes.
	 * @type string | Snippet
	 */
	description?: string | Snippet<[FileUploaderRenderState]>;
	/** Shows the limits of the uploader at the foot of the drop zone: the number of files, the size of each one and the size of all of them, the ones that are set. */
	showLimits?: boolean;
	/** The texts of the uploader. The ones left out fall back to English. */
	labels?: Partial<FileUploaderLabels>;
	/** The upup engine of the uploader, to pause, resume or cancel the uploads, or to listen to its events. The engine runs in the browser only: it is `null` on the server, and set once the uploader is mounted.
	 * @bindable
	 */
	uploader?: UpupCore | null;
	/** Called with the files added to the list. */
	onFilesAdded?: (files: FileUploaderFile[]) => void;
	/** Called with a file removed from the list. */
	onFileRemoved?: (file: FileUploaderFile) => void;
	/** Called with the files left out of the list, and why. */
	onReject?: (rejections: FileUploaderRejection[]) => void;
	/** Called with the files of the list once every upload has ended. */
	onUploadComplete?: (files: FileUploaderFile[]) => void;
	/** Called when an upload fails. */
	onUploadError?: (error: Error, file?: FileUploaderFile) => void;
	/** The DOM reference of the native file input that holds the files. The other attributes of the uploader are applied to it.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** The DOM reference of the button that opens the file picker.
	 * @bindable
	 */
	buttonRef?: HTMLButtonElement | null;
	/** The attributes to spread on the button that opens the file picker.
	 * @type HTMLButtonAttributes
	 */
	buttonAttributes?: HTMLButtonAttributes;
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
} & NativeFieldAttributes<FileInputAttributes>;

/** The attributes of the native file input, without the ones the uploader sets itself. */
export type FileInputAttributes = Omit<HTMLInputAttributes, 'type' | 'value' | 'files' | 'accept'>;
