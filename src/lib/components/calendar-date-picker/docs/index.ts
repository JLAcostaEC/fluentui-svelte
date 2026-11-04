import Docs from './docs.svx';
import Footer from './footer.svx';
import type { ConfigDocs } from '#types';
import { META } from './meta.ts';

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [],
	footer: Footer
};
