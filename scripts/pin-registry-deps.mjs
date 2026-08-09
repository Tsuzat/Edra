#!/usr/bin/env node
/**
 * Stamps each bare package name in static/r/*.json with its version from
 * package.json, so the published registry manifest never installs "latest".
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const registryOutputDir = path.join(rootDir, 'static/r');

/**
 * Strips any version specifier from a dependency string.
 *
 * @param {string} dep e.g. "@tiptap/core" or "@tiptap/core@^3.29.2"
 * @returns {string} e.g. "@tiptap/core"
 */
function parseName(dep) {
	const at = dep.indexOf('@', 1);
	return at === -1 ? dep : dep.slice(0, at);
}

/**
 * Reads package.json's version pins and rewrites every registry manifest in
 * static/r/ so each dependency name is suffixed with its matching version.
 *
 * @returns {Promise<void>}
 */
async function main() {
	// store all version pins from depend arrays in package.json in Map: { "katex": "^0.17.0", ...}
	const pkg = JSON.parse(await readFile(path.join(rootDir, 'package.json'), 'utf8'));
	const versions = new Map(
		Object.entries({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies })
	);

	const files = (await readdir(registryOutputDir)).filter((f) => f.endsWith('.json'));

	let updated = 0;

	// loop over all registry files (static/r/index.json static/r/edra.json)
	for (const file of files) {
		const filePath = path.join(registryOutputDir, file);
		const raw = await readFile(filePath, 'utf8');
		const json = JSON.parse(raw);
		const entries = Array.isArray(json) ? json : [json];

		let changed = false;

		// iterate over all key/values in the json file
		for (const entry of entries) {
			// check if key is 'dependencies' or 'devDependencies'
			for (const dependType of ['dependencies', 'devDependencies']) {
				if (!Array.isArray(entry[dependType])) {
					continue;
				}
				// append version numbers to all dependencies in array
				entry[dependType] = entry[dependType].map((dep) => {
					const name = parseName(dep);
					const version = versions.get(name);
					if (!version) {
						const dependType = dependType === 'dependencies' ? 'dependency' : 'dev dependency';
						throw new Error(
							`registry.json declares "${name}" as a ${dependType} of "${entry.name}", but it isn't in ` +
								`package.json's dependencies/devDependencies/peerDependencies. Add it there so its ` +
								`version can be resolved, or remove it from registry.json.`
						);
					}
					changed = true;
					return `${name}@${version}`;
				});
			}
		}

		if (changed) {
			// match shadcn-svelte's own build output format exactly (tab-indented, no trailing newline)
			await writeFile(filePath, JSON.stringify(json, null, '\t'), 'utf8');
			updated++;
		}
	}

	console.log(`Pinned registry dependency versions from package.json in ${updated} file(s).`);
}

main().catch((err) => {
	console.error(err.message);
	process.exit(1);
});
