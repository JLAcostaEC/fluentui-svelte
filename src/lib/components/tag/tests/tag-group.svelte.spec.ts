import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TagGroupTestWrapper from './TagGroupTestWrapper.svelte';
import TagGroupDismissTestWrapper from './TagGroupDismissTestWrapper.svelte';

describe('TagGroup', () => {
	it('is a toolbar by default', async () => {
		render(TagGroupTestWrapper);
		await expect.element(page.getByRole('toolbar', { name: 'Tags' })).toBeInTheDocument();
	});

	it('takes a custom role', async () => {
		render(TagGroupTestWrapper, {
			groupProps: { role: 'list' },
			items: [{ value: 'one', text: 'Tag 1', props: { role: 'listitem' } }]
		});
		await expect.element(page.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
		await expect.element(page.getByRole('listitem')).toHaveTextContent('Tag 1');
	});

	describe('context', () => {
		it('gives its size and appearance to the tags', async () => {
			render(TagGroupTestWrapper, { groupProps: { size: 'small', appearance: 'outline' } });
			const tags = page.selector('.fs-tag').elements();
			expect(tags).toHaveLength(3);
			for (const tag of tags) {
				expect(tag.classList.contains('small')).toBe(true);
				expect(tag.classList.contains('outline')).toBe(true);
			}
		});

		it('lets a tag set its own size and appearance', async () => {
			render(TagGroupTestWrapper, {
				groupProps: { size: 'small', appearance: 'outline' },
				items: [{ value: 'one', text: 'Tag 1', props: { size: 'extra-small', appearance: 'brand' } }]
			});
			const tag = page.selector('.fs-tag');
			await expect.element(tag).toHaveClass('extra-small');
			await expect.element(tag).toHaveClass('brand');
		});

		it('disables every tag', async () => {
			render(TagGroupTestWrapper, {
				groupProps: { disabled: true },
				items: [
					{ value: 'one', text: 'Tag 1', props: { dismissible: true } },
					{ value: 'two', text: 'Tag 2', props: { interactive: true } }
				]
			});
			await expect.element(page.getByRole('button', { name: 'Tag 1 Dismiss' })).toBeDisabled();
			await expect.element(page.getByRole('button', { name: 'Tag 2' })).toBeDisabled();
		});

		it('makes its tags dismissible', async () => {
			render(TagGroupTestWrapper, { groupProps: { dismissible: true } });
			expect(page.getByRole('button').elements()).toHaveLength(3);
		});

		it('lets a tag opt out of dismissible', async () => {
			render(TagGroupTestWrapper, {
				groupProps: { dismissible: true },
				items: [
					{ value: 'one', text: 'Tag 1' },
					{ value: 'two', text: 'Tag 2', props: { dismissible: false } }
				]
			});
			expect(page.getByRole('button').elements()).toHaveLength(1);
		});
	});

	describe('dismiss', () => {
		it('reports the value of the dismissed tag, and leaves the tag and focus in place', async () => {
			const onDismiss = vi.fn();
			render(TagGroupTestWrapper, { groupProps: { dismissible: true, onDismiss } });
			await page.getByRole('button', { name: 'Tag 2 Dismiss' }).click();
			expect(onDismiss).toHaveBeenCalledOnce();
			expect(onDismiss.mock.calls[0][1]).toEqual({ value: 'two' });
			expect(page.getByRole('button').elements()).toHaveLength(3);
			await expect.element(page.getByRole('button', { name: 'Tag 2 Dismiss' })).toHaveFocus();
		});

		it('reports the value of an interactive tag dismissed with Delete', async () => {
			const onDismiss = vi.fn();
			render(TagGroupTestWrapper, {
				groupProps: { dismissible: true, onDismiss },
				items: [{ value: 'one', text: 'Tag 1', props: { interactive: true } }]
			});
			page.getByRole('button', { name: 'Tag 1', exact: true }).element().focus();
			await userEvent.keyboard('{Delete}');
			expect(onDismiss.mock.calls[0][1]).toEqual({ value: 'one' });
		});

		it('keeps the keyboard in the group when the dismissed tag is removed', async () => {
			render(TagGroupDismissTestWrapper);
			page.getByRole('button', { name: 'two', exact: true }).element().focus();
			await userEvent.keyboard('{Delete}');
			await expect.element(page.getByRole('button', { name: 'two', exact: true })).not.toBeInTheDocument();
			await expect.element(page.getByRole('button', { name: 'three', exact: true })).toHaveFocus();
			await userEvent.keyboard('{ArrowLeft}');
			await expect.element(page.getByRole('button', { name: 'one Dismiss' })).toHaveFocus();
			await userEvent.keyboard('{ArrowLeft}');
			await expect.element(page.getByRole('button', { name: 'one', exact: true })).toHaveFocus();
		});

		it('focuses the previous tag when the last one is dismissed, and skips disabled tags', async () => {
			render(TagGroupDismissTestWrapper, { disabled: ['three'] });
			await page.getByRole('button', { name: 'four Dismiss' }).click();
			await expect.element(page.getByRole('button', { name: 'four', exact: true })).not.toBeInTheDocument();
			await expect.element(page.getByRole('button', { name: 'two', exact: true })).toHaveFocus();
		});

		it('leaves one tab stop in the group after a dismissal', async () => {
			render(TagGroupDismissTestWrapper);
			await page.getByRole('button', { name: 'one Dismiss' }).click();
			await expect.element(page.getByRole('button', { name: 'one', exact: true })).not.toBeInTheDocument();
			page.getByRole('button', { name: 'After' }).element().focus();
			await userEvent.tab({ shift: true });
			await expect.element(page.getByRole('button', { name: 'two', exact: true })).toHaveFocus();
		});

		it('calls the tag handler too', async () => {
			const onDismiss = vi.fn();
			const onTagDismiss = vi.fn();
			render(TagGroupTestWrapper, {
				groupProps: { onDismiss },
				items: [{ value: 'one', text: 'Tag 1', props: { dismissible: true, onDismiss: onTagDismiss } }]
			});
			await page.getByRole('button').click();
			expect(onTagDismiss).toHaveBeenCalledOnce();
			expect(onDismiss).toHaveBeenCalledOnce();
		});
	});

	describe('selection', () => {
		const interactive = { interactive: true };
		const items = [
			{ value: 'one', text: 'Tag 1', props: interactive },
			{ value: 'two', text: 'Tag 2', props: interactive },
			{ value: 'three', text: 'Tag 3', props: interactive }
		];

		it('toggles the value of an interactive tag in selectedValues', async () => {
			render(TagGroupTestWrapper, { items });
			const one = page.getByRole('button', { name: 'Tag 1' });
			await one.click();
			await expect.element(page.getByTestId('selected')).toHaveTextContent('one');
			await expect.element(one).toHaveAttribute('aria-pressed', 'true');
			await page.getByRole('button', { name: 'Tag 3' }).click();
			await expect.element(page.getByTestId('selected')).toHaveTextContent('one,three');
			await one.click();
			await expect.element(page.getByTestId('selected')).toHaveTextContent('three');
			await expect.element(one).toHaveAttribute('aria-pressed', 'false');
		});

		it('derives the selected state of a tag from the group', async () => {
			render(TagGroupTestWrapper, { items, selectedValues: ['two'] });
			const selected = page.selector('.fs-tag.selected');
			await expect.element(selected).toHaveTextContent('Tag 2');
			expect(selected.elements()).toHaveLength(1);
		});

		it('reports the toggle through onTagSelect', async () => {
			const onTagSelect = vi.fn();
			render(TagGroupTestWrapper, { items, groupProps: { onTagSelect } });
			const one = page.getByRole('button', { name: 'Tag 1' });
			await one.click();
			await one.click();
			expect(onTagSelect.mock.calls[0][1]).toEqual({ value: 'one', selected: true });
			expect(onTagSelect.mock.calls[1][1]).toEqual({ value: 'one', selected: false });
		});

		it('selects with Enter and Space', async () => {
			render(TagGroupTestWrapper, { items });
			page.getByRole('button', { name: 'Tag 2' }).element().focus();
			await userEvent.keyboard('{Enter}');
			await expect.element(page.getByTestId('selected')).toHaveTextContent('two');
			await userEvent.keyboard(' ');
			await expect.element(page.getByTestId('selected')).toHaveTextContent('');
		});

		it('does not select a plain tag', async () => {
			render(TagGroupTestWrapper, {
				items: [{ value: 'one', text: 'Tag 1', props: { dismissible: true } }]
			});
			await page.getByRole('button').click();
			await expect.element(page.getByTestId('selected')).toHaveTextContent('');
		});

		it('does not select a disabled tag', async () => {
			const onTagSelect = vi.fn();
			render(TagGroupTestWrapper, { items, groupProps: { disabled: true, onTagSelect } });
			(page.getByRole('button', { name: 'Tag 1' }).element() as HTMLElement).click();
			expect(onTagSelect).not.toHaveBeenCalled();
		});
	});

	describe('keyboard', () => {
		const interactiveItems = [
			{ value: 'one', text: 'Tag 1', props: { interactive: true } },
			{ value: 'two', text: 'Tag 2', props: { interactive: true } },
			{ value: 'three', text: 'Tag 3', props: { interactive: true } }
		];

		it('is a single tab stop', async () => {
			render(TagGroupTestWrapper, { items: interactiveItems });
			await expect.element(page.getByRole('button', { name: 'Tag 1' })).toBeInTheDocument();
			const tabbable = page
				.getByRole('button')
				.elements()
				.filter((el) => el.tabIndex === 0);
			expect(tabbable).toHaveLength(1);
		});

		it('moves focus between the tags with the arrow keys', async () => {
			render(TagGroupTestWrapper, { items: interactiveItems });
			page.getByRole('button', { name: 'Tag 1' }).element().focus();
			await userEvent.keyboard('{ArrowRight}');
			await expect.element(page.getByRole('button', { name: 'Tag 2' })).toHaveFocus();
			await userEvent.keyboard('{ArrowRight}');
			await expect.element(page.getByRole('button', { name: 'Tag 3' })).toHaveFocus();
			await userEvent.keyboard('{ArrowLeft}');
			await expect.element(page.getByRole('button', { name: 'Tag 2' })).toHaveFocus();
		});

		it('moves between the rows of a wrapped group with the up and down arrows', async () => {
			render(TagGroupTestWrapper, {
				groupProps: { style: 'width: 200px' },
				items: [
					{ value: 'one', text: 'Tag 1', props: { interactive: true } },
					{ value: 'two', text: 'Tag 2', props: { interactive: true } },
					{ value: 'three', text: 'Tag 3', props: { interactive: true } },
					{ value: 'four', text: 'Tag 4', props: { interactive: true } }
				]
			});
			const tops = new Set(
				page
					.selector('.fs-tag')
					.elements()
					.map((el) => el.getBoundingClientRect().top)
			);
			expect(tops.size).toBeGreaterThan(1);
			const one = page.getByRole('button', { name: 'Tag 1' });
			one.element().focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(document.activeElement!.getBoundingClientRect().top).toBeGreaterThan(
				one.element().getBoundingClientRect().top
			);
			await userEvent.keyboard('{ArrowUp}');
			await expect.element(one).toHaveFocus();
		});

		it('walks into the dismiss button of an interactive tag', async () => {
			render(TagGroupTestWrapper, {
				groupProps: { dismissible: true },
				items: interactiveItems.slice(0, 2)
			});
			page.getByRole('button', { name: 'Tag 1', exact: true }).element().focus();
			await userEvent.keyboard('{ArrowRight}');
			await expect.element(page.getByRole('button', { name: 'Tag 1 Dismiss' })).toHaveFocus();
			await userEvent.keyboard('{ArrowRight}');
			await expect.element(page.getByRole('button', { name: 'Tag 2', exact: true })).toHaveFocus();
		});
	});
});
