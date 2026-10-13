import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { tick } from 'svelte';
import { DialogSurface, DialogTrigger, DialogTitle, DialogContent, DialogActions } from '$lib/index.js';
import DialogTestWrapper from './DialogTestWrapper.svelte';
import type { DialogPosition, DialogType } from '../types.js';

const positions: DialogPosition[] = [
	'top-start',
	'top-center',
	'top-end',
	'middle-start',
	'middle-center',
	'middle-end',
	'bottom-start',
	'bottom-center',
	'bottom-end'
];

function expectPosition(position: DialogPosition, rtl = false) {
	const rect = page.selector('dialog.fs-dialog').element().getBoundingClientRect();
	const [vertical, horizontal] = position.split('-');
	const gap = parseFloat(getComputedStyle(document.documentElement).fontSize);
	const width = document.documentElement.clientWidth;
	const height = document.documentElement.clientHeight;
	const top =
		vertical === 'top' ? gap : vertical === 'bottom' ? height - gap - rect.height : (height - rect.height) / 2;
	const atLeft = horizontal === (rtl ? 'end' : 'start');
	const left = horizontal === 'center' ? (width - rect.width) / 2 : atLeft ? gap : width - gap - rect.width;

	expect(rect.top).toBeCloseTo(top, 0);
	expect(rect.left).toBeCloseTo(left, 0);
}

describe('positioning', () => {
	describe.each<DialogType>(['modal', 'non-modal', 'alert'])('%s', (type) => {
		it.each(positions)('places the dialog at %s', async (position) => {
			render(DialogTestWrapper, { type, position });
			await page.getByRole('button', { name: 'Open Dialog' }).click();
			expect(page.selector('dialog.fs-dialog').element().matches(':modal')).toBe(type !== 'non-modal');
			expectPosition(position);
		});
	});

	it('centers the dialog by default', async () => {
		render(DialogTestWrapper, { type: 'non-modal', open: true });
		expectPosition('middle-center');
	});

	it.each<DialogPosition>(['top-start', 'bottom-end'])('respects RTL for %s', async (position) => {
		render(DialogTestWrapper, { type: 'non-modal', open: true, position, surfaceProps: { dir: 'rtl' } });
		expectPosition(position, true);
	});

	it('repositions an open modal without closing or replacing it', async () => {
		const onOpenChange = vi.fn();
		const screen = await render(DialogTestWrapper, { position: 'top-start', onOpenChange });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		const dialog = page.selector('dialog.fs-dialog').element();
		screen.component.setPosition('bottom-end');
		await tick();
		expect(page.selector('dialog.fs-dialog').element()).toBe(dialog);
		expect(dialog.matches(':modal')).toBe(true);
		expectPosition('bottom-end');
		screen.component.setPosition('middle-center');
		await tick();
		expectPosition('middle-center');
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it.each<DialogPosition>(['top-start', 'middle-center', 'bottom-end'])(
		'keeps %s inside a narrow viewport',
		async (position) => {
			const { innerWidth, innerHeight } = window;
			try {
				await page.viewport(280, 600);
				render(DialogTestWrapper, { type: 'non-modal', open: true, position });
				expectPosition(position);
				const rect = page.selector('dialog.fs-dialog').element().getBoundingClientRect();
				expect(rect.left).toBeGreaterThanOrEqual(16);
				expect(rect.right).toBeLessThanOrEqual(264);
			} finally {
				await page.viewport(innerWidth, innerHeight);
			}
		}
	);

	it('scrolls long content while keeping the dialog and its actions inside the viewport', async () => {
		const { innerWidth, innerHeight } = window;
		try {
			await page.viewport(600, 320);
			render(DialogTestWrapper, {
				type: 'non-modal',
				open: true,
				position: 'bottom-end',
				contentText: 'Dialog body content. '.repeat(1000)
			});
			expectPosition('bottom-end');
			const rect = page.selector('dialog.fs-dialog').element().getBoundingClientRect();
			const content = page.selector('.dialog-content').element();
			const actions = page.selector('.dialog-actions').element().getBoundingClientRect();
			expect(rect.top).toBeGreaterThanOrEqual(15.5);
			expect(rect.bottom).toBeLessThanOrEqual(304.5);
			expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
			expect(actions.bottom).toBeLessThanOrEqual(rect.bottom);
		} finally {
			await page.viewport(innerWidth, innerHeight);
		}
	});
});

describe('DialogTrigger', () => {
	it('renders a button with the default label', async () => {
		render(DialogTestWrapper);
		const el = page.getByRole('button', { name: 'Open Dialog' });
		await expect.element(el).toBeInTheDocument();
	});

	it('renders custom trigger content', async () => {
		render(DialogTestWrapper, { triggerText: 'Launch' });
		const el = page.getByRole('button', { name: 'Launch' });
		await expect.element(el).toBeInTheDocument();
	});

	it('throws when used outside a Dialog', async () => {
		await expect(render(DialogTrigger)).rejects.toThrow('DialogTrigger must be used within a Dialog component');
	});
});

describe('DialogSurface', () => {
	it('renders a dialog element with the fs-dialog class', async () => {
		render(DialogTestWrapper);
		const el = page.selector('dialog.fs-dialog');
		await expect.element(el).toBeInTheDocument();
	});

	it('throws when used outside a Dialog', async () => {
		await expect(render(DialogSurface)).rejects.toThrow('DialogSurface must be used within a Dialog component');
	});

	it('renders a close button for non-modal dialogs', async () => {
		render(DialogTestWrapper, { type: 'non-modal', open: true });
		const el = page.getByRole('button', { name: 'Close dialog' });
		await expect.element(el).toBeInTheDocument();
	});
});

describe('open/close behaviour', () => {
	it('calls onOpenChange with true when the trigger is clicked', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', onOpenChange });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('is closed by default (no open attribute)', async () => {
		render(DialogTestWrapper, { type: 'non-modal' });
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).not.toHaveAttribute('open');
	});

	it('reflects the open state via the open attribute', async () => {
		render(DialogTestWrapper, { type: 'non-modal', open: true });
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
	});

	it('closes a non-modal dialog when the close button is clicked', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', open: true, onOpenChange });
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
		await page.getByRole('button', { name: 'Close dialog' }).click();
		await expect.element(dialog).not.toHaveAttribute('open');
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
	});
});

