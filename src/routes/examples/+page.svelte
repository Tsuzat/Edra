<script lang="ts">
	import MagicCard from '$lib/components/custom/MagicCard.svelte';
	import CSSSvg from '$lib/static/images/css.svg';
	import ShadCN from '$lib/static/images/shad-cn.svg';
	import Notion from '$lib/static/images/notion.svg';
</script>

<div>
	<h1 class="my-8 animate-bounce text-center text-4xl font-bold">Explore the examples</h1>
	<div class="flex flex-col items-center justify-center gap-8 sm:flex-row">
		<a href="/examples/headless">
			<MagicCard
				class="group !h-40 !w-80 cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300 hover:border-[#0277bd9e]"
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
		<a href="/examples/shadcn">
			<MagicCard
				class="group !h-40 !w-80 cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300 hover:border-[#eb4f279e]"
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
		<a href="/examples/notion">
			<MagicCard
				class="group !h-40 !w-80 cursor-pointer flex-col items-center justify-center text-4xl whitespace-nowrap shadow-2xl transition-all duration-300"
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
