import { getAllContexts, getContext, hasContext, setContext } from 'svelte';

/**
 * Base context shape shared across all FluentUI Svelte components.
 * - `config`: readonly props passed by the consumer (never mutated internally)
 * - `state`: reactive internal state
 * - `events`: callbacks exposed to the parent
 * - `methods`: imperative API exposed to the parent
 */
export type FSContext<
	Config = Record<string, unknown> | null,
	State = Record<string, unknown> | null,
	Events = Record<string, (...args: unknown[]) => void> | null,
	Methods = Record<string, (...args: unknown[]) => void> | null
> = {
	readonly config: Config;
	state: State;
	events: Events;
	methods: Methods;
};

/** A function that receives and returns a state object, used to build state incrementally. */
export type StateDefiner<T extends object> = (base: T) => T;

/**
 * Composes multiple `StateDefiner` functions into a single state object.
 * Each definer receives the accumulated state and returns an updated version.
 */
export function defineState<T extends object>(definers: StateDefiner<T>[], base = {} as T): T {
	return definers.reduce((acc, definer) => definer(acc), { ...base });
}

/** Adds a reactive getter (and optional setter) for a property on an existing object. */
export function defineProperty<T extends object, R>(
	base: T,
	property: keyof T,
	get: () => R,
	set?: (value: R) => void
) {
	return Object.defineProperty(base, property, { get, set, enumerable: true });
}

export function createFSContext<T>(): [() => T | null, (context: T) => void] {
	const key = {};

	return [
		() => {
			if (!hasContext(key)) {
				return null;
			}

			return getContext(key);
		},
		(context: T) => setContext(key, context)
	];
}

/**
 * Retrieves the nearest FSContext from the component tree.
 *
 * This allows components to access context without needing to know the specific context name,
 * as long as it's the most recently created one. This is useful for nested components that need
 * to access their parent's context without explicitly passing it down or knowing its name.
 */
export function getFSContext<T>(name: string): T | undefined {
	const CTX = getAllContexts();

	if (!CTX || CTX.size === 0) {
		return undefined;
	}

	const [contextName, context] = Array.from(CTX.entries()).pop() ?? [];

	return contextName?.startsWith(name) ? (context as T) : undefined;
}
