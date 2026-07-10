<script lang="ts">
	import { MoonStar, Sun } from '@lucide/svelte';
	import { Button } from '../ui/button/index.ts';
	import { toggleMode } from 'mode-watcher';
</script>

<Button variant="ghost" size="icon" onclick={toggleMode}>
	<Sun class="dark:hidden block" />
	<MoonStar class="hidden dark:block" />
</Button>
