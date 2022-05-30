<script>/** Specifies a custom class name for the divider. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the divider's element. */
export let element = null;
</script>

<hr class="menu-flyout-divider {className}" bind:this={element} {...$$restProps} />

<style>.menu-flyout-divider{-webkit-border-before:1px solid var(--fds-divider-stroke-default);block-size:1px;border:none;border-block-start:1px solid var(--fds-divider-stroke-default);inline-size:100%;margin-block:2px}</style>
