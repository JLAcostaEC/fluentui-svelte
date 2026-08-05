<script lang="ts">
	import { on } from 'svelte/events';
	import { useDebounce } from 'runed';
	import { floating, roundByDPR, RenderSoC } from '$internal';
	import { Flyout } from '$lib/index.js';
	import { PREFIX } from '$constants';
	import { arrow, flip, hide, offset, shift, type ComputePositionReturn, type Side } from '@floating-ui/dom';
	import type { Attachment } from 'svelte/attachments';
	import type { TooltipProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'tooltip';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(),
		content = 'I am a tooltip',
		placement,
		target,
		positionConfig: _config,
		open = $bindable(false),
		withArrow = false,
		openDelay = 100,
		hideDelay = 300,
		preventClose = $bindable(false),
		onVisibleChange,
		animationFrame = false,
		relationship = 'label',
		class: classes,
		id = ID,
		children,
		...attributes
	}: TooltipProps = $props();

	let anchor: HTMLElement | null = $state(null);
	let explicitTrigger: HTMLElement | null = $state(null);
	let arrowElement: HTMLElement | null = $state(null);
	let hoveringTooltip = $state(false);

	const childrenProps = $derived({
		'aria-labelledby': relationship === 'label' ? id : undefined,
		'aria-describedby': relationship === 'description' ? id : undefined
	});

	const handleOpen = useDebounce(
		() => {
			open = true;
			onVisibleChange?.(true);
		},
		() => openDelay
	);

	const handleClose = useDebounce(
		() => {
			if (preventClose || hoveringTooltip) return;
			open = false;
			onVisibleChange?.(false);
		},
		() => hideDelay
	);

	const triggerRef: Attachment = (node) => {
		explicitTrigger = node as HTMLElement;
		return () => {
			explicitTrigger = null;
		};
	};

	let triggerElement = $derived(
		target ?? explicitTrigger ?? (anchor ? (anchor as HTMLElement).nextElementSibling : null)
	);

	let positionConfig = $derived({
		..._config,
		placement: placement ?? _config?.placement ?? 'top',
		strategy: 'fixed' as const,
		middleware: [
			...(_config?.middleware ?? [offset(8), flip(), shift({ padding: 8 }), hide()]),
			...(withArrow && arrowElement ? [arrow({ element: arrowElement })] : [])
		]
	});

	const arrowComputeCallback = (data: ComputePositionReturn) => {
		if (!arrowElement) return;

		const { x, y } = data.middlewareData.arrow || {};
		const { placement } = data;

		const side = placement.split('-')[0] as Side;

		// Invert the side of the arrow
		const staticSide = {
			top: 'bottom',
			right: 'left',
			bottom: 'top',
			left: 'right'
		}[side];

		if (staticSide && arrowElement.style) {
			Object.assign(arrowElement.style, {
				left: x != null ? `${roundByDPR(x)}px` : '',
				top: y != null ? `${roundByDPR(y)}px` : '',
				[staticSide]: `${-(arrowElement.offsetWidth / 2) + 1}px`,
				transform: 'rotate(45deg)'
			});
			arrowElement.style.setProperty(
				'--fs-tooltip-mask-angle',
				{
					top: '135deg',
					right: '-135deg',
					bottom: '-45deg',
					left: '45deg'
				}[side]
			);
		}
	};

	$effect(() => {
		if (!triggerElement) return;

		const cleanups = [
			on(triggerElement, 'mouseenter', () => handleOpen()),
			on(triggerElement, 'mouseleave', () => handleClose()),
			on(triggerElement, 'focusin', () => handleOpen()),
			on(triggerElement, 'focusout', () => handleClose())
		];

		return () => cleanups.forEach((c) => c());
	});

	$effect(() => {
		if (!ref || !open) return;

		const cleanups = [
			on(ref, 'mouseenter', () => {
				hoveringTooltip = true;
			}),
			on(ref, 'mouseleave', () => {
				hoveringTooltip = false;
				handleClose();
			})
		];

		return () => {
			hoveringTooltip = false;
			cleanups.forEach((c) => c());
		};
	});

	$effect(() => {
		if (!open) return;

		return on(document, 'keydown', (e) => {
			if (e.key === 'Escape') {
				open = false;
				onVisibleChange?.(false);
			}
		});
	});
</script>

<!-- @component
  This is a implementation of Fluent UI tooltip component. The tooltip is a small pop-up box that appears when a user hovers over an element. It provides additional information about the element being hovered over.
  
  - Usage:
    ```tsx
    <script>
      import { Tooltip } from 'fluentui-svelte';
    </script>

    <Tooltip>
      <Button>Hover me!</Button>
    </Tooltip>
    ``` 
-->
<Flyout
	{id}
	class={['fs-tooltip', !open && 'tooltip-hidden', classes]}
	role="tooltip"
	bind:ref
	{...attributes}
	{@attach triggerElement && open
		? floating(triggerElement, positionConfig, {
				onComputed: withArrow ? arrowComputeCallback : undefined,
				animationFrame
			})
		: undefined}
>
	{#if typeof content === 'string'}
		{content}
	{:else if typeof content === 'function'}
		<RenderSoC SoC={content} />
	{/if}
	{#if withArrow}
		<div class="fs-tooltip-arrow" aria-hidden="true" bind:this={arrowElement}></div>
	{/if}
</Flyout>

{#if !explicitTrigger && !target}
	<i hidden bind:this={anchor}></i>
{/if}

{@render children?.(childrenProps, triggerRef)}

<style>
	:global(.fs-tooltip) {
		position: fixed !important;
		top: 0;
		left: 0;
		z-index: 50;
		& .fs-tooltip-arrow {
			position: absolute;
			width: 16px;
			height: 16px;
			background: var(--fs-acrylic-background-default);
			border-radius: var(--fs-control-border-radius);
			border: 1px solid var(--fs-control-surface-stroke-flyout);
			transform: rotate(45deg);
			mask: linear-gradient(
				var(--fs-tooltip-mask-angle, -45deg),
				transparent 0%,
				transparent 50%,
				black 50%,
				black 100%
			);
			&::before {
				content: '';
				border-radius: calc(var(--fs-control-overlay-border-radius) - 0.063rem);
				width: 100%;
				height: 100%;
				position: absolute;
				inset: 0;
				background: var(--fs-acrilic-noise);
				background-size: 2.5rem;
				opacity: 0.1;
				filter: grayscale(1);
				z-index: 0;
				pointer-events: none;
			}
		}
		&.tooltip-hidden {
			visibility: hidden !important;
			pointer-events: none;
		}
	}
</style>
