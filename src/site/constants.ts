import PKG from '../../package.json' with { type: 'json' };

export const VERSION = PKG.version;
export const SITE_NAME = 'Fluent UI Svelte';
/** Production origin, for links that must stay absolute (documents read away from the site). */
export const SITE_URL = 'https://fluentui-svelte.dev';
// Remove the `git+` prefix and the `.git` suffix from the repository URL to get a clean GitHub URL.
export const GITHUB_REPO_URL = PKG.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
export const SPONSOR_URL = 'https://github.com/sponsors/JLAcostaEC';
export const ICONS_URL = 'https://fluentui-icons-svelte.pages.dev/';
export const INSTALL_COMMAND = 'pnpm add fluentui-svelte';
