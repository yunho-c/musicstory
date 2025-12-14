<script lang="ts">
	import type { GameMap, Hotspot } from '$lib/data/types';

	export let map: GameMap;
	export let selectedHotspotId: string | null = null;
	export let onSelect: (h: Hotspot) => void;

	const handleKey = (event: KeyboardEvent, hotspot: Hotspot) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(hotspot);
		}
	};
</script>

<svg viewBox={`0 0 ${map.width} ${map.height}`} class="minimap">
	<image href={map.image} width={map.width} height={map.height} />

	{#each map.hotspots as hotspot (hotspot.id)}
		<circle
			cx={hotspot.x}
			cy={hotspot.y}
			r={hotspot.r}
			class="hotspot"
			class:selected={hotspot.id === selectedHotspotId}
			role="button"
			tabindex="0"
			aria-label={hotspot.label}
			on:click={() => onSelect(hotspot)}
			on:keydown={(event) => handleKey(event, hotspot)}
		>
			<title>{hotspot.label}</title>
		</circle>
	{/each}
</svg>

<style>
	.minimap {
		width: 100%;
		height: auto;
		display: block;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.hotspot {
		fill: transparent;
		stroke: rgba(255, 255, 255, 0.35);
		stroke-width: 2;
		cursor: pointer;
		vector-effect: non-scaling-stroke;
		transition: stroke 140ms ease, filter 140ms ease;
	}

	.hotspot:hover {
		stroke: rgba(255, 255, 255, 0.9);
		filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
	}

	.hotspot.selected {
		stroke: rgba(0, 255, 255, 0.9);
		filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.4));
	}
</style>
