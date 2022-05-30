<script>/** Determines a completion amount in percentage. If no value or an invalid value is provided, the bar will be indeterminate. */
export let value = undefined;
/** Determines the progress bar's visual state. */
// export let status: "running" | "paused" | "error" = "running";
/** Specifies a custom class name for the bar. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the bar's SVG element. */
export let element = null;
/** Obtains a bound DOM reference to the bar's background rail element. Only available if the bar has a determinate value. */
export let railElement = null;
/** Obtains a bound DOM reference to the bar's primary track element. */
export let trackElement = null;
/** Obtains a bound DOM reference to the bar's secondary track element. Only available if the bar is indeterminate. */
export let secondaryTrackElement = null;
</script>

<svg
	class="progress-bar {className}"
	role="progressbar"
	width="100%"
	height="3"
	aria-valuemin={value ? 0 : undefined}
	aria-valuemax={value ? 100 : undefined}
	aria-valuenow={value}
	class:indeterminate={!value}
	bind:this={element}
	{...$$restProps}
>
	{#if value}
		<rect
			bind:this={railElement}
			height="1"
			rx="0.5"
			y="1"
			width="100%"
			class="progress-bar-rail"
		/>
	{:else}
		<rect bind:this={secondaryTrackElement} height="3" ry="3" class="progress-bar-track" />
	{/if}
	<rect
		bind:this={trackElement}
		width={value ? `${value}%` : undefined}
		height="3"
		rx="1.5"
		class="progress-bar-track"
	/>
</svg>

<style>@-webkit-keyframes indeterminate-1{0%{opacity:1;transform:translateX(-100%)}75%{opacity:1;transform:translateX(300%)}75.01%{opacity:0}to{opacity:0;transform:translateX(300%)}}@keyframes indeterminate-1{0%{opacity:1;transform:translateX(-100%)}75%{opacity:1;transform:translateX(300%)}75.01%{opacity:0}to{opacity:0;transform:translateX(300%)}}@-webkit-keyframes indeterminate-2{0%{opacity:0;transform:translateX(-150%)}37.49%{opacity:0}37.5%{opacity:1;transform:translateX(-150%)}to{opacity:1;transform:translateX(166.66%)}}@keyframes indeterminate-2{0%{opacity:0;transform:translateX(-150%)}37.49%{opacity:0}37.5%{opacity:1;transform:translateX(-150%)}to{opacity:1;transform:translateX(166.66%)}}.progress-bar{align-items:center;display:flex;min-block-size:3px;width:100%}.progress-bar-track{fill:var(--fds-accent-default);height:3px;max-width:50%;transition:var(--fds-control-fast-duration) linear fill}.progress-bar-rail{fill:var(--fds-control-strong-stroke-default);height:1px;width:100%}.progress-bar.indeterminate .progress-bar-rail{display:none}.progress-bar.indeterminate .progress-bar-track{-webkit-animation-timing-function:cubic-bezier(.4,0,.6,1);animation-timing-function:cubic-bezier(.4,0,.6,1)}.progress-bar.indeterminate .progress-bar-track:first-of-type{-webkit-animation:indeterminate-1 2s infinite;animation:indeterminate-1 2s infinite;width:40%}.progress-bar.indeterminate .progress-bar-track:nth-of-type(2){-webkit-animation:indeterminate-2 2s infinite;animation:indeterminate-2 2s infinite;width:60%}</style>
