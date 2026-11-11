import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import FileUploader from '../file-uploader.svelte';
import { googleDriveSource } from '../drives.ts';

describe('FileUploader on the server', () => {
	it('renders the drop zone, the sources and the field of the form', () => {
		const { body } = render(FileUploader, {
			props: {
				name: 'attachments',
				multiple: true,
				sources: ['local', 'url', googleDriveSource({ clientId: 'id', apiKey: 'key', appId: 'app' })]
			}
		});

		expect(body).toContain('Choose files or drag and drop them here');
		expect(body).toContain('Browse');
		expect(body).toMatch(/<input[^>]*name="attachments"[^>]*type="file"|<input[^>]*type="file"[^>]*name="attachments"/);
		expect(body).toContain('data-source="url"');
		expect(body).toContain('data-source="googleDrive"');
	});

	it('leaves the files out of the field when they are uploaded', () => {
		const { body } = render(FileUploader, {
			props: { name: 'attachments', upload: { provider: 'aws', uploadEndpoint: '/api/upload-token' } }
		});

		expect(body).not.toContain('name="attachments"');
	});
});
