# File Uploader

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A drop zone and file list for choosing files: pick them, drag and drop them, or import them from the camera, the microphone, the screen, a link and cloud drives (Google Drive, OneDrive, Dropbox, Box). It is built on the headless upup engine (`@useupup/core`), which also uploads each file to any S3-compatible storage.

Two ways to use it in a form:

- **Without `upload`**, it is a native file input: the form submits the files under `name`, and `required`, reset and `Label` work as usual.
- **With `upload`** (an `uploadEndpoint`, a `serverUrl` or a tus endpoint), the files are uploaded with a button under the list, or as soon as they are added with `autoUpload`. The form submits what `uploadedValue` returns for each uploaded file (its storage `key` by default) instead of the file, and a submission is stopped while files are not uploaded yet, uploading or failed.

A submission that finds the uploader invalid (`required` with no file, or files not uploaded) turns the drop zone critical.

## Usage

```svelte
<script>
	import { FileUploader, Label } from 'fluentui-svelte';

	let files = $state([]);
</script>

<Label label="Upload" labelPosition="above">
	<FileUploader
		bind:files
		name="attachments"
		accept=".jpg,.jpeg,.png,.pdf,.mp4"
		maxFileSize={50 * 1024 * 1024}
		description="JPEG, PNG, PDF, and MP4 formats, up to 50 MB."
	/>
</Label>
```

## Examples

### Multiple Files

Set `multiple`, or a `maxFiles` above 1, to accept several files, and `maxFileSize`, `minFileSize` or `maxTotalFileSize` to limit them. Files outside the limits are left out, with a message saying why, and `onReject` receives them. `showLimits` shows the limits at the foot of the drop zone (for example "5 files max · 10 MB each").

```svelte
<FileUploader
	maxFiles={5}
	maxFileSize={10 * 1024 * 1024}
	maxTotalFileSize={30 * 1024 * 1024}
	accept="image/*"
	showLimits
/>
```

### Sources

Each source in `sources` adds a button to the drop zone, and opens in its place. `camera`, `microphone` and `screen` record with the media APIs of the browser and show the result before it is added; `url` fetches a file from a link: the site of the file must allow CORS, or `fetchLink` can send the request through a route of your server (allow only trusted hosts there). A cloud drive is passed as an object made by `googleDriveSource`, `oneDriveSource`, `dropboxSource` or `boxSource` with the ids of the provider; only the drives passed are bundled. Each source loads its code when it is opened.

```svelte
<script>
	import { FileUploader, googleDriveSource, oneDriveSource, dropboxSource, boxSource } from 'fluentui-svelte';
</script>

<FileUploader
	multiple
	sources={[
		'local',
		'url',
		'camera',
		'microphone',
		'screen',
		googleDriveSource({ clientId: '...', apiKey: '...', appId: '...' }),
		oneDriveSource({ clientId: '...' }),
		dropboxSource({ clientId: '...' }),
		boxSource({ clientId: '...' })
	]}
/>
```

### Uploading

Pass `upload` with an `uploadEndpoint`: a route of your app that receives `{ name, size, type, metadata }` and returns `{ key, uploadUrl }`, where `uploadUrl` is a presigned PUT URL of your storage. `serverUrl` points at a handler of `@useupup/server` instead. Without `autoUpload`, a button under the list uploads the waiting files; `uploader.upload()` does it from code.

```svelte
<form method="POST">
	<FileUploader
		name="attachments"
		multiple
		required
		upload={{ provider: 'aws', uploadEndpoint: '/api/upload-token' }}
		autoUpload
		onUploadComplete={(files) => console.log(files.map((file) => file.key))}
	/>
	<button>Send</button>
</form>
```

The texts default to English; pass `labels` with the ones to translate. `uploader` gives the upup engine, to pause, resume, cancel or listen to its events.

HTML attributes, including class, id and ARIA attributes, apply to the native file input. Bind ref to access it. Use buttonAttributes and buttonRef for the button that opens the picker, and wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:FileUploaderProps -->

