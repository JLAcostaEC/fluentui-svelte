export type TocLink = { id: string; text: string; active?: boolean; children?: TocLink[] };

export type TocProps = { selector: string; searchFor?: string; offset?: string };

export const getLinks = (wrapper: Element, search: string, scrollOffSet: string) => {
	const headings = Array.from(wrapper.querySelectorAll<HTMLElement>(`:scope > :is(${search})`));

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const stack: any[] = [];
	const result: TocLink[] = [];

	headings.forEach((heading) => {
		heading.style.scrollMarginTop = scrollOffSet;

		const level = parseInt(heading.tagName.replace('H', ''), 10);
		const node = { id: heading.id, text: heading.textContent?.trim() || '', children: [] };

		while (stack.length > 0 && stack[stack.length - 1].level >= level) {
			stack.pop();
		}

		if (stack.length === 0) {
			result.push(node);
		} else {
			stack[stack.length - 1].children.push(node);
		}

		stack.push({ ...node, level });
	});

	return { headings, result };
};
