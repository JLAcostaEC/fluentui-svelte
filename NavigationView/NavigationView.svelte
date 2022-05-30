<script>import { createEventDispatcher } from "svelte";
export let variant = "default";
export let expanded = true;
export let menuButton = true;
export let backButton = true;
const dispatch = createEventDispatcher();
</script>

<main class="navigation-view variant-{variant}">
	<aside class="navigation-view-pane" class:expanded>
		<header class="navigation-view-pane-header">
			{#if backButton}
				<button on:click={() => dispatch("back")}>
					{"<-"}
				</button>
			{/if}
			{#if menuButton}
				<button on:click={() => (expanded = !expanded)}>
					{"-"}
				</button>
			{/if}

			<slot name="header" />
		</header>
		<slot name="items" />
		<footer class="navigation-view-pane-footer">
			<slot name="footer" />
		</footer>
	</aside>
	<article class="navigation-view-page">
		<slot />
	</article>
</main>

<style>.navigation-view{block-size:100%;display:flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;inline-size:100%;line-height:20px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.navigation-view.variant--default .navigation-view-pane{inline-size:48px}.navigation-view.variant--default .navigation-view-pane.expanded{inline-size:320px}.navigation-view-pane{block-size:100%;display:flex;flex:0 0 auto;flex-direction:column;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.navigation-view-pane-header{-webkit-padding-before:4px;display:block;flex:0 0 auto;padding-block-start:4px}.navigation-view-page{-webkit-border-after:none;-webkit-border-end:none;background-clip:padding-box;background-color:var(--fds-layer-background-default);border:1px solid var(--fds-card-stroke-default);border-block-end:none;border-inline-end:none;border-start-start-radius:var(--fds-overlay-corner-radius);display:flex;flex:1 1 auto;flex-direction:column;padding-block:44px;padding-inline:56px}</style>