| Name                                         | Type                                                      | Default                                   | Description                                                                                                                                                                                                                                     |
| -------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `files` _bindable_                           | `FileUploaderFile[]`                                      | `[]`                                      | The files of the list. Read it, or bind it, to know what the user chose and what was uploaded. The files it starts with join the list.                                                                                                          |
| `sources`                                    | `(FileUploaderSource` &#124; `FileUploaderDrive)[]`       | `['local']`                               | Where the files can come from. Each source other than `local` adds a button to the drop zone. Cloud drives use `googleDriveSource`, `oneDriveSource`, `dropboxSource` or `boxSource`; only the ones passed are bundled. Read once, on creation. |
| `upload`                                     | `FileUploaderUploadOptions`                               |                                           | Where and how the files are uploaded. With an `uploadEndpoint` or a `serverUrl`, the files are uploaded, and the form submits what `uploadedValue` returns for each one instead of the file. Without them, the form submits the files.          |
| `autoUpload`                                 | `boolean`                                                 | `false`                                   | Uploads each file as soon as it is added. Without it, a button uploads the waiting files, and the form cannot be submitted until they are uploaded.                                                                                             |
| `fetchLink`                                  | `(url: string, signal: AbortSignal) => Promise<Response>` | `(url, signal) => fetch(url, { signal })` | Fetches the file of the link source. A browser reads a file of another site only when that site allows it (CORS); point this at a route of your server that fetches the link instead.                                                           |
| `uploadedValue`                              | `(file: FileUploaderFile) => string`                      | `(file) => file.key`                      | What the form submits for an uploaded file.                                                                                                                                                                                                     |
| `accept`                                     | `string`                                                  |                                           | The file types accepted, like the `accept` attribute: extensions, MIME types or wildcards such as `image/*`.                                                                                                                                    |
| `maxFiles`                                   | `number`                                                  |                                           | The maximum number of files. Above 1, it accepts several files, as `multiple` does.                                                                                                                                                             |
| `maxFileSize`                                | `number`                                                  |                                           | The maximum size of a file, in bytes.                                                                                                                                                                                                           |
| `minFileSize`                                | `number`                                                  |                                           | The minimum size of a file, in bytes.                                                                                                                                                                                                           |
| `maxTotalFileSize`                           | `number`                                                  |                                           | The maximum size of all the files together, in bytes.                                                                                                                                                                                           |
| `description`                                | `string` &#124; `Snippet`                                 |                                           | The line under the title of the drop zone, usually the accepted types and sizes.                                                                                                                                                                |
| `showLimits`                                 | `boolean`                                                 |                                           | Shows the limits of the uploader at the foot of the drop zone: the number of files, the size of each one and the size of all of them, the ones that are set.                                                                                    |
| `labels`                                     | `Partial<FileUploaderLabels>`                             |                                           | The texts of the uploader. The ones left out fall back to English.                                                                                                                                                                              |
| `uploader` _bindable_                        | `UpupCore` &#124; `null`                                  |                                           | The upup engine of the uploader, to pause, resume or cancel the uploads, or to listen to its events. The engine runs in the browser only: it is `null` on the server, and set once the uploader is mounted.                                     |
| `onFilesAdded`                               | `(files: FileUploaderFile[]) => void`                     |                                           | Called with the files added to the list.                                                                                                                                                                                                        |
| `onFileRemoved`                              | `(file: FileUploaderFile) => void`                        |                                           | Called with a file removed from the list.                                                                                                                                                                                                       |
| `onReject`                                   | `(rejections: FileUploaderRejection[]) => void`           |                                           | Called with the files left out of the list, and why.                                                                                                                                                                                            |
| `onUploadComplete`                           | `(files: FileUploaderFile[]) => void`                     |                                           | Called with the files of the list once every upload has ended.                                                                                                                                                                                  |
| `onUploadError`                              | `(error: Error, file?: FileUploaderFile) => void`         |                                           | Called when an upload fails.                                                                                                                                                                                                                    |
| `ref` _bindable_                             | `HTMLInputElement` &#124; `null`                          |                                           | The DOM reference of the native file input that holds the files. The other attributes of the uploader are applied to it.                                                                                                                        |
| `buttonRef` _bindable_                       | `HTMLButtonElement` &#124; `null`                         |                                           | The DOM reference of the button that opens the file picker.                                                                                                                                                                                     |
| `buttonAttributes`                           | `HTMLButtonAttributes`                                    |                                           | The attributes to spread on the button that opens the file picker.                                                                                                                                                                              |
| `wrapperRef` _bindable_                      | `HTMLDivElement` &#124; `null`                            |                                           | The DOM reference of the wrapper element.                                                                                                                                                                                                       |
| `wrapperAttributes`                          | `HTMLAttributes`                                          |                                           | The attributes to spread on the wrapper element.                                                                                                                                                                                                |
| `NativeFieldAttributes<FileInputAttributes>` |                                                           |                                           |                                                                                                                                                                                                                                                 |

<!-- /props:FileUploaderProps -->
