<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$i18n/messages.js';
	import { localizeHref } from '$i18n/runtime.js';
	import type { Pathname } from '$app/types';
</script>

<section>
	<h1>{page.status} - <span>{page.error?.message}</span></h1>
	<p>
		{m.error_go_back_before_link()} <a href={resolve(localizeHref('/') as Pathname)}>{m.error_go_back_link_text()}</a>
	</p>
</section>

<style>
	section {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	h1 {
		font-size: var(--fs-display-font-size);
		line-height: var(--fs-display-line-height);
		font-weight: 700;
		& span {
			color: var(--fs-system-critical-text);
		}
	}
	a {
		color: blue;
		font-weight: 600;
	}
</style>
