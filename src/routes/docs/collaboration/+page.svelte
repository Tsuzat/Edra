<script lang="ts">
	import Code from '$lib/components/custom/docs/Code.svelte';
	import CliCode from '$lib/components/custom/docs/CliCode.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft, ExternalLink } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { serverCode, envCode, clientBasicCode, userUpdateCode, caveatsCode } from './code.ts';
</script>

<svelte:head>
	<title>Realtime Collaboration | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Realtime Collaboration</h1>
	<p class="lead">
		Add multi-user editing to Edra with <a
			href="https://tiptap.dev/docs/hocuspocus/getting-started/overview"
			target="_blank"
			rel="noreferrer">Hocuspocus</a
		>
		+ Yjs. Not bundled by default — opt-in via <code>collaborative</code>.
	</p>

	<div class="not-prose my-6 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 p-4">
		<div class="flex flex-1 flex-col gap-2">
			<span class="text-sm font-medium">Try it live</span>
			<span class="text-sm text-muted-foreground">
				Open the realtime workspace and share the URL with another tab or user.
			</span>
		</div>
		<Button href={resolve('/realtime')} size="xs" class="nodefault">
			Open realtime workspace <ExternalLink />
		</Button>
	</div>

	<hr class="my-6" />

	<h2>1. How it works</h2>
	<ul class="mt-4 list-disc space-y-1 pl-6">
		<li><strong>Yjs</strong> CRDT keeps one <code>Y.Doc</code> per room, synced over WebSocket.</li>
		<li><strong>Hocuspocus</strong> is the WebSocket server that holds/auths/persists rooms.</li>
		<li>
			<strong>Edra</strong> with <code>collaborative: true</code> disables StarterKit history
			(undo/redo) — Yjs owns it. Just add <code>Collaboration</code> +
			<code>CollaborationCaret</code>.
		</li>
	</ul>

	<h2>2. Install</h2>
	<div class="my-4">
		<CliCode type="collaboration" />
	</div>
	<p class="text-sm text-muted-foreground">
		Peer deps: <code>yjs</code>, <code>@hocuspocus/provider</code> (client) and
		<code>@hocuspocus/server</code> (server).
	</p>

	<h2>3. Server</h2>
	<p>Minimal standalone Hocuspocus server. Host it anywhere Node runs.</p>
	<div class="my-4">
		<Code code={serverCode} language="typescript" />
	</div>
	<p>
		See <a
			href="https://tiptap.dev/docs/hocuspocus/getting-started/overview"
			class="px-0! text-blue-500 underline!"
			target="_blank">Hocuspocus docs</a
		>
		for auth, persistence (DB/Redis), and scaling options.
	</p>

	<h3>Environment</h3>
	<div class="my-4">
		<Code code={envCode} language="bash" />
	</div>

	<h2>4. Client</h2>
	<p>
		Create the <code>Y.Doc</code> + <code>HocuspocusProvider</code> on the browser only, then pass
		them to <code>createEditor</code> with <code>collaborative: true</code>.
	</p>
	<div class="my-4">
		<Code code={clientBasicCode} language="typescript" />
	</div>

	<h2>5. User identity (name & color)</h2>
	<p>Other cursors show <code>{`{ name, color }`}</code>. Update at runtime:</p>
	<div class="my-4">
		<Code code={userUpdateCode} language="typescript" />
	</div>

	<h2>6. Caveats</h2>
	<div class="my-4">
		<Code code={caveatsCode} language="typescript" />
	</div>
	<ul class="list-disc space-y-1 pl-6">
		<li>
			Create the editor outside <code>onMount</code> (guard with <code>browser</code>) so Tiptap's
			Svelte effects have a valid lifecycle.
		</li>
		<li>
			Clean up with <code>editor.destroy() / provider.destroy() / ydoc.destroy()</code> on unmount.
		</li>
		<li>
			One room = one <code>name</code> passed to <code>HocuspocusProvider</code>. Use auth tokens
			per user if needed.
		</li>
	</ul>

	<h2>7. Headless flavor</h2>
	<p>
		Same idea with <code>createEditor</code> from
		<code>$lib/edra/headless/index.js</code> — also accepts
		<code>{`{ collaborative: true, extensions: [...] }`}</code>.
	</p>

	<div class="mt-12 flex">
		<Button href={resolve('/docs/extensions/slash-command')} variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Slash Command
		</Button>
	</div>
</article>
