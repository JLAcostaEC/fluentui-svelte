import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} directory
 * @returns {string[]}
 */
function getFolders(directory) {
	try {
		return fs.readdirSync(directory).filter((file) => fs.statSync(path.join(directory, file)).isDirectory());
	} catch (error) {
		console.error('Error reading directory:', error);
		return [];
	}
}
/**
 *
 * @param {string} directory
 * @param {string} filename
 * @returns {string|null}
 */
function getFile(directory, filename) {
	const filePath = path.join(directory, filename);
	if (fs.existsSync(filePath)) {
		return fs.readFileSync(filePath, 'utf-8');
	}
	return null;
}

const libPath = path.join('src/lib/components');
const sitePath = path.join('src/site/documentation');

const folders = getFolders(libPath);

/**
 * Generates the component index file for documentation.
 */
function generateComponentIndex() {
	const components = folders.map((folder) => {
		const svelteFile = path.join(libPath, folder, `${folder}.svelte`);
		const label = folder.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
		let config = {};
		if (fs.existsSync(svelteFile)) {
			const content = fs.readFileSync(svelteFile, 'utf-8');
			// Match a $config JSON object inside an HTML comment
			const match = content.match(/<!--\s*\$config:\s*(\{[\s\S]*?\})\s*-->/i);
			if (match) {
				try {
					config = JSON.parse(match[1]);
				} catch (error) {
					console.error(`Invalid $config JSON in ${svelteFile}:`, error);
				}
			}
		}
		return {
			label,
			url: `/docs/components/${folder}`,
			...config
		};
	});
	const output = `export default ${JSON.stringify(components, null, 2)};\n`;
	const outPath = path.join(sitePath, 'index.js');

	const currentFile = getFile(sitePath, 'index.js');

	if (currentFile) {
		if (currentFile === output) {
			console.info('No changes detected. Skipping file write.');
			return;
		}

		fs.unlinkSync(outPath);
	}

	fs.writeFileSync(outPath, output, 'utf-8');
}

generateComponentIndex();
