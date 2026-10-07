import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TagTestWrapper from './TagTestWrapper.svelte';

describe('Tag', () => {
	describe('plain tag', () => {
		it('renders a static span with its text', async () => {
			render(TagTestWrapper);
			const el = page.selector('.fs-tag');
			await expect.element(el).toHaveTextContent('Tag 1');
			expect(el.element().tagName).toBe('SPAN');
			expect(page.getByRole('button').elements()).toHaveLength(0);
		});

		it('applies the default appearance, size and shape', async () => {
			render(TagTestWrapper);
			const el = page.selector('.fs-tag');
			await expect.element(el).toHaveClass('filled');
			await expect.element(el).toHaveClass('medium');
			await expect.element(el).toHaveClass('circular');
		});

		it('applies appearance, size and shape', async () => {
			render(TagTestWrapper, { tagProps: { appearance: 'brand', size: 'small', shape: 'square' } });
			const el = page.selector('.fs-tag');
			await expect.element(el).toHaveClass('brand');
			await expect.element(el).toHaveClass('small');
			await expect.element(el).toHaveClass('square');
		});

		it('applies the rounded shape', async () => {
			render(TagTestWrapper, { tagProps: { shape: 'rounded' } });
			await expect.element(page.selector('.fs-tag')).toHaveClass('rounded');
		});

		it('paints a selected tag', async () => {
			render(TagTestWrapper, { tagProps: { selected: true } });
			await expect.element(page.selector('.fs-tag')).toHaveClass('selected');
		});

		it('does not dismiss when it is not dismissible', async () => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { onDismiss } });
			await page.selector('.fs-tag').click();
			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('forwards onclick and extra attributes', async () => {
			const onclick = vi.fn();
			render(TagTestWrapper, { tagProps: { onclick, 'data-testid': 'my-tag' } as never });
			await page.getByTestId('my-tag').click();
			expect(onclick).toHaveBeenCalledOnce();
		});

		it('renders an icon, hidden from assistive technologies', async () => {
			render(TagTestWrapper, { withIcon: true });
			const icon = page.selector('.fs-tag-icon');
			await expect.element(icon).toBeInTheDocument();
			await expect.element(icon).toHaveAttribute('aria-hidden', 'true');
		});

		it('renders media', async () => {
			render(TagTestWrapper, { withMedia: true });
			await expect.element(page.getByTestId('media')).toBeInTheDocument();
		});

		it('renders a string secondary text', async () => {
			render(TagTestWrapper, { tagProps: { secondaryText: 'Secondary' } });
			await expect.element(page.selector('.fs-tag-secondary-text')).toHaveTextContent('Secondary');
			await expect.element(page.selector('.fs-tag')).toHaveClass('with-secondary');
		});

		it('renders a snippet secondary text', async () => {
			render(TagTestWrapper, { withSecondarySnippet: true });
			await expect.element(page.getByTestId('secondary-snippet')).toBeInTheDocument();
		});
	});

	describe('dismissible tag', () => {
		it('is a single button named after its text and the dismiss label', async () => {
			render(TagTestWrapper, { tagProps: { dismissible: true } });
			await expect.element(page.getByRole('button', { name: 'Tag 1 Dismiss' })).toBeInTheDocument();
		});

		it('uses a custom dismiss label', async () => {
			render(TagTestWrapper, { tagProps: { dismissible: true, dismissLabel: 'Remove' } });
			await expect.element(page.getByRole('button', { name: 'Tag 1 Remove' })).toBeInTheDocument();
		});

		it('hides the dismiss icon when the tag is named itself', async () => {
			render(TagTestWrapper, {
				tagProps: { dismissible: true, 'aria-label': 'Remove Tag 1' } as never
			});
			await expect.element(page.getByRole('button', { name: 'Remove Tag 1' })).toBeInTheDocument();
			await expect.element(page.selector('.fs-tag-dismiss-icon')).toHaveAttribute('aria-hidden', 'true');
		});

		it('dismisses on click, reporting the value', async () => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { dismissible: true, value: 'one', onDismiss } });
			await page.getByRole('button').click();
			expect(onDismiss).toHaveBeenCalledOnce();
			expect(onDismiss.mock.calls[0][1]).toBe('one');
		});

		it('falls back to a generated value', async () => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { dismissible: true, onDismiss } });
			await page.getByRole('button').click();
			expect(onDismiss.mock.calls[0][1]).toMatch(/^fs-tag-/);
		});

		it.each(['{Enter}', ' ', '{Delete}', '{Backspace}'])('dismisses with the %j key', async (key) => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { dismissible: true, onDismiss } });
			page.getByRole('button').element().focus();
			await userEvent.keyboard(key);
			expect(onDismiss).toHaveBeenCalledOnce();
		});

		it('does not remove itself', async () => {
			render(TagTestWrapper, { tagProps: { dismissible: true } });
			await page.getByRole('button').click();
			await expect.element(page.getByRole('button')).toBeInTheDocument();
		});

		it('blocks everything when disabled', async () => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { dismissible: true, disabled: true, onDismiss } });
			const button = page.getByRole('button');
			await expect.element(button).toBeDisabled();
			(button.element() as HTMLElement).click();
			page.getByRole('button').element().focus();
			await userEvent.keyboard('{Delete}');
			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('calls onkeydown', async () => {
			const onkeydown = vi.fn();
			render(TagTestWrapper, { tagProps: { dismissible: true, onkeydown } });
			page.getByRole('button').element().focus();
			await userEvent.keyboard('{Delete}');
			expect(onkeydown).toHaveBeenCalledOnce();
		});
	});

	describe('interactive tag', () => {
		it('renders a div holding a primary button', async () => {
			render(TagTestWrapper, { tagProps: { interactive: true } });
			expect(page.selector('.fs-tag').element().tagName).toBe('DIV');
			const primary = page.getByRole('button', { name: 'Tag 1' });
			await expect.element(primary).toBeInTheDocument();
			await expect.element(primary).toHaveClass('fs-tag-primary');
			expect(page.getByRole('button').elements()).toHaveLength(1);
		});

		it('routes onclick to the primary button and does not dismiss', async () => {
			const onclick = vi.fn();
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { interactive: true, dismissible: true, onclick, onDismiss } });
			await page.selector('.fs-tag-primary').click();
			expect(onclick).toHaveBeenCalledOnce();
			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('adds a separate dismiss button when dismissible', async () => {
			render(TagTestWrapper, { tagProps: { interactive: true, dismissible: true } });
			expect(page.getByRole('button').elements()).toHaveLength(2);
			await expect.element(page.getByRole('button', { name: 'Tag 1', exact: true })).toBeInTheDocument();
		});

		it('names the dismiss button after the primary one and its own label', async () => {
			render(TagTestWrapper, { tagProps: { interactive: true, dismissible: true, dismissLabel: 'Remove' } });
			await expect.element(page.getByRole('button', { name: 'Tag 1 Remove' })).toBeInTheDocument();
		});

		it('lets dismissProps give the dismiss button a name of its own', async () => {
			render(TagTestWrapper, {
				tagProps: {
					interactive: true,
					dismissible: true,
					dismissProps: { 'aria-label': 'Delete tag', 'aria-labelledby': undefined }
				}
			});
			await expect.element(page.getByRole('button', { name: 'Delete tag' })).toBeInTheDocument();
		});

		it('names the dismiss button after a custom primary id', async () => {
			render(TagTestWrapper, {
				tagProps: { interactive: true, dismissible: true, primaryProps: { id: 'custom-primary' } }
			});
			await expect.element(page.selector('.fs-tag-primary')).toHaveAttribute('id', 'custom-primary');
			expect(page.selector('.fs-tag-dismiss').element().getAttribute('aria-labelledby')).toContain('custom-primary');
		});

		it('forwards primaryProps to the primary button', async () => {
			render(TagTestWrapper, { tagProps: { interactive: true, primaryProps: { 'aria-haspopup': 'dialog' } } });
			await expect.element(page.selector('.fs-tag-primary')).toHaveAttribute('aria-haspopup', 'dialog');
		});

		it('dismisses from the dismiss button, reporting the value', async () => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { interactive: true, dismissible: true, value: 'one', onDismiss } });
			await page.selector('.fs-tag-dismiss').click();
			expect(onDismiss).toHaveBeenCalledOnce();
			expect(onDismiss.mock.calls[0][1]).toBe('one');
		});

		it.each(['{Delete}', '{Backspace}'])('dismisses with the %s key on the primary button', async (key) => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { interactive: true, dismissible: true, onDismiss } });
			page.selector('.fs-tag-primary').element().focus();
			await userEvent.keyboard(key);
			expect(onDismiss).toHaveBeenCalledOnce();
		});

		it('does not dismiss with Delete when it is not dismissible', async () => {
			const onDismiss = vi.fn();
			render(TagTestWrapper, { tagProps: { interactive: true, onDismiss } });
			page.selector('.fs-tag-primary').element().focus();
			await userEvent.keyboard('{Delete}');
			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('disables both buttons', async () => {
			const onclick = vi.fn();
			render(TagTestWrapper, { tagProps: { interactive: true, dismissible: true, disabled: true, onclick } });
			await expect.element(page.selector('.fs-tag-primary')).toBeDisabled();
			await expect.element(page.selector('.fs-tag-dismiss')).toBeDisabled();
			(page.selector('.fs-tag-primary').element() as HTMLElement).click();
			expect(onclick).not.toHaveBeenCalled();
		});

		it('paints a selected tag without claiming a pressed state outside a group', async () => {
			render(TagTestWrapper, { tagProps: { interactive: true, selected: true } });
			await expect.element(page.selector('.fs-tag')).toHaveClass('selected');
			await expect.element(page.selector('.fs-tag-primary')).not.toHaveAttribute('aria-pressed');
		});

		it('drops the opaque rim of a selected tag on hover, so the translucent fill is a single colour', async () => {
			render(TagTestWrapper, { tagProps: { interactive: true, selected: true } });
			const primary = page.selector('.fs-tag-primary');
			expect(getComputedStyle(primary.element()).borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
			await userEvent.hover(primary);
			await vi.waitFor(() => expect(getComputedStyle(primary.element()).borderTopColor).toBe('rgba(0, 0, 0, 0)'));
		});
	});
});
