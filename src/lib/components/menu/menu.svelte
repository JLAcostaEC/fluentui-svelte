<script lang="ts">
	import { getMenuContext, setMenuContext } from './menu.svelte.ts';
	import type { MenuContext, MenuProps } from './types.ts';

	let {
		checkedValues = {} as Record<string, string[]>,
		onCheckedValueChange,
		hasCheckmarks,
		hasIcons,
		openingDelay = 0,
		open,
		onOpenChange,
		openOnHover = false,
		persistOnItemActivation = false,
		positionConfig,
		children
	}: MenuProps = $props();

	const id = $props.id();

	// Check if is being used as submenu
	const PARENT_CONTEXT = getMenuContext();

	let ref: HTMLElement | null = $state(null);

	let locked = $state(false);

	const context: MenuContext = $state({
		// A submenu carries its own id, icons and checkmarks, and inherits the opening behaviour
		// and placement of the menu it hangs off.
		config: {
			get id() {
				return id;
			},
			get isSubMenu() {
				return !!PARENT_CONTEXT;
			},
			get hasCheckmarks() {
				return hasCheckmarks;
			},
			get hasIcons() {
				return hasIcons;
			},
			get parentHasCheckmarks() {
				return !!PARENT_CONTEXT?.config.hasCheckmarks;
			},
			get parentHasIcons() {
				return !!PARENT_CONTEXT?.config.hasIcons;
			},
			get openingDelay() {
				return PARENT_CONTEXT ? PARENT_CONTEXT.config.openingDelay : openingDelay;
			},
			get openOnHover() {
				return PARENT_CONTEXT ? PARENT_CONTEXT.config.openOnHover : openOnHover;
			},
			get persistOnItemActivation() {
				return PARENT_CONTEXT ? PARENT_CONTEXT.config.persistOnItemActivation : persistOnItemActivation;
			},
			get positionConfig() {
				return PARENT_CONTEXT ? PARENT_CONTEXT.config.positionConfig : positionConfig;
			}
		},
		state: {
			get open() {
				return open;
			},
			set open(v) {
				open = v;
			},
			get ref() {
				return ref;
			},
			set ref(v) {
				ref = v;
			},
			get locked() {
				return locked;
			},
			set locked(v) {
				locked = v;
			},
			get checkedValues() {
				return checkedValues;
			},
			set checkedValues(v) {
				checkedValues = v;
			}
		},
		// A submenu reports to the root menu, so its own callbacks are never the ones invoked.
		events: PARENT_CONTEXT?.events ?? {
			onCheckedValueChange: (e, value) => onCheckedValueChange?.(e, value),
			onOpenChange: (e, opened) => onOpenChange?.(e, opened)
		},
		methods: {
			toggle: (e: Event) => {
				const { state, events } = context;

				state.open = !state.open;
				events.onOpenChange?.(e, state.open);
			},
			open: (e: Event) => {
				const { state, events } = context;

				state.open = true;
				events.onOpenChange?.(e, state.open);
			},
			close: (e: Event) => {
				const { state, events } = context;

				state.open = false;
				events.onOpenChange?.(e, state.open);
			},
			toggleCheckbox: (e: Event, value: string, name: string) => {
				const { state, events } = context;

				const current = state.checkedValues?.[name] ?? [];
				const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
				state.checkedValues = { ...state.checkedValues, [name]: updated };
				events.onCheckedValueChange?.(e, state.checkedValues!);
			},
			toggleRadio: (e: Event, value: string, name: string) => {
				const { state, events, methods } = context;

				if (!state.checkedValues?.[name]?.includes(value)) {
					state.checkedValues = { ...state.checkedValues, [name]: [value] };
					methods.close?.(e);
					events.onCheckedValueChange?.(e, state.checkedValues!);
				}
			}
		}
	});

	setMenuContext(context);
</script>

{@render children?.()}
