import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FileUploaderTestWrapper from './FileUploaderTestWrapper.svelte';

// The link source fails to download, as on a dropped connection.
vi.mock('../url-source.svelte', () => {
	throw new TypeError('Failed to fetch dynamically imported module');
});

describe('a source that fails to download', () => {
	// Chromium, Firefox and WebKit fetch a failed `import()` again when it is retried; a vitest mock keeps its
	// failure, so the download that succeeds after "Try again" cannot be shown here.
	it('says so, and offers to download it again', async () => {
		render(FileUploaderTestWrapper, { sources: ['local', 'url'] });

		await page.getByRole('button', { name: 'Link' }).click();

		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('This source could not be loaded. Check the connection and try again.');
		await expect.element(page.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Back' })).toBeInTheDocument();
	});
});
