<script lang="ts">
	import { resolve } from '$app/paths';
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ArrowLeft, Pencil, Shuffle } from '@lucide/svelte';
	import { cn, getRandomColor, getRandomName } from '$lib/utils.js';
	import { browser } from '$app/environment';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import './page.css';
	import type { Editor } from '$lib/edra/tiptap/index.js';
	import { HocuspocusProvider } from '@hocuspocus/provider';
	import { Doc } from 'yjs';
	import Collaboration from '@tiptap/extension-collaboration';
	import CollaborationCaret from '@tiptap/extension-collaboration-caret';
	import { PUBLIC_REALTIME_URL } from '$env/static/public';

	const USER_STORAGE_KEY = 'edra-realtime-user';

	type CollabUser = { name: string; color: string };

	function loadStoredUser(): CollabUser | null {
		try {
			const raw = localStorage.getItem(USER_STORAGE_KEY);
			if (!raw) return null;
			const parsed = JSON.parse(raw) as Partial<CollabUser>;
			if (
				typeof parsed.name === 'string' &&
				parsed.name.trim() &&
				typeof parsed.color === 'string'
			) {
				return { name: parsed.name.trim().slice(0, 32), color: parsed.color };
			}
		} catch {
			// ignore invalid stored user
		}
		return null;
	}

	function persistUser(user: CollabUser) {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
	}

	function getInitialUser(): CollabUser {
		if (browser) {
			const stored = loadStoredUser();
			if (stored) return stored;
		}
		return { name: getRandomName(), color: getRandomColor() };
	}
	/** Sample mock callAI for testing — streams a generic paragraph word-by-word */
	async function sampleCallAI(
		_prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {
		const paragraph =
			'The quick brown fox jumps over the lazy dog. ' +
			'This is a sample paragraph generated for testing purposes. ' +
			'It demonstrates how the AI streaming interface works by delivering content word by word. ' +
			'Each word arrives with a small delay to simulate real-time generation from an AI model.';
		const words = paragraph.split(' ');
		try {
			for (const word of words) {
				await new Promise((r) => setTimeout(r, 100));
				onChunk(word + ' ');
			}
		} catch (error) {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	}

	let editor = $state.raw<Editor>();
	let provider: HocuspocusProvider | undefined;
	let ydoc: Doc | undefined;

	// Dialog / identity state
	let userDialogOpen = $state(false);
	let pendingName = $state('');
	let pendingColor = $state('');
	const initialUser = getInitialUser();
	let currentUser = $state<CollabUser>(initialUser);

	function openUserDialog() {
		pendingName = currentUser.name;
		pendingColor = currentUser.color;
		userDialogOpen = true;
	}

	function shufflePendingColor() {
		pendingColor = getRandomColor();
	}

	function saveUser() {
		const name = pendingName.trim().slice(0, 32);
		if (!name) return;
		const next: CollabUser = { name, color: pendingColor };
		currentUser = next;
		persistUser(next);
		// CollaborationCaret exposes `updateUser`
		if (editor) {
			editor.commands.updateUser({
				name: name,
				color: pendingColor
			});
		}
		userDialogOpen = false;
	}

	if (browser) {
		ydoc = new Doc();
		provider = new HocuspocusProvider({
			url: PUBLIC_REALTIME_URL,
			name: `edra:demoroom`,
			document: ydoc
		});

		editor = createEditor({
			collaborative: true,
			callAI: sampleCallAI,
			extensions: [
				Collaboration.configure({
					document: ydoc
				}),
				CollaborationCaret.configure({
					provider,
					user: initialUser
				})
			]
		});
	}

	$effect(() => {
		return () => {
			editor?.destroy();
			provider?.destroy();
			ydoc?.destroy();
		};
	});
</script>

<svelte:head>
	<title>Realtime Workspace | Edra</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<!-- Workspace Sticky Header -->
	<header
		class="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur"
	>
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon" href={resolve('/')} class="nodefault">
				<ArrowLeft class="size-4" />
			</Button>
			<span class="max-w-40 truncate text-sm font-semibold md:max-w-64">Realtime Workspace</span>
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={openUserDialog}
				class="flex items-center gap-2 rounded-full border bg-muted/50 px-2 py-1 pr-3 text-sm transition-colors hover:bg-muted"
				aria-label="Edit display name"
			>
				<span
					class="grid size-7 place-items-center rounded-full text-xs font-semibold text-white"
					style:background-color={currentUser.color}
					aria-hidden="true"
				>
					{currentUser.name.charAt(0).toUpperCase()}
				</span>
				<span class="hidden max-w-24 truncate sm:inline">{currentUser.name}</span>
				<Pencil class="size-3.5 opacity-60" />
			</button>
		</div>
	</header>

	<Dialog.Root bind:open={userDialogOpen}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Edit display name</Dialog.Title>
				<Dialog.Description>
					This name and color are shown to collaborators in the realtime session.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-2">
				<div class="flex items-center gap-3">
					<span
						class="grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
						style:background-color={pendingColor}
					>
						{(pendingName.trim() || currentUser.name).charAt(0).toUpperCase()}
					</span>
					<div class="flex flex-col">
						<span class="text-sm font-medium">{pendingName.trim() || 'Your name'}</span>
						<span class="text-xs text-muted-foreground"
							>Color is assigned randomly but editable</span
						>
					</div>
					<Button
						variant="ghost"
						size="icon"
						class="ml-auto"
						onclick={shufflePendingColor}
						aria-label="Shuffle color"
					>
						<Shuffle class="size-4" />
					</Button>
				</div>
				<div class="grid gap-2">
					<label for="collab-name" class="text-sm font-medium">Display name</label>
					<Input
						id="collab-name"
						bind:value={pendingName}
						placeholder="e.g. Jane Doe"
						maxlength={32}
						autocomplete="name"
						onkeydown={(e) => {
							if (e.key === 'Enter') saveUser();
						}}
					/>
					<p class="text-xs text-muted-foreground">{pendingName.trim().length}/32</p>
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="outline" onclick={() => (userDialogOpen = false)}>Cancel</Button>
				<Button onclick={saveUser} disabled={!pendingName.trim()}>Save</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Workspace Layout -->
	<main class="flex-1 grow overflow-y-auto pb-32">
		{#if editor}
			<Edra {editor}>
				<Edra.UseAI />
				<Edra.ToC />
				<Edra.BubbleMenu />
				<Edra.Content
					class={cn(
						'mx-auto w-full max-w-3xl cursor-auto px-8 py-4 text-base transition-all duration-300 *:outline-none'
					)}
				/>
				<Edra.DragHandle type="extended" class="transition-all! duration-300!" />
			</Edra>
		{:else}
			<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 px-8 py-8">
				<Skeleton class="h-6 w-3/4" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-5/6" />
				<Skeleton class="mt-2 h-4 w-full" />
				<Skeleton class="h-4 w-4/5" />
				<Skeleton class="h-4 w-3/5" />
			</div>
		{/if}
	</main>
</div>
