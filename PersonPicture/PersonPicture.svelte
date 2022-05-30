<script>/** The size of the picture in pixels. */
export let size = 72;
/** Source URL used for the picture. */
export let src = undefined;
/** Defines the alt text used if an `src` attribute is specified. Also used as fallback text if no `src` or slot text is provided. */
export let alt = undefined;
/** Specifies a custom class name for the inner picture. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the inner picture element. */
export let element = null;
/** Obtains a bound DOM reference to the outer picture container. */
export let containerElement = null;
let error = false;
$: if (src)
    error = false;
</script>

<div
	class="person-picture-container"
	style="--fds-person-picture-size: {size}px"
	bind:this={containerElement}
>
	{#if src && !error}
		<img
			bind:this={element}
			on:error={() => (error = true)}
			class="person-picture {className}"
			width={size}
			height={size}
			{src}
			{alt}
			{...$$restProps}
		/>
	{:else}
		<div bind:this={element} class="person-picture {className}" {...$$restProps}>
			<slot>
				{alt
					?.split(" ")
					.map(i => i.charAt(0))
					.join("")
					.toUpperCase() ?? ""}
			</slot>
		</div>
	{/if}
	{#if $$slots.badge}
		<span class="person-picture-badge">
			<slot name="badge" />
		</span>
	{/if}
</div>

<style>.person-picture{align-items:center;background-clip:padding-box;background-color:var(--fds-control-alt-fill-quarternary);block-size:100%;border:1px solid var(--fds-card-stroke-default);border-radius:50%;box-sizing:border-box;display:flex;flex:0 0 auto;font-family:var(--fds-font-family-display);font-size:calc(var(--fds-person-picture-size)*.41667);font-weight:600;inline-size:100%;justify-content:center;overflow:hidden;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.person-picture-container{block-size:var(--fds-person-picture-size);display:flex;inline-size:var(--fds-person-picture-size);position:relative}.person-picture-badge{align-items:flex-end;block-size:100%;display:flex;flex-direction:column;inline-size:100%;inset-block-start:0;inset-inline-start:0;position:absolute}</style>
