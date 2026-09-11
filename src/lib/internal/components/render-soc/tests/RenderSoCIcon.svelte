<script lang="ts">
	let { class: classes, width }: { class?: string; width?: string } = $props();
</script>

<i data-testid="component" class={classes} style:width>component</i>
