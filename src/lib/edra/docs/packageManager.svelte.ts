import { getContext, setContext } from 'svelte';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export class PackageManagerState {
	value = $state<PackageManager>('npm');

	constructor() {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('edra-package-manager');
			if (stored === 'npm' || stored === 'pnpm' || stored === 'yarn' || stored === 'bun') {
				this.value = stored;
			}
		}
	}

	set(val: PackageManager) {
		this.value = val;
		if (typeof window !== 'undefined') {
			localStorage.setItem('edra-package-manager', val);
		}
	}
}

const CONTEXT_KEY = Symbol('package-manager');

export function initPackageManager() {
	return setContext(CONTEXT_KEY, new PackageManagerState());
}

export function getPackageManager(): PackageManagerState {
	return getContext(CONTEXT_KEY);
}
