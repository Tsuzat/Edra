<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import type { ShouldShowProps } from './types.js';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let link = $derived.by(() => editor.getAttributes('link').href);

	let isEditing = $state(false);

	function setLink(url: string) {
		if (url.trim() === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	let linkInput = $state('');
	let isLinkValid = $state(true);

	$effect(() => {
		isLinkValid = validateURL(linkInput);
	});

	function validateURL(url: string): boolean {
		const urlPattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol (optional)
				'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name and extension
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
			'i'
		);
		return urlPattern.test(url);
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="link-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (props.editor.isActive('link')) {
			return true;
		} else {
			isEditing = false;
			linkInput = '';
			isLinkValid = true;
			return false;
		}
	}}
	class="bubble-menu-wrapper"
>
	<a href={link} target="_blank">{link}</a>
</BubbleMenu>
