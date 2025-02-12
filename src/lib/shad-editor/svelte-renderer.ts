import { flushSync, mount, unmount } from 'svelte';
import type { Editor, NodeViewProps } from '@tiptap/core';

interface RendererOptions<P extends Record<string, any>> {
	editor: Editor;
	props: P;
}

type App = ReturnType<typeof mount>;

/**
 * Check if a component is a class component.
 * @param Component
 * @returns {boolean}
 */
function isClassComponent(Component: any) {
	return !!(
		typeof Component === 'function' &&
		Component.prototype &&
		Component.prototype.isSvelteComponent
	);
}

/**
 * Check if a component is a forward ref component.
 * @param Component
 * @returns {boolean}
 */
function isForwardRefComponent(Component: any) {
	return !!(
		typeof Component === 'object' && Component.$$typeof?.toString() === 'Symbol(react.forward_ref)'
	);
}

class SvelteRenderer<R = unknown, P extends Record<string, any> = object> {
	id: string;
	component: App;
	editor: Editor;
	props: P;
	element: HTMLElement;
	ref: R | null = null;
	mnt: Record<any, any> | null = null;

	constructor(component: App, { props, editor }: RendererOptions<P>) {
		this.id = Math.floor(Math.random() * 0xffffffff).toString();
		this.component = component;
		this.props = props;
		this.editor = editor;

		this.element = document.createElement('div');
		this.element.classList.add('svelte-renderer');

		if (this.editor.isInitialized) {
			// On first render, we need to flush the render synchronously
			// Renders afterwards can be async, but this fixes a cursor positioning issue
			flushSync(() => {
				this.render();
			});
		} else {
			this.render();
		}
	}

	render(): void {
		const Component = this.component;
		const props = this.props;

		if (isClassComponent(Component) || isForwardRefComponent(Component)) {
			// @ts-ignore This is a hack to make the ref work
			props.ref = (ref: R) => {
				this.ref = ref;
			};
		}

		this.mnt = mount(this.component as any, {
			target: this.element,
			props: { props: this.props }
		});
	}

	updateProps(props: Partial<NodeViewProps>): void {
		Object.assign(this.props, props);
		this.destroy();
		this.render();
	}

	updateAttributes(attributes: Record<string, string>): void {
		Object.keys(attributes).forEach((key) => {
			this.element.setAttribute(key, attributes[key]);
		});
		this.destroy();
		this.render();
	}

	destroy(): void {
		if (this.mnt) {
			unmount(this.mnt);
		} else {
			unmount(this.component);
		}
	}
}

export default SvelteRenderer;
