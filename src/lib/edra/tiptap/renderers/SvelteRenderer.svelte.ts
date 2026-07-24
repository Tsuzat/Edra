import { mount, unmount, type Component } from 'svelte';

export interface SvelteRendererOptions {
	props?: Record<string, unknown>;
}

export class SvelteRenderer {
	private container: Element;

	private componentInstance: Record<string, unknown> | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private component: Component<any>;

	private store = $state<Record<string, unknown>>({});

	destroyed = false;

	el: Element | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(component: Component<any>, { props = {} }: SvelteRendererOptions = {}) {
		this.component = component;
		this.container = document.createElement('div');
		Object.assign(this.store, props);
		this.mountComponent();
	}

	get element(): Element | null {
		return this.el;
	}

	get props(): Record<string, unknown> {
		return this.store;
	}

	get ref(): Record<string, unknown> | null {
		return this.componentInstance;
	}

	private mountComponent() {
		if (this.destroyed) {
			return;
		}

		this.componentInstance = mount(this.component, {
			target: this.container,
			props: this.store
		});

		this.el = this.container.firstElementChild as Element | null;
	}

	updateProps(props: Record<string, unknown> = {}): void {
		if (this.destroyed) {
			return;
		}

		Object.assign(this.store, props);
	}

	destroy(): void {
		if (this.destroyed) {
			return;
		}

		this.destroyed = true;

		if (this.componentInstance) {
			unmount(this.componentInstance);
			this.componentInstance = null;
		}

		this.el = null;
	}
}
