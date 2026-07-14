/**
 * Creates a Shiki transformer that adds a copy button to code blocks
 * @returns {import('shiki').ShikiTransformer} A Shiki transformer object
 */
export function fsShikiCopyButton() {
	return {
		name: 'fs-shiki-copy-button',
		pre(node) {
			/** @type {any} */
			const button = {
				type: 'element',
				tagName: 'button',
				properties: {
					class: 'copy',
					'data-code': this.source,
					onclick: `navigator.clipboard.writeText(this.dataset.code);this.classList.add('copied');setTimeout(() => this.classList.remove('copied'), 2000)`
				},
				children: [
					{
						type: 'element',
						tagName: 'svg',
						properties: {
							class: 'idle',
							viewBox: '0 0 24 24',
							xmlns: 'http://www.w3.org/2000/svg',
							fill: 'currentColor'
						},
						children: [
							{
								type: 'element',
								tagName: 'path',
								properties: {
									d: 'M13.75 2a2.25 2.25 0 0 1 2.236 2.002V4L17.75 4A2.25 2.25 0 0 1 20 6.25v7.46a1.75 1.75 0 0 0-1.5-1.692V6.25a.75.75 0 0 0-.75-.75h-2.129c-.404.603-1.091 1-1.871 1h-3.5c-.78 0-1.467-.397-1.871-1H6.25a.75.75 0 0 0-.75.75v13.5c0 .414.336.75.75.75h5.38l.812.913c.343.386.818.584 1.297.587H6.25A2.25 2.25 0 0 1 4 19.75V6.25A2.25 2.25 0 0 1 6.25 4h1.764a2.25 2.25 0 0 1 2.236-2h3.5Zm2.245 2.096L16 4.25c0-.052-.002-.103-.005-.154ZM13.75 3.5h-3.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5Z',
									fill: 'currentColor'
								},
								children: []
							},
							{
								type: 'element',
								tagName: 'path',
								properties: {
									d: 'M19 13.75a.75.75 0 0 1-.03.212l-2.5 8.5a.75.75 0 1 1-1.44-.424l2.5-8.5a.75.75 0 0 1 1.47.212ZM11.19 18.498a.75.75 0 0 1 0-.996l2-2.25a.75.75 0 0 1 1.12.996L12.755 18l1.557 1.752a.75.75 0 0 1-1.122.996l-2-2.25ZM19.752 20.81a.75.75 0 0 1-.063-1.058L21.247 18l-1.558-1.752a.75.75 0 0 1 1.122-.996l2 2.25a.75.75 0 0 1 0 .996l-2 2.25a.75.75 0 0 1-1.06.063Z',
									fill: 'currentColor'
								},
								children: []
							}
						]
					},
					{
						type: 'element',
						tagName: 'svg',
						properties: {
							class: 'success',
							viewBox: '0 0 24 24',
							xmlns: 'http://www.w3.org/2000/svg',
							fill: 'currentColor'
						},
						children: [
							{
								type: 'element',
								tagName: 'path',
								properties: {
									d: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-1.25 9.94 4.47-4.47a.75.75 0 0 1 1.133.976l-.073.084-5 5a.75.75 0 0 1-.976.073l-.084-.073-2.5-2.5a.75.75 0 0 1 .976-1.133l.084.073 1.97 1.97 4.47-4.47-4.47 4.47Z',
									fill: 'currentColor'
								},
								children: []
							}
						]
					}
				]
			};

			node.children.push(button);
		}
	};
}
