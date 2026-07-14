import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Avatar } from '$lib/index.js';

describe('rendering', () => {
	it('renders a div with role="img"', async () => {
		render(Avatar, { name: 'John Doe' });
		const el = page.getByRole('img');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies aria-label from name', async () => {
		render(Avatar, { name: 'Jane Smith' });
		const el = page.getByRole('img');
		await expect.element(el).toHaveAttribute('aria-label', 'Jane Smith');
	});
});

describe('initials', () => {
	it('displays initials derived from name', async () => {
		render(Avatar, { name: 'John Doe' });
		const el = page.getByText('JD');
		await expect.element(el).toBeInTheDocument();
	});

	it('displays custom initials when provided', async () => {
		render(Avatar, { name: 'John Doe', initials: 'XY' });
		const el = page.getByText('XY');
		await expect.element(el).toBeInTheDocument();
	});

	it('limits initials to 2 characters by default', async () => {
		render(Avatar, { name: 'John Michael Doe' });
		const el = page.getByText('JM');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('shape', () => {
	it('applies circular shape by default', async () => {
		render(Avatar, { name: 'A' });
		const el = page.selector('.fs-avatar.circular');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies rounded shape', async () => {
		render(Avatar, { name: 'A', shape: 'rounded' });
		const el = page.selector('.fs-avatar.rounded');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('color', () => {
	it('applies attention color by default', async () => {
		render(Avatar, { name: 'A' });
		const el = page.selector('.fs-avatar.attention');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies custom color', async () => {
		render(Avatar, { name: 'A', color: 'success' });
		const el = page.selector('.fs-avatar.success');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies critical color', async () => {
		render(Avatar, { name: 'A', color: 'critical' });
		const el = page.selector('.fs-avatar.critical');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('active state', () => {
	it('applies active class', async () => {
		render(Avatar, { name: 'A', active: 'active' });
		const el = page.selector('.fs-avatar.active');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies inactive class', async () => {
		render(Avatar, { name: 'A', active: 'inactive' });
		const el = page.selector('.fs-avatar.inactive');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('activeAppearance', () => {
	it('applies ring appearance by default', async () => {
		render(Avatar, { name: 'A' });
		const el = page.selector('.fs-avatar.ring');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies shadow appearance', async () => {
		render(Avatar, { name: 'A', activeAppearance: 'shadow' });
		const el = page.selector('.fs-avatar.shadow');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies ring-shadow appearance', async () => {
		render(Avatar, { name: 'A', activeAppearance: 'ring-shadow' });
		const el = page.selector('.fs-avatar.ring-shadow');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('image', () => {
	it('renders an img element when image is provided', async () => {
		render(Avatar, { name: 'A', image: { src: 'https://via.placeholder.com/48' } });
		const img = page.selector('.fs-avatar-image');
		await expect.element(img).toBeInTheDocument();
	});

	it('sets alt text from name', async () => {
		render(Avatar, { name: 'John', image: { src: 'https://via.placeholder.com/48' } });
		const img = page.getByAltText('John');
		await expect.element(img).toBeInTheDocument();
	});
});

describe('attributes', () => {
	it('forwards extra attributes', async () => {
		render(Avatar, { name: 'A', 'data-testid': 'my-avatar' });
		const el = page.getByTestId('my-avatar');
		await expect.element(el).toBeInTheDocument();
	});
});
