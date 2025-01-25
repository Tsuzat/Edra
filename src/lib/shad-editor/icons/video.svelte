<!-- <script lang="ts">
	import { ChevronDown, Video } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { slide } from 'svelte/transition';

	let { editor }: { editor: Editor } = $props();

	let value = $state('');

	function addVideo() {
		editor.chain().focus().setVideo(value).run();
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant="ghost"
						size="sm"
						class={cn('h-8', editor.isActive('video') && 'bg-muted')}
						onclick={() => {}}
					>
						<Video />
						<ChevronDown class="!size-3" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Add Video</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</Popover.Trigger>
	<Popover.Content class="w-80">
		<Input placeholder="Enter video url..." type="url" bind:value />
		{#if value.trim() !== ''}
			<div transition:slide>
				<video src={value} class="h-80 w-full border p-2" controls>
					<track kind="captions" />
				</video>
			</div>
			<Button onclick={addVideo}>Add Video</Button>
		{/if}
	</Popover.Content>
</Popover.Root> -->

<script lang="ts">
	import { Video } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let { editor }: { editor: Editor } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class={cn('h-8', editor.isActive('video-placeholder') && 'bg-muted')}
				onclick={() => editor.chain().focus().insertVideoPlaceholder().run()}
			>
				<Video />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Add Video</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
