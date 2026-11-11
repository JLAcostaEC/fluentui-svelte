import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { MediaPlayer } from '#lib/index.js';

// The scripts of Video.js fail to download, as on a dropped connection.
vi.mock('@videojs/html/video/player', () => {
	throw new TypeError('Failed to fetch dynamically imported module');
});

const MESSAGE = 'The player could not be loaded. Check the connection and try again.';

describe('Video.js that fails to download', () => {
	// Chromium, Firefox and WebKit fetch a failed `import()` again when it is retried; a vitest mock keeps its
	// failure, and the download that succeeds after "Try again" cannot be shown here.
	it('says so, and offers to download it again', async () => {
		render(MediaPlayer);

		const retry = page.getByRole('button', { name: 'Try again' });
		await expect.element(retry).toBeInTheDocument();
		expect(page.getByRole('alert').element().textContent).toContain(MESSAGE);

		await retry.click();

		await expect.element(retry).toBeInTheDocument();
		expect(page.getByRole('alert').element().textContent).toContain(MESSAGE);
	});
});
