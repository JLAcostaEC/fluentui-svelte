<script lang="ts">
	import ComponentsFlyout from '$site/components/components-flyout/components-flyout.svelte';
	import { Button } from '$lib/index.js';
	import { setup, resize } from '$site/utils/shift.js';
	import { on } from 'svelte/events';
	import { m } from '$i18n/messages.js';
	import { mode } from 'mode-watcher';

	$effect(() => {
		let off: () => void;
		let destroy: () => void;
		if (!document.querySelector('.bg-effect canvas')) {
			destroy = setup();
			off = on(window, 'resize', resize);
		}

		return () => {
			off?.();
			destroy?.();
			const canvas = document.querySelector('.bg-effect canvas');
			if (canvas) {
				canvas.remove();
			}
		};
	});
</script>

<!-- shift background effect -->
<div class="bg-effect"></div>
<section id="banner">
	<picture>
		<source
			srcset="/images/banner-white.png"
			type="image/png"
			media={`${mode.current === 'dark' ? '' : '(prefers-color-scheme: dark)'}`}
			class="logo"
		/>

		<img src="/images/banner.png" alt="Logo" class="logo" />
	</picture>
	<h1 class="title">{m.home_title()}</h1>
	<p>
		{m.home_description()}
	</p>
	<div class="buttons">
		<Button as="a" href="/docs">{m.home_view_docs_button()}</Button>
		<Button
			as="a"
			href="https://github.com/JLAcostaEC/fluentui-svelte"
			target="_blank"
			rel="noreferrer"
			appearance="standard">{m.home_github_repo_button()}</Button
		>
	</div>
</section>
<section id="showcase">
	<ComponentsFlyout />
</section>

<style>
	#banner {
		flex: 1 1 50%;
		/* Without this the flyout's min-content width pushes the whole page wider. */
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		padding: 0 4rem 8rem 2rem;
		z-index: 1;
		& .logo {
			width: 100%;
			max-width: 400px;
			height: auto;
		}
		& .buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;
			& :global(.fs-button) {
				padding-inline: 1.5rem;
			}
		}
	}
	#showcase {
		flex: 1 1 50%;
		min-width: 0;
		padding-right: 2rem;
		display: flex;
		align-items: center;
		max-width: 700px;
		margin: 0 auto;
		flex-wrap: wrap;
		& :global(.components-flyout-wrapper){
			perspective: 700px;
		}
		& :global(.fs-flyout) {
			transform: rotateX(5deg) rotateY(-5.5deg) rotateZ(3deg);
		}
	}

	.bg-effect {
		position: fixed;
		top: -1000px;
		left: -1000px;
		width: 0;
		height: 0;
	}

	/* Tablet: the two halves stop fitting side by side, so stack them. */
	@media (max-width: 1024px) {
		#banner {
			flex-basis: 100%;
			align-items: center;
			text-align: center;
			padding: 2rem 2rem 1.5rem;
			& .logo {
				max-width: 340px;
			}
			& p {
				max-width: 52ch;
			}
			& .buttons {
				justify-content: center;
			}
		}
		#showcase {
			flex-basis: 100%;
			padding: 0 2rem 3rem;
			justify-content: center;
			/* The tilt only reads well next to the banner; flat once stacked. */
			perspective: none;
			& :global(.fs-flyout) {
				transform: none;
			}
		}
	}

	@media (max-width: 768px) {
		#banner {
			gap: 0.75rem;
			padding: 1.5rem 1rem 1rem;
			& .logo {
				max-width: 280px;
			}
			& .title {
				font-size: var(--fs-title2-font-size);
				line-height: var(--fs-title2-line-height);
			}
		}
		#showcase {
			padding: 2rem 1rem 2rem;
		}
	}

	@media (max-width: 480px) {
		#banner {
			& .title {
				font-size: var(--fs-subtitle-font-size);
				line-height: var(--fs-subtitle-line-height);
			}
			& .buttons :global(.fs-button) {
				flex: 1 1 auto;
			}
		}
	}
</style>
