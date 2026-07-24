import type { MarkViewProps, MarkViewRenderer, MarkViewRendererOptions } from '@tiptap/core';
import { MarkView } from '@tiptap/core';
import type { Component } from 'svelte';

import MarkViewFrame from '../components/MarkViewFrame.svelte';
import { SvelteRenderer } from './SvelteRenderer.svelte.js';

export interface SvelteMarkViewRendererOptions extends MarkViewRendererOptions {
	as?: string;
	className?: string;
	attrs?: { [key: string]: string };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SvelteMarkView extends MarkView<Component<any>, SvelteMarkViewRendererOptions> {
	renderer: SvelteRenderer;

	constructor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		component: Component<any>,
		props: MarkViewProps,
		options?: Partial<SvelteMarkViewRendererOptions>
	) {
		super(component, props, options);

		const componentProps = {
			...props,
			updateAttributes: this.updateAttributes.bind(this)
		} satisfies MarkViewProps;

		this.renderer = new SvelteRenderer(MarkViewFrame, {
			props: {
				component: this.component,
				...componentProps
			}
		});
	}

	get dom() {
		return this.renderer.element as HTMLElement;
	}

	get contentDOM() {
		return this.dom.querySelector('[data-mark-view-content]') as HTMLElement | null;
	}

	destroy() {
		this.renderer.destroy();
	}
}

export function SvelteMarkViewRenderer(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: Component<any>,
	options: Partial<SvelteMarkViewRendererOptions> = {}
): MarkViewRenderer {
	return (props) => {
		return new SvelteMarkView(component, props, options);
	};
}
