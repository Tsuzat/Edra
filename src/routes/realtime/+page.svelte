<script lang="ts">
	import { resolve } from '$app/paths';
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { ArrowLeft, BookOpen, Pencil, Radio, Shuffle, Users } from '@lucide/svelte';
	import { cn, getRandomColor, getRandomName } from '$lib/utils.js';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
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
	const ROOM_NAME = 'edra:demoroom';

	type CollabUser = { name: string; color: string; clientId?: number };
	type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

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
			// ignore
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

	let userDialogOpen = $state(false);
	let pendingName = $state('');
	let pendingColor = $state('');
	const initialUser = getInitialUser();
	let currentUser = $state<CollabUser>(initialUser);

	let status = $state<ConnectionStatus>('connecting');
	let activeUsers = $state<CollabUser[]>([]);

	// --- presence sync (rAF-throttled, awareness can fire >60Hz) ---
	let raf = 0;
	let onStatusHandler: ((e: { status: ConnectionStatus }) => void) | undefined;
	let onSyncHandler: (() => void) | undefined;
	let onAwarenessHandler: (() => void) | undefined;

	function scheduleUpdate() {
		if (raf) return;
		raf = requestAnimationFrame(() => {
			raf = 0;
			syncUsers();
		});
	}

	function syncUsers() {
		if (!provider?.awareness) {
			const fallback = status === 'connected' ? [{ ...currentUser, clientId: 0 }] : [];
			if (fallback.length !== activeUsers.length) activeUsers = fallback;
			return;
		}
		const selfId = provider.awareness.clientID as number;
		const states = provider.awareness.getStates();
		const list: CollabUser[] = [];
		states.forEach((st: unknown, clientId: number) => {
			const user = (st as { user?: { name?: string; color?: string } })?.user;
			if (user?.name) {
				list.push({
					name: String(user.name).slice(0, 32),
					color: user.color || '#7C3AED',
					clientId
				});
			}
		});
		if (status === 'connected' && !list.some((u) => u.clientId === selfId)) {
			list.push({ ...currentUser, clientId: selfId });
		}
		list.sort((a, b) => {
			if (a.clientId === selfId) return -1;
			if (b.clientId === selfId) return 1;
			return a.name.localeCompare(b.name);
		});
		if (
			list.length === activeUsers.length &&
			list.every(
				(u, i) =>
					u.clientId === activeUsers[i]?.clientId &&
					u.name === activeUsers[i]?.name &&
					u.color === activeUsers[i]?.color
			)
		) {
			return;
		}
		activeUsers = list;
	}

	const userCount = $derived(activeUsers.length || (status === 'connected' ? 1 : 0));
	const visibleUsers = $derived(activeUsers.slice(0, 4));
	const overflowCount = $derived(Math.max(0, activeUsers.length - 4));
	const statusLabel = $derived(
		status === 'connected' ? 'Live' : status === 'connecting' ? 'Connecting' : 'Offline'
	);

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
		if (editor) {
			editor.commands.updateUser(next);
		}
		scheduleUpdate();
		userDialogOpen = false;
	}

	if (browser) {
		ydoc = new Doc();
		provider = new HocuspocusProvider({
			url: PUBLIC_REALTIME_URL,
			name: ROOM_NAME,
			document: ydoc
		});

		onStatusHandler = (e: { status: ConnectionStatus }) => {
			status = e.status;
			scheduleUpdate();
		};
		onSyncHandler = () => scheduleUpdate();
		onAwarenessHandler = () => scheduleUpdate();

		provider.on('status', onStatusHandler);
		provider.on('synced', onSyncHandler);
		provider.on('connect', onSyncHandler);
		provider.on('disconnect', () => {
			status = 'disconnected';
			scheduleUpdate();
		});
		provider.awareness?.on('update', onAwarenessHandler);

		editor = createEditor({
			collaborative: true,
			callAI: sampleCallAI,
			extensions: [
				Collaboration.configure({ document: ydoc }),
				CollaborationCaret.configure({ provider, user: initialUser })
			]
		});
	}

	$effect(() => {
		return () => {
			if (raf) cancelAnimationFrame(raf);
			try {
				if (provider && onStatusHandler) provider.off('status', onStatusHandler);
				if (provider && onSyncHandler) {
					provider.off('synced', onSyncHandler);
					provider.off('connect', onSyncHandler);
				}
				if (provider?.awareness && onAwarenessHandler) {
					provider.awareness.off('update', onAwarenessHandler);
				}
			} catch {
				// ignore
			}
			editor?.destroy();
			provider?.destroy();
			ydoc?.destroy();
		};
	});
