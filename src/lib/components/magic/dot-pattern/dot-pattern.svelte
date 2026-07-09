<script lang="ts">
	import { onMount } from "svelte";
	import { motion } from "motion-sv";
	import { cn } from "$lib/utils";
	import type { SVGAttributes } from "svelte/elements";

	interface DotPatternProps extends SVGAttributes<SVGSVGElement> {
		width?: number;
		height?: number;
		x?: number;
		/**
		 * The y-offset of the entire pattern
		 */
		y?: number;
		/**
		 * The x-offset of individual dots
		 */
		cx?: number;
		/**
		 * The y-offset of individual dots
		 */
		cy?: number;
		/**
		 * The radius of each dot
		 */
		cr?: number;
		class?: string;
		/**
		 * Whether dots should have a glowing animation effect
		 */
		glow?: boolean;
	}

	let {
		width = 16,
		height = 16,
		x = 0,
		y = 0,
		cx = 1,
		cy = 1,
		cr = 1,
		class: className,
		glow = false,
		...props
	}: DotPatternProps = $props();

	const id = $props.id();
	let containerRef: SVGSVGElement | null = $state(null);
	let dimensions = $state({ width: 0, height: 0 });

	onMount(() => {
		const updateDimensions = () => {
			if (containerRef) {
				const rect = containerRef.getBoundingClientRect();
				dimensions = { width: rect.width, height: rect.height };
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	});

	const dots = $derived(
		Array.from(
			{
				length: Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height),
			},
			(_, i) => {
				const col = i % Math.ceil(dimensions.width / width);
				const row = Math.floor(i / Math.ceil(dimensions.width / width));
				return {
					x: col * width + cx,
					y: row * height + cy,
					delay: Math.random() * 5,
					duration: Math.random() * 3 + 2,
				};
			}
		)
	);
</script>

<svg
	bind:this={containerRef}
	aria-hidden="true"
	class={cn("pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80", className)}
	{...props}
>
	<defs>
		<radialGradient id={`${id}-gradient`}>
			<stop offset="0%" stop-color="currentColor" stop-opacity="1" />
			<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
		</radialGradient>
	</defs>
	{#each dots as dot (dot.x + "-" + dot.y)}
		<motion.circle
			cx={dot.x}
			cy={dot.y}
			r={cr}
			fill={glow ? `url(#${id}-gradient)` : "currentColor"}
			initial={glow ? { opacity: 0.4, scale: 1 } : {}}
			animate={glow
				? {
						opacity: [0.4, 1, 0.4],
						scale: [1, 1.5, 1],
					}
				: {}}
			transition={glow
				? {
						duration: dot.duration,
						repeat: Infinity,
						repeatType: "reverse",
						delay: dot.delay,
						ease: "easeInOut",
					}
				: {}}
		/>
	{/each}
</svg>
