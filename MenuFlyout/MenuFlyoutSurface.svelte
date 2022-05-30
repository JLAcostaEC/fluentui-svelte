<script>/** Specifies a custom class name for the surface. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the surface element. */
export let element = null;
let animationComplete = false;
</script>

<div
	class="menu-flyout-surface-container"
	style={animationComplete ? "overflow: visible;" : undefined}
>
	<ul
		on:animationend|once={() => (animationComplete = true)}
		class="menu-flyout {className}"
		bind:this={element}
		{...$$restProps}
	>
		<slot />
	</ul>
</div>

<style>@-webkit-keyframes menu-open{0%{transform:translateY(var(--fds-menu-flyout-transition-offset,-50%))}to{transform:none}}@keyframes menu-open{0%{transform:translateY(var(--fds-menu-flyout-transition-offset,-50%))}to{transform:none}}@-webkit-keyframes menu-shadow{0%{box-shadow:none}to{box-shadow:var(--fds-flyout-shadow)}}@keyframes menu-shadow{0%{box-shadow:none}to{box-shadow:var(--fds-flyout-shadow)}}.menu-flyout{-webkit-animation:menu-open var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing),menu-shadow var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) var(--fds-control-normal-duration) forwards;animation:menu-open var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing),menu-shadow var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) var(--fds-control-normal-duration) forwards;background-clip:padding-box;background-color:var(--fds-solid-background-quarternary);border:1px solid var(--fds-surface-stroke-flyout);border-radius:var(--fds-overlay-corner-radius);box-sizing:border-box;color:var(--fds-text-primary);display:flex;flex-direction:column;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;margin:0;max-block-size:100vh;max-inline-size:100%;min-inline-size:120px;padding:0;padding-block:2px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.menu-flyout-surface-container{overflow:hidden}</style>