describe('DialogTitle', () => {
	it('renders content inside an h3 by default', async () => {
		render(DialogTestWrapper);
		const el = page.selector('h3.dialog-title');
		await expect.element(el).toBeInTheDocument();
		await expect.element(el).toHaveTextContent('Dialog Title');
	});

	it('renders as the requested heading tag', async () => {
		render(DialogTestWrapper, { titleAs: 'h1' });
		const el = page.selector('h1.dialog-title');
		await expect.element(el).toBeInTheDocument();
	});

	it('can be rendered standalone', async () => {
		render(DialogTitle);
		const el = page.selector('.dialog-title');
		await expect.element(el).toBeInTheDocument();
	});

	it('throws when `as` is not a supported tag', async () => {
		await expect(render(DialogTitle, { as: 'span' as never })).rejects.toThrow('Invalid tag: span');
	});
});

describe('DialogContent', () => {
	it('renders body content in a dialog-content container', async () => {
		render(DialogTestWrapper);
		const el = page.selector('.dialog-content');
		await expect.element(el).toBeInTheDocument();
		await expect.element(el).toHaveTextContent('Dialog body content');
	});

	it('can be rendered standalone', async () => {
		render(DialogContent);
		const el = page.selector('.dialog-content');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('DialogActions', () => {
	it('applies justify-end by default', async () => {
		render(DialogTestWrapper);
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('justify-end');
	});

	it('applies justify-start when position="start"', async () => {
		render(DialogTestWrapper, { actionsPosition: 'start' });
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('justify-start');
	});

	it('applies justify-center when position="center"', async () => {
		render(DialogTestWrapper, { actionsPosition: 'center' });
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('justify-center');
	});

	it('applies the fluid class when fluid is set', async () => {
		render(DialogTestWrapper, { fluid: true });
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('fluid');
	});

	it('can be rendered standalone', async () => {
		render(DialogActions);
		const el = page.selector('.dialog-actions');
		await expect.element(el).toBeInTheDocument();
	});

	describe('fluid', () => {
		const widths = () =>
			['Confirm', 'Cancel and go back'].map(
				(name) => page.getByRole('button', { name, exact: true }).element().getBoundingClientRect().width
			);

		it('shares the width evenly between the actions', async () => {
			render(DialogTestWrapper, { type: 'non-modal', open: true, fluid: true });
			await vi.waitFor(() => {
				const [confirm, cancel] = widths();
				expect(Math.abs(confirm - cancel)).toBeLessThan(1);
			});
		});

		it('keeps the actions at their natural width without fluid', async () => {
			render(DialogTestWrapper, { type: 'non-modal', open: true });
			const [confirm, cancel] = widths();
			expect(Math.abs(confirm - cancel)).toBeGreaterThan(10);
		});
	});
});

describe('dismissal', () => {
	// Outlasts the 10ms debounce runed puts between an outside press and its callback.
	const settle = () => new Promise((resolve) => setTimeout(resolve, 60));
	const pressOutside = () => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));

	it('stays open after a fast click on the trigger', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { onOpenChange });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		await settle();
		await expect.element(page.selector('dialog.fs-dialog')).toHaveAttribute('open');
		expect(onOpenChange.mock.calls).toEqual([[true]]);
	});

	it('ignores presses outside while it is closed', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', onOpenChange });
		await settle();
		pressOutside();
		await settle();
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('closes a non-modal dialog with a press outside', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', open: true, onOpenChange });
		await settle();
		pressOutside();
		await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false));
		await expect.element(page.selector('dialog.fs-dialog')).not.toHaveAttribute('open');
	});

	it('closes a modal dialog with Escape and calls onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { onOpenChange });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog).not.toHaveAttribute('open');
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
	});

	it('keeps a modal dialog open when oncancel prevents the default', async () => {
		const onOpenChange = vi.fn();
		const oncancel = vi.fn((e: Event) => e.preventDefault());
		render(DialogTestWrapper, { onOpenChange, surfaceProps: { oncancel } });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
		await userEvent.keyboard('{Escape}');
		await vi.waitFor(() => expect(oncancel).toHaveBeenCalledOnce());
		await settle();
		await expect.element(dialog).toHaveAttribute('open');
		expect(onOpenChange.mock.calls).toEqual([[true]]);
	});

	it('does not close an alert dialog with Escape', async () => {
		const onOpenChange = vi.fn();
		const oncancel = vi.fn();
		render(DialogTestWrapper, { type: 'alert', onOpenChange, surfaceProps: { oncancel } });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
		await userEvent.keyboard('{Escape}');
		await vi.waitFor(() => expect(oncancel).toHaveBeenCalledOnce());
		await settle();
		await expect.element(dialog).toHaveAttribute('open');
		expect(onOpenChange.mock.calls).toEqual([[true]]);
	});
});

