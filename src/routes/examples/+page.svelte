<script lang="ts">
	import MagicCard from '$lib/components/custom/MagicCard.svelte';
	import CSSSvg from '$lib/static/images/css.svg';
	import ShadCN from '$lib/static/images/shad-cn.svg';
	import Notion from '$lib/static/images/notion.svg';
	import FileText from '@lucide/svelte/icons/file-text';
</script>

<div>
	<h1 class="my-8 animate-bounce text-center text-4xl font-bold">Explore the examples</h1>
	<div class="flex flex-wrap justify-center gap-8 px-4">
		<a href="/examples/headless" style="display:block;width:320px;height:160px;flex-shrink:0">
			<MagicCard
				class="group cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300 hover:border-[#0277bd9e]"
				gradientColor="#0277bd25"
				gradientSize={200}
				gradientOpacity={0.5}
			>
				<div
					class="flex items-center justify-center gap-1.5 font-semibold transition-all duration-500 group-hover:text-[#0277bd]"
				>
					<img src={CSSSvg} alt="svelte_logo" class="mt-1.5 size-10" />
					Headless
				</div>
			</MagicCard>
		</a>
		<a href="/examples/shadcn" style="display:block;width:320px;height:160px;flex-shrink:0">
			<MagicCard
				class="group cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300 hover:border-[#eb4f279e]"
				gradientColor="#eb4f2725"
				gradientSize={200}
				gradientOpacity={0.5}
			>
				<div
					class="flex items-center justify-center gap-1.5 font-semibold transition-all duration-500 group-hover:text-[#eb4f27]"
				>
					<img src={ShadCN} alt="svelte_logo" class="mt-1.5 size-10" />
					ShadCN
				</div>
			</MagicCard>
		</a>
		<a href="/examples/shadcn/markdown" style="display:block;width:320px;height:160px;flex-shrink:0">
			<MagicCard
				class="group cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300 hover:border-[#7c3aed9e]"
				gradientColor="#7c3aed25"
				gradientSize={200}
				gradientOpacity={0.5}
			>
				<div
					class="flex flex-col items-center justify-center gap-0.5 font-semibold transition-all duration-500 group-hover:text-[#7c3aed]"
				>
					<div class="flex items-center justify-center gap-1.5">
						<FileText class="size-10" />
						Markdown
					</div>
					<div class="text-muted-foreground text-xs">
						<a href="/examples/shadcn/markdown" class="hover:underline">shadcn</a>
						·
						<a href="/examples/headless/markdown" class="hover:underline">headless</a>
					</div>
				</div>
			</MagicCard>
		</a>
		<a href="/examples/notion" style="display:block;width:320px;height:160px;flex-shrink:0">
			<MagicCard
				class="group cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300"
				gradientSize={200}
				gradientOpacity={0.5}
			>
				<div
					class="flex items-center justify-center gap-1.5 font-semibold transition-all duration-500"
				>
					<img src={Notion} alt="svelte_logo" class="mt-1.5 size-10" />
					Notion
				</div>
			</MagicCard>
		</a>
	</div>
</div>
