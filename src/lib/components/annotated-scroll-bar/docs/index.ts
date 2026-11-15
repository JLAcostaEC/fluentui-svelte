import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import { META } from './meta.ts';
import type { ConfigDocs } from '#types';

export const DATA: ConfigDocs = { meta: META, docs: Docs, examples: [Examples], footer: Footer };
