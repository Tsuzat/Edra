export const exampleCode = `<script lang="ts">
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';
    import { updateInDB } from '$lib/db';

    /**
     * [OPTIONAL] Use this function so perform something when content is updated.
     * May be save the content somewhere. You can define your own logic here.
     */
    const onUpdate = () => {
        const content = editor?.getJSON();
        updateInDB(content)
	};

    /**
     * [OPTIONAL] Pass an call AI function which takes a prompt, onChunk and onError callbacks
     * This function allows you to implement your own AI provider
     */
	async function callAI(
		prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {}

	const editor = createEditor({
		onUpdate,
		callAI
	});
</script>
<div class="border rounded-lg">
	<Edra {editor}>
		<Edra.UseAI />
		<Edra.Toolbar class="border-b scrollbar-none p-1 overflow-x-scroll max-w-full!" />
		<Edra.BubbleMenu />
		<Edra.Content class="*:outline-none cursor-auto h-150 overflow-y-scroll py-4 px-8" />
		<Edra.DragHandle />
	</Edra>
</div>`;
