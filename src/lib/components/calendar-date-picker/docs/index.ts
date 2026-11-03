import Docs from './docs.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs } from '#types';
import { META } from './meta.ts';

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [],
	footer: Footer,
	llms: LLMS
};
