#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { exit } from 'process';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, '../src/lib/shad-editor');

const [, , command] = process.argv;

// List of dependencies to install
const dependencies = [
	'@tiptap/core',
	'@tiptap/extension-color',
	'@tiptap/extension-highlight',
	'@tiptap/extension-link',
	'@tiptap/extension-subscript',
	'@tiptap/extension-superscript',
	'@tiptap/extension-task-item',
	'@tiptap/extension-task-list',
	'@tiptap/extension-text',
	'@tiptap/extension-text-align',
	'@tiptap/extension-text-style',
	'@tiptap/extension-typography',
	'@tiptap/extension-underline',
	'@tiptap/extension-bubble-menu',
	'@tiptap/extension-table',
	'@tiptap/extension-table-cell',
	'@tiptap/extension-table-header',
	'@tiptap/extension-table-row',
	'@tiptap/extension-image',
	'@tiptap/pm',
	'@tiptap/starter-kit',
	'mode-watcher',
	'lucide-svelte',
	'svelte-awesome-color-picker',
	'svelte-tiptap',
	'@tiptap/extension-code-block-lowlight',
	'lowlight'
];

// Detect the package manager based on lock files
function detectPackageManager() {
	if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
	if (fs.existsSync('yarn.lock')) return 'yarn';
	if (fs.existsSync('package-lock.json')) return 'npm';
	if (fs.existsSync('bun.lockb')) return 'bun';
	return 'npm'; // Default to npm if no lock file is found
}

// Install dependencies with the detected package manager
function installDependencies() {
	const packageManager = detectPackageManager();
	let installCommand;

	// Construct the install command based on the package manager
	switch (packageManager) {
		case 'pnpm':
			installCommand = `pnpm add ${dependencies.join(' ')} --save-dev`;
			break;
		case 'yarn':
			installCommand = `yarn add ${dependencies.join(' ')} --dev`;
			break;
		case 'bun':
			installCommand = `bun add ${dependencies.join(' ')} --dev`;
			break;
		default: // npm as fallback
			installCommand = `npm install ${dependencies.join(' ')} --save-dev`;
			break;
	}

	try {
		console.log(`Installing dependencies using ${packageManager}...`);
		execSync(installCommand, { stdio: 'inherit' });
		console.log('Dependencies installed successfully.');
	} catch (error) {
		console.error('Error installing dependencies:', error);
	}
}

async function init() {
	const targetPath = './src/lib/components/shad-editor';

	try {
		await fs.copy(sourcePath, targetPath);
		console.log(`Components copied to ${targetPath}`);
	} catch (error) {
		console.error('Error copying components:', error);
		exit(-1);
	}
	// Install dependencies
	installDependencies();
}

if (command === 'init') {
	init();
} else {
	console.log('Usage: shadeditor init');
}
