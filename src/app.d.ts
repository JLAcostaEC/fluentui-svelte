// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties
		}
		// interface PageData {}
		// interface PageState {}
		// interface Error {}
		// interface Locals {}
	}

	// Fix importing .svx and .md files in SvelteKit, maybe related to:
	// https://github.com/sveltejs/language-tools/issues/3080
	// I'm using this method instead of: <reference types="mdsvex/globals" />
	// https://github.com/pngwn/MDsveX/issues/669#issuecomment-3628598185
	// To use Svelte 5 "Component" type instead of "SvelteComponent" from mdsvex, which is deprecated in Svelte 5
	declare module '*.svx' {
		import type { Component } from 'svelte';
		const component: Component;
		export default component;
	}

	declare module '*.md' {
		import type { Component } from 'svelte';
		const component: Component;
		export default component;
	}
}

export {};
