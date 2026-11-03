/**
 * Creates a Shiki transformer that makes the scrollable part of a code block focusable.
 *
 * The `<code>` is the element that scrolls (see `src/shiki.css`), but Shiki puts the `tabindex` on the `<pre>`,
 * and the arrow keys only scroll the element that has the focus. Use it with `tabindex: false` in `codeToHtml`
 * so the `<pre>` does not take a tab stop of its own.
 * @returns {import('shiki').ShikiTransformer} A Shiki transformer object
 */
export function fsShikiFocusableCode() {
	return {
		name: 'fs-shiki-focusable-code',
		code(node) {
			node.properties.tabindex = '0';
		}
	};
}