describe('attribute forwarding', () => {
	it('forwards attributes to DialogTrigger and merges its class', async () => {
		render(DialogTestWrapper, { triggerProps: { class: 'custom', 'data-part': 'trigger', appearance: 'standard' } });
		const el = page.getByRole('button', { name: 'Open Dialog' });
		await expect.element(el).toHaveClass('dialog-trigger');
		await expect.element(el).toHaveClass('custom');
		await expect.element(el).toHaveClass('standard');
		await expect.element(el).toHaveAttribute('data-part', 'trigger');
	});

	it('still opens the dialog when DialogTrigger has its own onclick', async () => {
		const onclick = vi.fn();
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', onOpenChange, triggerProps: { onclick } });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		expect(onclick).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('forwards attributes to DialogSurface and merges its class', async () => {
		render(DialogTestWrapper, { surfaceProps: { class: 'custom', 'data-part': 'surface' } });
		const el = page.selector('dialog.fs-dialog.custom');
		await expect.element(el).toHaveAttribute('data-part', 'surface');
	});

	it('forwards attributes to DialogTitle and merges its class', async () => {
		render(DialogTestWrapper, { titleAs: 'h2', titleProps: { class: 'custom', 'data-part': 'title' } });
		const el = page.selector('h2.dialog-title.custom');
		await expect.element(el).toHaveAttribute('data-part', 'title');
	});

	it('points the surface at a custom DialogTitle id', async () => {
		render(DialogTestWrapper, { titleProps: { id: 'my-title' } });
		await expect.element(page.selector('h3.dialog-title')).toHaveAttribute('id', 'my-title');
		await expect.element(page.selector('dialog.fs-dialog')).toHaveAttribute('aria-labelledby', 'my-title');
	});

	it('forwards attributes to DialogContent and merges its class', async () => {
		render(DialogTestWrapper, { contentProps: { class: 'custom', 'data-part': 'content' } });
		const el = page.selector('.dialog-content.custom');
		await expect.element(el).toHaveAttribute('data-part', 'content');
	});

	it('forwards attributes to DialogActions and merges its class', async () => {
		render(DialogTestWrapper, { actionsProps: { class: 'custom', 'data-part': 'actions' } });
		const el = page.selector('.dialog-actions.custom');
		await expect.element(el).toHaveClass('justify-end');
		await expect.element(el).toHaveAttribute('data-part', 'actions');
	});

	it('binds the ref of every part', async () => {
		const onRefs = vi.fn();
		render(DialogTestWrapper, { onRefs });
		await vi.waitFor(() => {
			const refs = onRefs.mock.lastCall?.[0];
			expect(refs?.trigger).toBeInstanceOf(HTMLButtonElement);
			expect(refs?.surface).toBeInstanceOf(HTMLDialogElement);
			expect(refs?.title?.classList.contains('dialog-title')).toBe(true);
			expect(refs?.content?.classList.contains('dialog-content')).toBe(true);
			expect(refs?.actions?.classList.contains('dialog-actions')).toBe(true);
		});
	});
});
