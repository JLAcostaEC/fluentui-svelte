import { page, userEvent } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { googleDriveSource, type FileUploaderFile } from '#lib/index.js';
import FileUploaderTestWrapper from './FileUploaderTestWrapper.svelte';

const file = (name: string, size = 10, type = 'text/plain') => new File(['x'.repeat(size)], name, { type });
const field = () => document.querySelector<HTMLInputElement>('input[type="file"]')!;
const pick = (...files: File[]) => userEvent.upload(field(), files);
const names = () => page.getByTestId('files');
const items = () => page.getByRole('listitem');

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('picking files', () => {
	it('names the button with its Label and its own text, and describes it with the description', async () => {
		render(FileUploaderTestWrapper, { label: 'Attachments', description: 'PDF, up to 5 MB.' });

		const button = page.getByRole('button', { name: 'Attachments Browse' });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveAccessibleDescription('PDF, up to 5 MB.');
	});

	it('lists the picked files and keeps them in the field', async () => {
		render(FileUploaderTestWrapper, { multiple: true });

		await pick(file('a.txt'), file('b.txt'));

		await expect.element(names()).toHaveTextContent('a.txt,b.txt');
		await expect.element(items()).toHaveLength(2);
		expect([...field().files!].map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
	});

	it('adds a later pick to the files already listed', async () => {
		render(FileUploaderTestWrapper, { multiple: true });

		await pick(file('a.txt'));
		await expect.element(names()).toHaveTextContent('a.txt');
		await pick(file('b.txt'));

		await expect.element(names()).toHaveTextContent('a.txt,b.txt');
		expect(field().files).toHaveLength(2);
	});

	it('replaces the file when it takes only one', async () => {
		render(FileUploaderTestWrapper);

		await pick(file('a.txt'));
		await expect.element(names()).toHaveTextContent('a.txt');
		await pick(file('b.txt'));

		await expect.element(names()).toHaveTextContent('b.txt');
		await expect.element(items()).toHaveLength(1);
	});

	it('reports the files of a type it does not accept, and leaves them out', async () => {
		const onReject = vi.fn();
		render(FileUploaderTestWrapper, { accept: '.pdf,image/*', onReject });

		await pick(file('notes.txt'));

		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('notes.txt is not a type of file this field accepts.');
		expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'type' })]);
		await expect.element(names()).toHaveTextContent('empty');
		expect(field().files).toHaveLength(0);
	});

	it('keeps to maxFiles and maxFileSize', async () => {
		render(FileUploaderTestWrapper, { multiple: true, maxFiles: 2, maxFileSize: 100 });

		await pick(file('big.txt', 200), file('a.txt'), file('b.txt'), file('c.txt'));

		await expect.element(names()).toHaveTextContent('a.txt,b.txt');
		const alert = page.getByRole('alert');
		await expect.element(alert.getByText('big.txt is larger than 100 B.')).toBeInTheDocument();
		await expect.element(alert.getByText('Only 2 files can be added.')).toBeInTheDocument();
	});

	it('removes a file and hands the focus to the next one', async () => {
		render(FileUploaderTestWrapper, { multiple: true });
		await pick(file('a.txt'), file('b.txt'));

		await page.getByRole('button', { name: 'Remove a.txt' }).click();

		await expect.element(names()).toHaveTextContent('b.txt');
		await expect.element(page.getByRole('button', { name: 'Remove b.txt' })).toHaveFocus();
		expect(field().files).toHaveLength(1);
	});

	it('adds the files dropped on the zone', async () => {
		render(FileUploaderTestWrapper, { multiple: true });
		const zone = document.querySelector('.fs-file-uploader-zone')!;
		const transfer = new DataTransfer();
		transfer.items.add(file('dropped.txt'));

		zone.dispatchEvent(new DragEvent('dragenter', { dataTransfer: transfer, bubbles: true, cancelable: true }));
		await expect.element(page.getByText('Drop to add')).toBeInTheDocument();
		zone.dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }));

		await expect.element(names()).toHaveTextContent('dropped.txt');
	});

	it('does nothing while disabled', async () => {
		render(FileUploaderTestWrapper, { disabled: true });

		await expect.element(page.getByRole('button', { name: 'Browse' })).toBeDisabled();
		expect(field().disabled).toBe(true);
	});
});

