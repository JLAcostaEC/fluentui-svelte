import PKG from '../../package.json' with { type: 'json' };

export const VERSION = PKG.version;
// Remove the `git+` prefix and the `.git` suffix from the repository URL to get a clean GitHub URL.
export const GITHUB_REPO_URL = PKG.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
