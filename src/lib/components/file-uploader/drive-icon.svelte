<script lang="ts">
	import type { FileUploaderDrive } from './types.ts';

	let { icon }: { icon: FileUploaderDrive['icon'] } = $props();
</script>

<!-- The brand mark of the drive, from the static icon set of upup. -->
<svg
	class="fs-file-uploader-drive-icon"
	viewBox={icon.viewBox}
	width="1em"
	height="1em"
	fill={icon.color ? 'currentColor' : 'none'}
	style:color={icon.color}
	aria-hidden="true"
	focusable="false"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html icon.inner}
</svg>
