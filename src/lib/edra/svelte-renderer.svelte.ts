import type { Editor, NodeViewProps } from '@tiptap/core';
import { flushSync, mount, unmount, type Component } from 'svelte';

interface RendererOptions {
	editor: Editor;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: Record<string, any>;
}

class SvelteRenderer {
	id: string;
	component: Component;
	editor: Editor;
	// Reactive props via Svelte 5 $state — updating this automatically
	// propagates to mounted components without destroy/remount.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	currentProps: Record<string, any> = $state({});
	element: HTMLElement;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mnt: Record<string, any> | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(component: any, { props, editor }: RendererOptions) {
		this.id = Math.floor(Math.random() * 0xffffffff).toString();
		this.component = component;
		this.currentProps = props;
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
		const getProps = () => this.currentProps;
		this.mnt = mount(this.component, {
			target: this.element,
			props: {
				get props() {
					return getProps();
				}
			}
		});
	}

	updateProps(props: Partial<NodeViewProps>): void {
		// Reassign the $state value to trigger reactive updates in the mounted component.
		// This replaces the old destroy() + render() pattern.
		this.currentProps = { ...this.currentProps, ...props };
	}

	updateAttributes(attributes: Record<string, string>): void {
		Object.entries(attributes).forEach(([key, value]) => {
			this.element.setAttribute(key, value);
		});
	}

	destroy(): void {
		if (this.mnt) {
			unmount(this.mnt);
			this.mnt = null;
		}
	}
}

export default SvelteRenderer;
