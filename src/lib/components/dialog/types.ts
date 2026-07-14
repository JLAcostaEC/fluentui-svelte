import type { Snippet } from 'svelte';
import type { FSContext } from '$internal';
import type { HTMLAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button/types.ts';
import type { PolymorphicProps, XDirection } from '$types';

type DialogType = 'modal' | 'non-modal' | 'alert';
export type DialogTitleTag = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type DialogProps = {
	type?: DialogType;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: Snippet;
};

export type DialogSurfaceProps = {
	ref?: HTMLDialogElement;
} & HTMLAttributes<HTMLDialogElement>;

export type DialogTriggerProps = {
	ref?: HTMLButtonElement;
} & ButtonProps<'button'>;

export type DialogContentProps = {
	ref?: HTMLDivElement;
} & HTMLAttributes<HTMLDivElement>;

export type DialogActionsProps = {
	ref?: HTMLDivElement;
	fluid?: boolean;
	position?: XDirection;
} & HTMLAttributes<HTMLDivElement>;

type DialogTitleRefType = {
	div: HTMLDivElement;
	h1: HTMLHeadingElement;
	h2: HTMLHeadingElement;
	h3: HTMLHeadingElement;
	h4: HTMLHeadingElement;
	h5: HTMLHeadingElement;
	h6: HTMLHeadingElement;
};

export type DialogTitleProps<T extends DialogTitleTag> = {
	ref?: DialogTitleRefType[T];
	as?: T;
} & PolymorphicProps<T>;

export type DialogContext = FSContext<
	{
		type: DialogType;
	},
	{
		dialogRef: HTMLDialogElement;
		readonly open: boolean;
	},
	null,
	{
		openDialog: () => void;
		closeDialog: () => void;
	}
>;
