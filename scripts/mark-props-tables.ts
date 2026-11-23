type HtmlNode = {
	tagName?: string;
	value?: string;
	properties?: { className?: string[] };
	children?: HtmlNode[];
};

export const markPropsTables = () => {
	function visit(node: HtmlNode) {
		if (node.tagName === 'table') {
			const head = node.children?.find((child) => child.tagName === 'thead');
			const row = head?.children?.find((child) => child.tagName === 'tr');
			const headings = row?.children?.filter((child) => child.tagName === 'th');
			if (headings?.map((cell) => cell.children?.[0]?.value).join('|') === 'Name|Type|Default|Description') {
				const properties = (node.properties ??= {});
				(properties.className ??= []).push('props-table');
			}
		}
		node.children?.forEach(visit);
	}
	return visit;
};