</script>

<svelte:head>
	<title>Realtime Workspace | Edra</title>
</svelte:head>

{#snippet avatar(name: string, color: string, variant: 'button' | 'trigger' | 'list' | 'dialog')}
	{@const classes =
		variant === 'button'
			? 'size-5 text-[11px] leading-none'
			: variant === 'trigger'
				? 'size-6 text-[10px] leading-none border-2 border-background shadow-sm'
				: variant === 'list'
					? 'size-8 shrink-0 text-xs shadow-sm'
					: 'size-10 shrink-0 text-sm shadow-sm'}
	<span
		class={cn('grid place-items-center rounded-md font-bold text-white', classes)}
		style:background-color={color}
		title={name}
		aria-hidden="true"
	>
		{(name || '?').charAt(0).toUpperCase()}
	</span>
{/snippet}

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<header
		class="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/80 px-3 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-4 md:px-6"
	>
		<div class="flex min-w-0 items-center gap-2 sm:gap-3">
			<Button variant="ghost" size="icon" href={resolve('/')} class="nodefault shrink-0">
				<ArrowLeft class="size-4" />
			</Button>
			<div class="flex min-w-0 items-center gap-2">
				<span class="truncate text-sm font-semibold tracking-tight">Realtime</span>
				<span
					class="hidden items-center gap-1.5 rounded-full border bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:inline-flex"
				>
					<Radio class="size-3 shrink-0 opacity-70" />
					<span class="truncate">{ROOM_NAME}</span>
				</span>
			</div>
		</div>

		<div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
			<Popover.Root>
				<Popover.Trigger
					class={cn(
						'inline-flex h-8 items-center gap-2 rounded-full border px-2.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
						status === 'connected'
							? 'border-border bg-card'
							: status === 'connecting'
								? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
								: 'border-destructive/30 bg-destructive/10 text-destructive'
					)}
					aria-label="Collaborators"
				>
					<span class="relative flex size-2 shrink-0">
						{#if status === 'connected'}
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
						{:else if status === 'connecting'}
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-amber-500"></span>
						{:else}
							<span class="relative inline-flex size-2 rounded-full bg-destructive"></span>
						{/if}
					</span>

					{#if status === 'connected' && activeUsers.length}
						<span class="hidden items-center -space-x-1.5 sm:flex">
							{#each visibleUsers as u (u.clientId ?? u.name)}
								{@render avatar(u.name, u.color, 'trigger')}
							{/each}
							{#if overflowCount > 0}
								<span
									class="grid size-6 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground"
								>
									+{overflowCount}
								</span>
							{/if}
						</span>
						<span class="inline-flex items-center gap-1">
							<Users class="size-3 opacity-70 sm:hidden" />
							<span class="tabular-nums">{userCount}</span>
						</span>
					{:else}
						<span class="capitalize">{statusLabel}</span>
					{/if}
				</Popover.Trigger>

				<Popover.Content class="w-80 p-0" align="end" sideOffset={8}>
					<div class="flex items-center justify-between border-b px-3 py-2.5">
						<div class="flex items-center gap-2">
							<span
								class={cn(
									'size-2 rounded-full',
									status === 'connected'
										? 'bg-emerald-500'
										: status === 'connecting'
											? 'bg-amber-500'
											: 'bg-destructive'
								)}
							></span>
							<span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
								>{statusLabel}</span
							>
							<span class="text-xs text-muted-foreground">·</span>
							<span class="text-xs font-medium tabular-nums"
								>{userCount} {userCount === 1 ? 'person' : 'people'}</span
							>
						</div>
						<span
							class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
							>{ROOM_NAME}</span
						>
					</div>

					<div class="max-h-72 overflow-y-auto p-2">
						{#if activeUsers.length}
							<ul class="space-y-0.5">
								{#each activeUsers as u (u.clientId ?? u.name)}
									<li
										class="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/60"
									>
										{@render avatar(u.name, u.color, 'list')}
										<div class="min-w-0 flex-1">
											<div class="flex items-center gap-1.5">
												<span class="truncate text-sm leading-none font-medium">{u.name}</span>
												{#if u.clientId === provider?.awareness?.clientID}
													<span
														class="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-primary"
														>You</span
													>
												{/if}
											</div>
											<span class="flex items-center gap-1 text-[11px] text-muted-foreground">
												<span class="size-1 rounded-full bg-emerald-500"></span> Active now
											</span>
										</div>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="px-2 py-6 text-center text-xs text-muted-foreground">
								No collaborators yet.<br />Share this page to invite others.
							</p>
						{/if}
					</div>

					<div class="border-t bg-muted/30 px-3 py-2">
						<p class="text-[11px] leading-snug text-muted-foreground">
							Cursors and selections are shown in real time. Changes sync automatically.
						</p>
					</div>
				</Popover.Content>
			</Popover.Root>

			<Button
				variant="ghost"
				size="sm"
				href={resolve('/docs/collaboration')}
				class="nodefault hidden gap-1.5 md:inline-flex"
			>
				<BookOpen class="size-4" />
				Docs
			</Button>
			<Button
				variant="ghost"
				size="icon"
				href={resolve('/docs/collaboration')}
				class="nodefault md:hidden"
				aria-label="Collaboration docs"
			>
				<BookOpen class="size-4" />
			</Button>

			<Button
				variant="outline"
				class="h-8 gap-1.5 px-2 sm:px-2.5"
				onclick={openUserDialog}
				aria-label="Edit display name"
			>
				{@render avatar(currentUser.name, currentUser.color, 'button')}
				<span class="hidden max-w-24 truncate text-xs font-medium sm:inline"
					>{currentUser.name}</span
				>
				<Pencil class="hidden size-3 opacity-60 sm:inline" />
			</Button>

			<ToggleMode />
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
					{@render avatar(pendingName.trim() || currentUser.name, pendingColor, 'dialog')}
					<div class="min-w-0 flex-1">
						<span class="block truncate text-sm font-medium"
							>{pendingName.trim() || 'Your name'}</span
						>
						<span class="text-xs text-muted-foreground">Visible to everyone in this room</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						class="ml-auto shrink-0"
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
					<p class="text-xs text-muted-foreground tabular-nums">{pendingName.trim().length}/32</p>
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="outline" onclick={() => (userDialogOpen = false)}>Cancel</Button>
				<Button onclick={saveUser} disabled={!pendingName.trim()}>Save</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	{#if status !== 'connected'}
		<div
			class={cn(
				'mx-auto flex w-full max-w-3xl items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-sm sm:mt-3',
				status === 'connecting'
					? 'border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-200'
					: 'border-destructive/20 bg-destructive/10 text-destructive'
			)}
		>
			<span
				class={cn(
					'size-2 shrink-0 rounded-full',
					status === 'connecting' ? 'animate-pulse bg-amber-500' : 'bg-destructive'
				)}
			></span>
			<span class="font-medium">
				{status === 'connecting' ? 'Connecting to realtime server…' : 'Offline — reconnecting…'}
			</span>
			<span class="hidden text-muted-foreground sm:inline">·</span>
			<span class="hidden text-muted-foreground sm:inline">Edits will sync when back online.</span>
		</div>
	{/if}

	<h3 class="animate-pulse py-4 text-center">Changes are streamed in real time.</h3>

	<main class="flex-1 overflow-y-auto pb-24 sm:pb-32">
		{#if editor}
			<Edra {editor}>
				<Edra.UseAI />
				<Edra.ToC />
				<Edra.BubbleMenu />
				<Edra.Content
					class={cn(
						'mx-auto w-full max-w-3xl cursor-auto px-4 py-4 text-base transition-all duration-300 *:outline-none sm:px-8'
					)}
				/>
				<Edra.DragHandle type="extended" class="transition-all! duration-300!" />
			</Edra>
		{:else}
			<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-8">
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