describe('in a form', () => {
	it('submits the files', async () => {
		const onsubmit = vi.fn();
		render(FileUploaderTestWrapper, { multiple: true, onsubmit });
		await pick(file('a.txt'), file('b.txt'));
		await expect.element(names()).toHaveTextContent('a.txt,b.txt');

		await page.getByRole('button', { name: 'Submit' }).click();

		const submitted = (onsubmit.mock.calls[0][0] as FormData).getAll('attachments') as File[];
		expect(submitted.map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
	});

	it('blocks the submission of a required uploader with no file', async () => {
		const onsubmit = vi.fn();
		render(FileUploaderTestWrapper, { required: true, onsubmit });

		await page.getByRole('button', { name: 'Submit' }).click();

		expect(onsubmit).not.toHaveBeenCalled();
		expect(field().validity.valueMissing).toBe(true);
		await expect.element(page.elementLocator(document.querySelector('.fs-file-uploader')!)).toHaveClass('invalid');
	});

	it('empties the list on a reset', async () => {
		render(FileUploaderTestWrapper, { multiple: true });
		await pick(file('a.txt'));
		await expect.element(names()).toHaveTextContent('a.txt');

		await page.getByRole('button', { name: 'Reset' }).click();

		await expect.element(names()).toHaveTextContent('empty');
		expect(field().files).toHaveLength(0);
	});
});

describe('uploading', () => {
	/** Lets the storage answer the uploads waiting for it, and the ones sent after. */
	let release: () => void = () => {};
	/** Every upload the storage received: the name of the file, and whether it was aborted. */
	let received: { name: string; aborted: boolean }[] = [];

	/** `status` gives the answer of the storage to each upload, in the order they arrive. */
	function stubStorage(status: (attempt: number) => number = () => 200) {
		const answered = new Promise<void>((resolve) => (release = resolve));
		received = [];

		vi.stubGlobal(
			'fetch',
			vi.fn(async (_url: string, init: RequestInit) => {
				const { name } = JSON.parse(String(init.body));
				return Response.json({ key: `uploads/${name}`, uploadUrl: `https://storage.test/${name}` });
			})
		);

		vi.stubGlobal(
			'XMLHttpRequest',
			class extends EventTarget {
				upload = new EventTarget();
				status = 0;
				statusText = '';
				responseText = '';
				#request = { name: '', aborted: false };
				open(_method: string, url: string) {
					this.#request.name = url.split('/').pop() ?? '';
				}
				setRequestHeader() {}
				getAllResponseHeaders() {
					return '';
				}
				abort() {
					this.#request.aborted = true;
					this.dispatchEvent(new Event('abort'));
				}
				send(body: Blob) {
					const attempt = received.push(this.#request) - 1;
					this.upload.dispatchEvent(
						new ProgressEvent('progress', { lengthComputable: true, loaded: body.size / 2, total: body.size })
					);
					answered.then(() => {
						if (this.#request.aborted) return;
						this.status = status(attempt);
						this.dispatchEvent(new Event('load'));
					});
				}
			}
		);
	}

	const upload = { provider: 'aws', uploadEndpoint: '/api/upload-token' };

	it('uploads each file, and the form submits its key once it is done', async () => {
		stubStorage();
		const onsubmit = vi.fn();
		const onUploadComplete = vi.fn();
		render(FileUploaderTestWrapper, { upload, autoUpload: true, onsubmit, onUploadComplete });

		await pick(file('report.pdf', 10, 'application/pdf'));

		await expect.element(page.getByText('Uploading 50%')).toBeInTheDocument();
		expect(field().validationMessage).toBe('Wait until the files finish uploading.');

		release();

		await expect.element(page.getByText('Uploaded')).toBeInTheDocument();
		expect(field().validity.valid).toBe(true);
		expect(onUploadComplete).toHaveBeenCalled();

		await page.getByRole('button', { name: 'Submit' }).click();
		expect((onsubmit.mock.calls[0][0] as FormData).getAll('attachments')).toEqual(['uploads/report.pdf']);
	});

	it('waits for the upload button without autoUpload, and stops the form until then', async () => {
		stubStorage();
		const onsubmit = vi.fn();
		render(FileUploaderTestWrapper, { upload, onsubmit });

		await pick(file('report.pdf', 10, 'application/pdf'));

		await expect.element(page.getByText('Waiting')).toBeInTheDocument();
		expect(field().validationMessage).toBe('Upload the files before sending the form.');
		await page.getByRole('button', { name: 'Submit' }).click();
		expect(onsubmit).not.toHaveBeenCalled();

		await page.getByRole('button', { name: 'Upload 1 file' }).click();
		release();

		await expect.element(page.getByText('Uploaded')).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Upload 1 file' })).not.toBeInTheDocument();
	});

	it('aborts the upload of a file removed while it uploads, and submits nothing for it', async () => {
		stubStorage();
		const onsubmit = vi.fn();
		render(FileUploaderTestWrapper, { upload, autoUpload: true, onsubmit });

		await pick(file('report.pdf', 10, 'application/pdf'));
		await expect.element(page.getByText('Uploading 50%')).toBeInTheDocument();

		await page.getByRole('button', { name: 'Remove report.pdf' }).click();
		release();

		await expect.element(names()).toHaveTextContent('empty');
		await vi.waitFor(() => expect(received[0].aborted).toBe(true));
		expect(field().validity.valid).toBe(true);
		await page.getByRole('button', { name: 'Submit' }).click();
		expect((onsubmit.mock.calls[0][0] as FormData).getAll('attachments')).toEqual([]);
	});

	it('uploads the files added while others upload, once those end', async () => {
		stubStorage();
		const onsubmit = vi.fn();
		render(FileUploaderTestWrapper, { upload, autoUpload: true, multiple: true, onsubmit });

		await pick(file('first.pdf', 10, 'application/pdf'));
		await expect.element(page.getByText('Uploading 50%')).toBeInTheDocument();
		await pick(file('second.pdf', 10, 'application/pdf'));
		await expect.element(names()).toHaveTextContent('first.pdf,second.pdf');

		release();

		await expect.element(page.getByText('Uploaded').nth(1)).toBeInTheDocument();
		expect(received.map((request) => request.name).sort()).toEqual(['first.pdf', 'second.pdf']);
		await page.getByRole('button', { name: 'Submit' }).click();
		expect((onsubmit.mock.calls[0][0] as FormData).getAll('attachments').sort()).toEqual([
			'uploads/first.pdf',
			'uploads/second.pdf'
		]);
	});

	it('retries a failed upload from its button', async () => {
		// The storage fails the first upload and takes the next one.
		stubStorage((attempt) => (attempt === 0 ? 500 : 200));
		const onUploadError = vi.fn();
		render(FileUploaderTestWrapper, { upload: { ...upload, maxRetries: 0 }, autoUpload: true, onUploadError });

		await pick(file('report.pdf', 10, 'application/pdf'));
		release();

		await expect.element(page.getByText('Upload failed')).toBeInTheDocument();
		// Once, for the file: not again for the run it failed.
		expect(onUploadError).toHaveBeenCalledOnce();
		expect(onUploadError.mock.calls[0][1]).toMatchObject({ name: 'report.pdf' });
		expect(field().validationMessage).toBe('Some files failed to upload. Retry or remove them.');

		await page.getByRole('button', { name: 'Retry report.pdf' }).click();

		await expect.element(page.getByText('Uploaded')).toBeInTheDocument();
		expect(field().validity.valid).toBe(true);
	});

	it('uploads a file added while a failed one is retried, once the retry ends', async () => {
		stubStorage((attempt) => (attempt === 0 ? 500 : 200));
		render(FileUploaderTestWrapper, { upload: { ...upload, maxRetries: 0 }, autoUpload: true, multiple: true });

		await pick(file('first.pdf', 10, 'application/pdf'));
		release();
		await expect.element(page.getByText('Upload failed')).toBeInTheDocument();

		// A storage that holds the next uploads until it is released.
		stubStorage();
		await page.getByRole('button', { name: 'Retry first.pdf' }).click();
		await expect.element(page.getByText('Uploading 50%')).toBeInTheDocument();
		await pick(file('second.pdf', 10, 'application/pdf'));
		release();

		await expect.element(page.getByText('Uploaded').nth(1)).toBeInTheDocument();
		expect(received.map((request) => request.name).sort()).toEqual(['first.pdf', 'second.pdf']);
	});

	it('reports the end of the uploads when the file that waited for them was removed', async () => {
		stubStorage();
		const onUploadComplete = vi.fn();
		render(FileUploaderTestWrapper, { upload, autoUpload: true, multiple: true, onUploadComplete });

		await pick(file('first.pdf', 10, 'application/pdf'));
		await expect.element(page.getByText('Uploading 50%')).toBeInTheDocument();
		await pick(file('second.pdf', 10, 'application/pdf'));
		await page.getByRole('button', { name: 'Remove second.pdf' }).click();
		release();

		await expect.element(page.getByText('Uploaded')).toBeInTheDocument();
		await vi.waitFor(() => expect(onUploadComplete).toHaveBeenCalledOnce());
	});
});

describe('limits', () => {
	it('accepts several files with a maxFiles above 1', async () => {
		render(FileUploaderTestWrapper, { maxFiles: 3 });

		expect(field().multiple).toBe(true);
		await expect.element(page.getByText('Choose files or drag and drop them here')).toBeInTheDocument();
	});

	it('shows the limits that are set with showLimits, and describes the button with them', async () => {
		render(FileUploaderTestWrapper, { maxFiles: 5, maxFileSize: 10 * 1024 * 1024, showLimits: true });

		const button = page.getByRole('button', { name: 'Browse' });
		await expect.element(button).toHaveAccessibleDescription(/5 files max.*10 MB each/);
	});

	it('shows the total size limit when it takes only one file', async () => {
		render(FileUploaderTestWrapper, { maxTotalFileSize: 20 * 1024 * 1024, showLimits: true });

		await expect.element(page.getByRole('button', { name: 'Browse' })).toHaveAccessibleDescription(/20 MB/);
	});
});

describe('initial files', () => {
	it('lists the files it starts with, and keeps them when another is added', async () => {
		const files = [file('seed.txt')] as unknown as FileUploaderFile[];
		render(FileUploaderTestWrapper, { files, multiple: true });

		await expect.element(names()).toHaveTextContent('seed.txt');
		await pick(file('more.txt'));

		await expect.element(names()).toHaveTextContent('seed.txt,more.txt');
		expect([...field().files!].map((f) => f.name)).toEqual(['seed.txt', 'more.txt']);
	});
});

describe('sources', () => {
	it('opens a source in the zone and goes back to the button that opened it', async () => {
		render(FileUploaderTestWrapper, { sources: ['local', 'url'] });

		await page.getByRole('button', { name: 'Link' }).click();

		await expect.element(page.getByRole('button', { name: 'Back' })).toHaveFocus();
		await expect.element(page.getByRole('textbox', { name: 'Link to a file' })).toBeInTheDocument();

		await page.getByRole('button', { name: 'Back' }).click();

		await expect.element(page.getByRole('button', { name: 'Link' })).toHaveFocus();
	});

	it('imports a file from a link without submitting the form', async () => {
		const onsubmit = vi.fn();
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(new Blob(['%PDF'], { type: 'application/pdf' })))
		);
		render(FileUploaderTestWrapper, { sources: ['local', 'url'], onsubmit });

		await page.getByRole('button', { name: 'Link' }).click();
		await page.getByRole('textbox', { name: 'Link to a file' }).fill('https://example.com/files/manual.pdf');
		await userEvent.keyboard('{Enter}');

		await expect.element(names()).toHaveTextContent('manual.pdf');
		expect(onsubmit).not.toHaveBeenCalled();
		await expect.element(page.getByRole('button', { name: 'Link' })).toHaveFocus();
	});

	it('stops the download of a link once it passes maxFileSize', async () => {
		// A body with no end: only a download that stops at the limit gets an answer.
		const cancel = vi.fn();
		const body = new ReadableStream({
			pull: (controller) => controller.enqueue(new Uint8Array(512)),
			cancel
		});
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(body, { headers: { 'content-type': 'application/pdf' } }))
		);
		render(FileUploaderTestWrapper, { sources: ['local', 'url'], maxFileSize: 1024 });

		await page.getByRole('button', { name: 'Link' }).click();
		await page.getByRole('textbox', { name: 'Link to a file' }).fill('https://example.com/files/manual.pdf');
		await page.getByRole('button', { name: 'Import' }).click();

		await expect.element(page.getByText('manual.pdf is larger than 1 KB.')).toBeInTheDocument();
		expect(cancel).toHaveBeenCalled();
		await expect.element(names()).toHaveTextContent('empty');
	});

	it('stops a camera stream that arrives after the camera view closed', async () => {
		let answer: (stream: MediaStream) => void = () => {};
		const getUserMedia = vi
			.spyOn(navigator.mediaDevices, 'getUserMedia')
			.mockImplementation(() => new Promise((resolve) => (answer = resolve)));
		render(FileUploaderTestWrapper, { sources: ['local', 'camera'] });

		await page.getByRole('button', { name: 'Camera' }).click();
		await vi.waitFor(() => expect(getUserMedia).toHaveBeenCalled());
		await page.getByRole('button', { name: 'Back' }).click();

		const stream = document.createElement('canvas').captureStream();
		answer(stream);
		await vi.waitFor(() => expect(stream.getTracks().every((track) => track.readyState === 'ended')).toBe(true));
		getUserMedia.mockRestore();
	});

	it('offers to take a photo or record once the camera shows frames', async () => {
		const canvas = Object.assign(document.createElement('canvas'), { width: 64, height: 48 });
		const getUserMedia = vi
			.spyOn(navigator.mediaDevices, 'getUserMedia')
			.mockImplementation(async () => canvas.captureStream());
		render(FileUploaderTestWrapper, { sources: ['local', 'camera'] });

		await page.getByRole('button', { name: 'Camera' }).click();
		await expect.element(page.getByRole('button', { name: 'Take photo' })).toBeDisabled();
		await expect.element(page.getByRole('button', { name: 'Record' })).toBeDisabled();

		canvas.getContext('2d')!.fillRect(0, 0, 64, 48);

		await expect.element(page.getByRole('button', { name: 'Take photo' })).toBeEnabled();
		await expect.element(page.getByRole('button', { name: 'Record' })).toBeEnabled();
		getUserMedia.mockRestore();
	});

	it('fetches a link through fetchLink, for a route of the server that avoids CORS', async () => {
		const browserFetch = vi.fn();
		vi.stubGlobal('fetch', browserFetch);
		const fetchLink = vi.fn(async () => new Response(new Blob(['%PDF'], { type: 'application/pdf' })));
		render(FileUploaderTestWrapper, { sources: ['local', 'url'], fetchLink });

		await page.getByRole('button', { name: 'Link' }).click();
		await page.getByRole('textbox', { name: 'Link to a file' }).fill('https://example.com/files/manual.pdf');
		await page.getByRole('button', { name: 'Import' }).click();

		await expect.element(names()).toHaveTextContent('manual.pdf');
		expect(fetchLink).toHaveBeenCalledWith('https://example.com/files/manual.pdf', expect.any(AbortSignal));
		expect(browserFetch).not.toHaveBeenCalled();
	});

	it('says a cloud drive with no client id cannot be used', async () => {
		render(FileUploaderTestWrapper, { sources: [googleDriveSource({ clientId: '', apiKey: '', appId: '' })] });

		await page.getByRole('button', { name: 'Google Drive' }).click();

		await expect.element(page.getByRole('alert')).toHaveTextContent('The files could not be loaded.');
	});
});
