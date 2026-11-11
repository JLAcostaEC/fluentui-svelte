/** Self-contained examples for the Showcase copy button. */
export const exampleCode = (markup: string, setup = '', components = 'PillButton', imports = '') =>
	`<script lang="ts">\n  import { ${components} } from 'fluentui-svelte';${imports ? '\n' + imports : ''}${setup ? '\n' + setup : ''}\n</script>\n\n${markup}`;

export const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: 12px;';
export const lead = 'padding-block-start: clamp(0px, calc((768px - 100vw) * 100), 1.5rem);';
export const column = `display: flex; flex-direction: column; align-items: flex-start; gap: 12px; ${lead}`;
