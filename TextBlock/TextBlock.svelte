<script>/** Determines which preset text style should be used. */
export let variant = "body";
/** Overrides the default HTML tag of the block's element with your own tag. */
export let tag = undefined;
/** Specifies a custom class name for the text block */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the text's element. */
export let element = null;
const map = {
    caption: {
        tag: "span",
        name: "caption"
    },
    body: {
        tag: "span",
        name: "body"
    },
    bodyStrong: {
        tag: "h5",
        name: "body-strong"
    },
    bodyLarge: {
        tag: "h5",
        name: "body-large"
    },
    subtitle: {
        tag: "h4",
        name: "subtitle"
    },
    title: {
        tag: "h3",
        name: "title"
    },
    titleLarge: {
        tag: "h2",
        name: "title-large"
    },
    display: {
        tag: "h1",
        name: "display"
    }
};
</script>

<svelte:element
    this={tag ? tag : map[variant].tag}
    class="text-block type-{map[variant].name} {className}"
    bind:this={element}
    {...$$restProps}
>
    <slot />
</svelte:element>

<style>.text-block{color:currentColor;display:inline-block;margin:0;padding:0}.text-block.type-display,.text-block.type-subtitle,.text-block.type-title,.text-block.type-title-large{font-family:var(--fds-font-family-display);font-weight:600}.text-block.type-body,.text-block.type-body-large,.text-block.type-body-strong{font-family:var(--fds-font-family-text)}.text-block.type-caption{font-family:var(--fds-font-family-small);font-size:var(--fds-caption-font-size);font-weight:400;line-height:16px}.text-block.type-body,.text-block.type-body-large,.text-block.type-body-strong{font-size:var(--fds-body-font-size);font-weight:400;line-height:20px}.text-block.type-body-strong{font-weight:600}.text-block.type-body-large{font-size:var(--fds-body-large-font-size);line-height:24px}.text-block.type-subtitle{font-size:var(--fds-subtitle-font-size);line-height:28px}.text-block.type-title{font-size:var(--fds-title-font-size);line-height:36px}.text-block.type-title-large{font-size:var(--fds-title-large-font-size);line-height:52px}.text-block.type-display{font-size:var(--fds-display-font-size);line-height:92px}</style>
