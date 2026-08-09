export const installCode = `pnpm add @hocuspocus/provider @hocuspocus/server yjs @tiptap/extension-collaboration @tiptap/extension-collaboration-caret`;

export const serverCode = `// Server Code
import { Server } from '@hocuspocus/server';

const server = Server.configure({
  port: 8787,
  // name = room id (e.g. "edra:demoroom"); one Y.Doc per room is kept in memory
  // Add hooks for auth / persistence as needed:
  // async onAuthenticate({ token }) { /* verify token or throw */ },
  // async onStoreDocument({ documentName, document }) { /* persist Y.Doc */ },
  // async onLoadDocument({ documentName, document }) { /* restore Y.Doc */ },
});

server.listen();
console.log('Hocuspocus listening on ws://localhost:8787');`;

export const envCode = `# .env  (or .env.local)
PUBLIC_REALTIME_URL=ws://localhost:8787
# In production, use wss://your-hocuspocus-host`;

export const clientBasicCode = `<script lang="ts">
  import { browser } from '$app/environment';
  import { createEditor, Edra } from '$lib/edra/shadcn/index.js';
  import { HocuspocusProvider } from '@hocuspocus/provider';
  import { Doc } from 'yjs';
  import Collaboration from '@tiptap/extension-collaboration';
  import CollaborationCaret from '@tiptap/extension-collaboration-caret';
  import type { Editor } from '$lib/edra/tiptap/index.js';
  import { PUBLIC_REALTIME_URL } from '$env/static/public';

  let editor = $state.raw<Editor>();
  let provider: HocuspocusProvider | undefined;
  let ydoc: Doc | undefined;

  if (browser) {
    ydoc = new Doc();
    provider = new HocuspocusProvider({
      url: PUBLIC_REALTIME_URL,
      name: 'edra:demoroom',
      document: ydoc
    });

    editor = createEditor({
      collaborative: true, // disables StarterKit history — Yjs owns undo/redo
      extensions: [
        Collaboration.configure({ document: ydoc }),
        CollaborationCaret.configure({ provider, user: { name: 'Jane', color: '#7C3AED' } })
      ]
    });
  }

  $effect(() => () => {
    editor?.destroy();
    provider?.destroy();
    ydoc?.destroy();
  });
</script>

{#if editor}
  <Edra {editor}>
		<Edra.UseAI />
		<Edra.ToC />
		<Edra.BubbleMenu />
		<Edra.Content	/>
		<Edra.DragHandle />
	</Edra>
{/if}`;

export const userUpdateCode = `// Update local user (name / color) at runtime
editor.commands.updateUser({ name: 'John Doe', color: '#2563EB' });

// Fallback if the command is not yet registered (e.g. before editor is ready):
provider.awareness.setLocalStateField('user', { name: 'John Doe', color: '#2563EB' });`;

export const caveatsCode = `// Do NOT re-enable history when collaborative:true — Edra disables StarterKit undoRedo for you.
// Do NOT pass the same HocuspocusProvider/document to two editors.
// Seed initial content via the Y.Doc on the server, or set content after the provider syncs.
provider.on('synced', () => {
  if (ydoc.get('content', Y.XmlFragment).length === 0) {
    editor?.commands.setContent('<p>Hello, realtime!</p>', { contentType: 'html' });
  }
});`;
