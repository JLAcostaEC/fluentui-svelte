<script lang="ts">
	import { on } from 'svelte/events';
	import { flip, hide, offset, shift } from '@floating-ui/dom';
	import { floating } from '#internal';
	import { DEFAULT_OFFSET, PREFIX } from '#constants';
	import { Flyout } from '#lib/index.js';
	import { setTeachingTipContext } from './teaching-tip-context.svelte.ts';
	import type { TeachingTipContext, TeachingTipProps } from './types.ts';

	const _ID = $props.id();
	const FALLBACK_ID = `${PREFIX}-teaching-tip-${_ID}`;

	let {
		ref = $bindable(null),
		id = FALLBACK_ID,
		open = $bindable(false),
		onOpenChange,
		target,
		placement,
		positionConfig: _config,
		lightDismiss = false,
		class: classes,
		children,
		...attributes
	}: TeachingTipProps = $props();

	let titleId: string | undefined = $state();

	const close = () => {
		open = false;
		onOpenChange?.(false);
	};

	const context: TeachingTipContext = {
		config: {
			get id() {
				return id;
			}
		},
		state: {
			get open() {
				return open;
			},
			get titleId() {
				return titleId;
			},
			set titleId(value) {
				titleId = value;
			}
		},
		events: null,
		methods: { close }
	};

	setTeachingTipContext(context);

	let positionConfig = $derived({
		..._config,
		placement: placement ?? _config?.placement ?? 'top',
		strategy: 'fixed' as const,
		middleware: _config?.middleware ?? [offset(DEFAULT_OFFSET), flip(), shift({ padding: DEFAULT_OFFSET }), hide()]
	});

	$effect(() => {
		if (!open) return;

		return on(document, 'keydown', (e) => {
			if (e.key === 'Escape') close();
		});
	});

	$effect(() => {
		if (!open || !lightDismiss) return;

		return on(document, 'pointerdown', (e) => {
			const node = e.target as Node;
			if (ref?.contains(node) || target?.contains(node)) return;
			close();
		});
	});
</script>

<!--
	@component
	A teaching tip is a semi-persistent and content-rich flyout that provides contextual information, often used to inform, remind and teach users about new features.
	- Usage:
    ```tsx
    <script>
      import { TeachingTip, TeachingTipHeader } from 'fluentui-svelte';
      let open = $state(true);
    </script>

    <TeachingTip bind:open>
      <TeachingTipHeader title="Save automatically" />
      <p>Your changes are saved as you work.</p>
    </TeachingTip>
    ```
 -->
<Flyout
	{...attributes}
	{id}
	class={['fs-teaching-tip', target && 'targeted', classes]}
	role="dialog"
	aria-labelledby={attributes['aria-labelledby'] ?? titleId}
	hidden={!open}
	bind:ref
	{@attach target && open ? floating(target, positionConfig) : undefined}
>
	{@render children?.()}
</Flyout>

<style>
	/* The element is drawn by the Flyout; the type selector outweighs its own scoped styles. */
	:global(div.fs-flyout.fs-teaching-tip) {
		flex-direction: column;
		width: 20rem;
		max-width: 100%;
		padding: 0.75rem;
		overflow: hidden;
		gap: 0.25rem;
		&.targeted {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 110;
		}
	}
</style>
