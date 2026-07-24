import type { AriaAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { Component } from 'svelte';

export type NoUndefinedField<T> = {
	[P in keyof T]-?: P extends Record<P, infer V> ? NoUndefinedField<NonNullable<V>> : NonNullable<T[P]>;
};

/** Omits all keys from `T` whose name starts with the prefix `K`. */
export type OmitByWord<T, K extends string> = {
	[P in keyof T as P extends `${K}${string}` ? never : P]: T[P];
};

/** Picks only the keys from `T` whose name starts with the prefix `K`. */
export type PickByWord<T, K extends string> = {
	[P in keyof T as P extends `${K}${string}` ? P : never]: T[P];
};

export type Sizes = 'small' | 'medium' | 'large';
export type Shapes = 'circular' | 'rounded' | 'square';
export type Appearances = 'accent' | 'standard' | 'subtle';
export type Variants = 'filled' | 'outline' | 'ghost' | 'tint';
export type Colors = 'information' | 'attention' | 'warning' | 'success' | 'critical';
export type BeforeOrAfter = 'before' | 'after';
export type ActiveOrInactive = 'active' | 'inactive';
export type Statuses =
	'available' | 'busy' | 'offline' | 'away' | 'do-not-disturb' | 'out-of-office' | 'unknown' | 'blocked';
export type ProgressStatus = 'paused' | 'error';
export type YAxis = 'top' | 'bottom';
export type XAxis = 'left' | 'right';
export type YDirection = 'up' | 'middle' | 'down';
export type XDirection = 'start' | 'center' | 'end';
export type EASING = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/** Props for a polymorphic component that can render different HTML elements.
 * This remove "on:" and "aria" attributes due to "Expression produces a union type that is too complex to represent." error when using SvelteHTMLElements type.
 * Then we add the AriaAttributes back and we no longer have the error
 * @see https://github.com/sveltejs/svelte/issues/16046
 * @see https://github.com/sveltejs/svelte/issues/16839
 */
export type PolymorphicProps<T extends keyof SvelteHTMLElements> = OmitByWord<SvelteHTMLElements[T], 'on:' | 'aria'> &
	AriaAttributes;

/** Library maturity/status shown as a badge in the navigation. Not part of SEO/GEO. */
export type ComponentStatus = 'New' | 'Beta' | 'WIP' | 'AI' | 'Experimental' | 'Prototype' | 'Empty';

/** Open Graph metadata (https://ogp.me). Used to build `<meta property="og:*">` tags. */
export type OpenGraphMeta = {
	/** Overrides `Meta.title` for social shares. */
	title?: string;
	/** Overrides `Meta.description` for social shares. */
	description?: string;
	/** Open Graph object type, e.g. `website` or `article`. */
	type?: 'website' | 'article' | (string & {});
	/** Canonical URL of the page as shared. */
	url?: string;
	/** Absolute URL of the preview image. */
	image?: string;
	/** Alternative text describing `image`. */
	imageAlt?: string;
	/** Name of the overall site. */
	siteName?: string;
};

/** Twitter/X card metadata. Used to build `<meta name="twitter:*">` tags. */
export type TwitterMeta = {
	card?: 'summary' | 'summary_large_image' | 'app' | 'player';
	/** Overrides `Meta.title` for the card. */
	title?: string;
	/** Overrides `Meta.description` for the card. */
	description?: string;
	/** Absolute URL of the card image. */
	image?: string;
	/** Alternative text describing `image`. */
	imageAlt?: string;
	/** `@handle` of the website. */
	site?: string;
	/** `@handle` of the content author. */
	creator?: string;
};

/** A single question/answer pair used for GEO grounding and FAQ structured data. */
export type FaqEntry = { question: string; answer: string };

/** Search Engine Optimization metadata. */
export type SeoMeta = {
	/** Page title. Used for `<title>` and as the default OG/Twitter title. */
	title: string;
	/** Meta description. Used as the default OG/Twitter description. */
	description: string;
	/** Keywords describing the page. */
	keywords: string[];
	/** Absolute canonical URL of the page. */
	canonical?: string;
	/** Robots directive, e.g. `index, follow`. */
	robots?: string;
	/** Content locale, e.g. `en_US`. Used for `<meta property="og:locale">` and JSON-LD `inLanguage`. */
	locale?: string;
	openGraph?: OpenGraphMeta;
	twitter?: TwitterMeta;
};

/** Generative Engine Optimization metadata: helps AI answer engines and LLMs ground on this page. */
export type GeoMeta = {
	/** Concise, self-contained summary optimized for AI answer engines. */
	summary?: string;
	/** Semantic topics the page covers. */
	topics?: string[];
	/** Named entities relevant to the content (APIs, concepts, related components). */
	entities?: string[];
	/** Category / group the component belongs to (e.g. `Inputs`, `Data Display`). */
	category?: string;
	/** Frequently asked questions, reused for FAQ structured data and AI grounding. */
	faq?: FaqEntry[];
	/** Content author. */
	author?: { name: string; url?: string };
	/** ISO date the page was first published. */
	datePublished?: string;
	/** ISO date the page was last modified. */
	dateModified?: string;
	/** Raw JSON-LD structured data block(s) to embed verbatim. */
	jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Metadata for a documentation page.
 * Combines SEO + GEO fields with a couple of library-specific fields.
 * `status` and `icon` are exclusive to this library (navigation badge + icon) and are unrelated to SEO/GEO.
 */
export type Meta = SeoMeta & { geo?: GeoMeta } & {
	/** URL slug for the component page (`/docs/components/{slug}`). */
	slug: string;
	/** Library maturity/status badge. Not part of SEO/GEO. */
	status: ComponentStatus | (string & {});
	/** Navigation icon. Not part of SEO/GEO. */
	icon?: Component;
};

/** Documentation structure for a component configuration page. */
export type ConfigDocs = {
	meta: Meta;
	/** Intro of the page: title, description and basic usage. */
	docs: Component;
	/** Usage examples covering the most important props. */
	examples: Component[];
	/** End of the page. The first element must be the component props table; extra info may follow. */
	footer: Component;
	/** Raw Markdown context for AI agents (union of docs/examples/footer, i18n resolved to English, no Svelte). */
	llms: string;
};
