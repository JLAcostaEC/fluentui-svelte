<script lang="ts">
	import { getMenuContext, setMenuContext } from './menu.svelte.ts';
	import type { MenuContext, MenuProps, MenuState } from './types.ts';

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

	let config: MenuContext['config'] = $derived.by(() => {
		if (!PARENT_CONTEXT) {
			return {
				id,
				isSubMenu: false,
				hasCheckmarks,
				hasIcons,
				openingDelay,
				openOnHover,
				persistOnItemActivation,
				positionConfig,
				parentHasCheckmarks: false,
				parentHasIcons: false
			};
		} else {
			return {
				...PARENT_CONTEXT.config,
				isSubMenu: true,
				id,
				hasCheckmarks,
				hasIcons,
				parentHasCheckmarks: !!PARENT_CONTEXT.config.hasCheckmarks,
				parentHasIcons: !!PARENT_CONTEXT.config.hasIcons
			};
		}
	});

	const _state: MenuState = {
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
	};

	let events: MenuContext['events'] = $derived.by(() => {
		if (!PARENT_CONTEXT) {
			return {
				onCheckedValueChange: (e, value) => onCheckedValueChange?.(e, value),
				onOpenChange: (e, opened) => onOpenChange?.(e, opened)
			};
		} else {
			return PARENT_CONTEXT.events;
		}
	});

	let methods: MenuContext['methods'] = $derived({
		toggle: (e: Event) => {
			_state.open = !_state.open;
			events.onOpenChange?.(e, _state.open);
		},
		open: (e: Event) => {
			_state.open = true;
			events.onOpenChange?.(e, _state.open);
		},
		close: (e: Event) => {
			_state.open = false;
			events.onOpenChange?.(e, _state.open);
		},
		toggleCheckbox: (e: Event, value: string, name: string) => {
			const current = _state.checkedValues?.[name] ?? [];
			const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
			_state.checkedValues = { ..._state.checkedValues, [name]: updated };
			events.onCheckedValueChange?.(e, _state.checkedValues!);
		},
		toggleRadio: (e: Event, value: string, name: string) => {
			if (!_state.checkedValues?.[name]?.includes(value)) {
				_state.checkedValues = { ..._state.checkedValues, [name]: [value] };
				methods.close?.(e);
				events.onCheckedValueChange?.(e, _state.checkedValues!);
			}
		}
	});

	// svelte-ignore state_referenced_locally
	setMenuContext({ config, state: _state, events, methods });
</script>

{@render children?.()}
