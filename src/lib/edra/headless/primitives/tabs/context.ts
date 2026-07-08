import { setContext, getContext } from 'svelte';

export interface TabsContext {
	value: string;
	setValue: (val: string) => void;
}

export function setTabs(ctx: TabsContext) {
	setContext('edra-tabs', ctx);
}

export function getTabs() {
	return getContext<TabsContext>('edra-tabs');
}
