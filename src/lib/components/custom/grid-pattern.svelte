<script lang="ts">
	import { cn } from '$lib/utils.js';

	let id = crypto.randomUUID().toString().slice(0, 8);

	interface Props {
		width?: number;
		height?: number;
		x?: number;
		y?: number;
		strokeDashArray?: string;
		squares?: Array<[x: number, y: number]>;
		class?: string;
		fillColor?: string;
		strokeWidth?: number;
		[key: string]: unknown;
	}

	let {
		width = 40,
		height = 40,
		x = -1,
		y = -1,
		strokeDashArray = '',
		squares = [[0, 0]],
		class: className = '',
		fillColor = 'rgb(156 163 175 / 0.3)',
		strokeWidth = 1,
		...rest
	}: Props = $props();
</script>

<svg
	aria-hidden="true"
	class={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
	{...rest}
	stroke={fillColor}
	stroke-width={strokeWidth}
>
	<defs>
		<pattern {id} {width} {height} patternUnits="userSpaceOnUse" {x} {y}>
			<path d="M.5 {height}V.5H{width}" fill="none" stroke-dasharray={strokeDashArray} />
		</pattern>
	</defs>
	<rect width="100%" height="100%" stroke-width={0} fill="url(#{id})" />
	{#if squares}
		<svg {x} {y} class="overflow-visible">
			{#each squares as sq}
				<rect
					stroke={fillColor}
					fill="none"
					stroke-width="0"
					width={width - 1}
					height={height - 1}
					x={sq[0] * width + 1}
					y={sq[1] * height + 1}
				/>
			{/each}
		</svg>
	{/if}
</svg>
