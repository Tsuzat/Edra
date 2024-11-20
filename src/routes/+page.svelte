<script lang="ts">
	import { browser } from '$app/environment';
	import Icons from '$lib/components/custom/icons/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import ShadEditor from '$lib/shad-editor/shad-editor.svelte';
	import { writable } from 'svelte/store';

	let localStorageContent = '';

	if (browser) {
		localStorageContent =
			localStorage.getItem('content') ||
			`
<h1 class="tiptap-heading">Creating a rich text editor with Tiptap, shadcn and ❤️</h1><p>This editor supports markdown out of the box. We have <strong>bold</strong>, <em>italic</em>, <s>strike</s>, <u>underline</u>, <a target="_blank" rel="noopener noreferrer" href="https://tsuzat.com">link</a>, <code>code</code>, Superscript A<sup>b</sup>, subscript A<sub>b</sub>, <mark data-color="#940080" style="background-color: #940080; color: inherit">highlight1</mark><mark data-color="#1a1600" style="background-color: #1a1600; color: inherit">,</mark> <mark data-color="#0000FF" style="background-color: #0000FF; color: inherit">highlight2</mark>,<span style="color: rgb(78, 211, 21)">textcolor1, </span><span style="color: rgb(128, 0, 128)">textcolor2.</span></p><blockquote><p>Block Quote and Code highlight with lowlight and colorscheme onelight and onedark</p></blockquote><h2 class="tiptap-heading">Code Block</h2><pre><code class="language-typescript">// Main function
function main(){
    console.log("Hello Developers");
}</code></pre><h2 class="tiptap-heading">Lists</h2><ul class="list-disc"><li><p>Unordered List</p></li></ul><ol class="list-decimal"><li><p>Ordered List</p></li></ol><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Task List</p></div></li></ul><p></p><h2 class="tiptap-heading" style="text-align: center">Align Center</h2><p>Smilipicker, type <code>:)</code> and it becoms 🙂 or 😉. Typography support e.g. type <code>!=</code> and it becomes ≠. Similarly (c) becomes ©, -&gt; becomes → and many more like 1×2, ½. We also have color visualizer. #FFF, #000, #FF00FF&nbsp;can be visualized.</p><h2 class="tiptap-heading">Table</h2><table style="width: 488px"><colgroup><col style="width: 155px"><col style="width: 167px"><col style="width: 166px"></colgroup><tbody><tr><th colspan="1" rowspan="1" colwidth="155"><p>Hello World</p></th><th colspan="1" rowspan="1" colwidth="167"><p>Hello World</p></th><th colspan="1" rowspan="1" colwidth="166"><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Hello World</p></div></li></ul></th></tr><tr><td colspan="1" rowspan="1" colwidth="155"><p>Hello World</p></td><td colspan="1" rowspan="1" colwidth="167"><p>Hello World</p></td><td colspan="1" rowspan="1" colwidth="166"><p>Hello World</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="155"><p></p></td><td colspan="1" rowspan="1" colwidth="167"><p></p></td><td colspan="1" rowspan="1" colwidth="166"><p></p></td></tr></tbody></table><h2 class="tiptap-heading">Image Support</h2><img src="https://placehold.co/800x400/6A00F5/white" title="" width="714" height="100%" align="center"><h3 class="tiptap-heading">Explore More…</h3>
		`;
	}

	const content = writable(localStorageContent);

	content.subscribe((value) => {
		console.log('Content Changed');
		if (!browser) return;
		localStorage.setItem('content', value);
	});
</script>

<div class="flex w-full flex-col items-center justify-around *:my-4">
	<h1 class="animate-pulse text-4xl font-extrabold">Shad Editor</h1>
	<p class="text-center text-[1.2rem] font-medium text-muted-foreground">
		Made with Svelte, Tiptap and Shadcn UI for <span class="text-foreground">developers</span>
	</p>
	<p class="w-full text-center sm:w-[35rem]">
		An editor with rich text features and a beautiful UI, provides full flexibility and customizable
		components ready to copy and paste, made for developers.
	</p>
	<div>
		<Button class="font-medium" href="/docs">
			<Icons.document /> View Docs
		</Button>
		<Button
			variant="outline"
			class="font-medium"
			href="https://github.com/Tsuzat/ShadEditor"
			target="_blank"
		>
			<Icons.github /> Star on Github
		</Button>
	</div>
	<div class="h-[calc(90dvh)] w-[95%] sm:h-[40rem]">
		<ShadEditor class="h-full w-full overflow-auto" bind:content={$content} />
	</div>
</div>
