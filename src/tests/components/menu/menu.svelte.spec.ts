import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { MenuItem, MenuTrigger, MenuDivider } from '$lib/index.js';
import MenuTestWrapper from './MenuTestWrapper.svelte';

describe('MenuTrigger', () => {
	it('renders the trigger button', async () => {
		render(MenuTestWrapper);
		const el = page.getByRole('button', { name: 'Open Menu' });
		await expect.element(el).toBeInTheDocument();
	});

	it('sets aria-haspopup="menu" on the trigger', async () => {
		render(MenuTestWrapper);
		const el = page.getByRole('button', { name: 'Open Menu' });
		await expect.element(el).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('references the popover via aria-controls', async () => {
		render(MenuTestWrapper);
		const el = page.getByRole('button', { name: 'Open Menu' });
		await expect.element(el).toHaveAttribute('aria-controls');
	});

	it('throws when used outside a Menu', async () => {
		expect(() => render(MenuTrigger)).toThrow('No MenuContext found for fs-menu-.');
	});
});

describe('opening', () => {
	it('calls onOpenChange with true when the trigger is clicked', async () => {
		const onOpenChange = vi.fn();
		render(MenuTestWrapper, { onOpenChange });
		await page.getByRole('button', { name: 'Open Menu' }).click();
		expect(onOpenChange).toHaveBeenCalledWith(expect.anything(), true);
	});

	it('renders the popover with a menu role when open', async () => {
		render(MenuTestWrapper, { open: true });
		const el = page.getByRole('menu');
		await expect.element(el.first()).toBeInTheDocument();
	});
});

describe('MenuItem', () => {
	it('renders menu items with role="menuitem" when open', async () => {
		render(MenuTestWrapper, { open: true });
		const items = page.getByRole('menuitem');
		await expect.element(items.nth(0)).toHaveTextContent('New');
		await expect.element(items.nth(2)).toHaveTextContent('Open');
	});

	it('renders a disabled menu item', async () => {
		render(MenuTestWrapper, { open: true });
		const el = page.selector('button.fs-menu-item[disabled]');
		await expect.element(el).toBeDisabled();
	});

	it('throws when used outside a Menu', async () => {
		expect(() => render(MenuItem)).toThrow('No MenuContext found for fs-menu-.');
	});
});

describe('MenuItemCheckbox', () => {
	it('renders with role="menuitemcheckbox"', async () => {
		render(MenuTestWrapper, { open: true, variant: 'checkbox' });
		const el = page.getByRole('menuitemcheckbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('toggles aria-checked when clicked', async () => {
		render(MenuTestWrapper, { open: true, variant: 'checkbox' });
		const el = page.getByRole('menuitemcheckbox');
		await expect.element(el).toHaveAttribute('aria-checked', 'false');
		await el.click();
		await expect.element(el).toHaveAttribute('aria-checked', 'true');
	});

	it('calls onCheckedValueChange when toggled', async () => {
		const onCheckedValueChange = vi.fn();
		render(MenuTestWrapper, { open: true, variant: 'checkbox', onCheckedValueChange });
		await page.getByRole('menuitemcheckbox').click();
		expect(onCheckedValueChange).toHaveBeenCalled();
	});
});

describe('MenuItemRadio', () => {
	it('renders with role="menuitemradio"', async () => {
		render(MenuTestWrapper, { open: true, variant: 'radio' });
		const radios = page.getByRole('menuitemradio');
		await expect.element(radios.nth(0)).toBeInTheDocument();
		await expect.element(radios.nth(1)).toBeInTheDocument();
	});

	it('reflects the checked radio from checkedValues', async () => {
		render(MenuTestWrapper, { open: true, variant: 'radio', checkedValues: { pick: ['x'] } });
		const radios = page.getByRole('menuitemradio');
		await expect.element(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
		await expect.element(radios.nth(1)).toHaveAttribute('aria-checked', 'false');
	});

	it('checks the selected radio when clicked', async () => {
		render(MenuTestWrapper, { open: true, variant: 'radio' });
		const radios = page.getByRole('menuitemradio');
		await expect.element(radios.nth(0)).toHaveAttribute('aria-checked', 'false');
		await radios.nth(0).click();
		await expect.element(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
	});
});

describe('MenuGroup', () => {
	it('renders a group with a header', async () => {
		render(MenuTestWrapper, { open: true, variant: 'group' });
		const group = page.getByRole('group');
		await expect.element(group).toBeInTheDocument();
		await expect.element(page.getByText('Section')).toBeInTheDocument();
	});
});

describe('MenuDivider', () => {
	it('renders a separator', async () => {
		render(MenuDivider);
		const el = page.getByRole('separator');
		await expect.element(el).toBeInTheDocument();
	});

	it('has the fs-menu-divider class', async () => {
		render(MenuDivider);
		const el = page.selector('.fs-menu-divider');
		await expect.element(el).toBeInTheDocument();
	});
});
