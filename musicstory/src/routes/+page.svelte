<script lang="ts">
	import { maps } from '$lib/data/maps';
</script>

<svelte:head>
	<title>MusicStory | Map BGM Explorer</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<div>
			<p class="eyebrow">Prototype</p>
			<h1>MapleStory-style minimap with click-to-play BGMs</h1>
			<p class="lede">
				Pick a map, click a hotspot, and hear its track. Assets are served from <code>static/</code>;
				swap in your own minimaps and audio when you are ready.
			</p>
		</div>
	</section>

	<section class="grid">
		{#each maps as map}
			<a class="card" href={`/map/${map.id}`}>
				<div class="thumb" style={`aspect-ratio: ${map.width} / ${map.height}`}>
					<img src={map.image} alt={`${map.name} minimap`} loading="lazy" />
				</div>
				<div class="card-body">
					<p class="map-name">{map.name}</p>
					<p class="map-meta">{map.hotspots.length} hotspots · {map.width}×{map.height}</p>
				</div>
			</a>
		{/each}
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Space Grotesk', 'Sora', 'Inter', system-ui, -apple-system, BlinkMacSystemFont,
			'Segoe UI', sans-serif;
		background: radial-gradient(circle at 10% 10%, #1e293b, #0f172a 45%);
		color: #e2e8f0;
	}

	.page {
		min-height: 100vh;
		padding: 3rem clamp(1rem, 3vw, 2rem) 4rem;
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.hero {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.eyebrow {
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #67e8f9;
		font-weight: 700;
		font-size: 0.85rem;
		margin: 0;
	}

	h1 {
		margin: 0;
		font-weight: 800;
		color: #e2e8f0;
		line-height: 1.1;
	}

	.lede {
		margin: 0;
		color: #cbd5e1;
		max-width: 60ch;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.1rem;
	}

	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		text-decoration: none;
		color: inherit;
		overflow: hidden;
		box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
		transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
		display: flex;
		flex-direction: column;
	}

	.card:hover {
		border-color: rgba(103, 232, 249, 0.9);
		transform: translateY(-2px);
		box-shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
	}

	.thumb {
		background: linear-gradient(120deg, rgba(103, 232, 249, 0.12), rgba(59, 130, 246, 0.12));
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: saturate(1.1);
	}

	.card-body {
		padding: 0.9rem 1rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.map-name {
		margin: 0;
		font-weight: 700;
		color: #e2e8f0;
	}

	.map-meta {
		margin: 0;
		color: #94a3b8;
		font-size: 0.95rem;
	}

	@media (max-width: 640px) {
		.page {
			padding: 1.5rem 1rem 2rem;
		}
	}
</style>
