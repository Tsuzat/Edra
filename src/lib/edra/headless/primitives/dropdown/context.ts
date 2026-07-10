import { setContext, getContext } from 'svelte';

export interface DropdownContext {
	open: boolean;
	triggerEl: HTMLElement | null;
	contentEl: HTMLElement | null;
	close: () => void;
	toggle: () => void;
	setTrigger: (el: HTMLElement | null) => void;
	setContent: (el: HTMLElement | null) => void;
}

export function setDropdown(ctx: DropdownContext) {
	setContext('edra-dropdown', ctx);
}

export function getDropdown() {
	return getContext<DropdownContext>('edra-dropdown');
}
