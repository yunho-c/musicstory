<script lang="ts">
	import Minimap from '$lib/components/Minimap.svelte';
	import { audioPlayer } from '$lib/audio';
	import type { GameMap, Hotspot, Track } from '$lib/data/types';

	export let data: { map: GameMap; tracksById: Record<string, Track> };

	let selectedHotspotId: string | null = null;
	let nowPlaying: Track | null = null;
	let error: string | null = null;
	let isLoading = false;
	let volume = audioPlayer.volume;

	const onSelect = async (hotspot: Hotspot) => {
		selectedHotspotId = hotspot.id;
		const track = data.tracksById[hotspot.trackId];
		nowPlaying = track ?? null;

		if (!track) {
			error = 'Track not found for hotspot';
			return;
		}

		error = null;
		isLoading = true;

		try {
			await audioPlayer.play(track);
		} catch (err) {
			console.error('Unable to play track', err);
			error = 'Unable to play track. Check your audio file or browser permissions.';
		} finally {
			isLoading = false;
		}
	};

	const onStop = () => {
		audioPlayer.stop();
		nowPlaying = null;
	};

	const onVolumeChange = (value: number) => {
		volume = value;
		audioPlayer.setVolume(value);
	};
</script>

<svelte:head>
	<title>{data.map.name} | MusicStory</title>
</svelte:head>

<main class="page">
	<header class="header">
		<div>
			<a class="back" href="/">← Map list</a>
			<p class="eyebrow">Minimap</p>
			<h1>{data.map.name}</h1>
			<p class="sub">Click a hotspot to play its BGM.</p>
		</div>

		<div class="status">
			<p class="label">Now playing</p>
			<p class="track">{nowPlaying ? nowPlaying.title : 'None'}</p>
			{#if error}
				<p class="error">{error}</p>
			{:else if isLoading}
				<p class="sub">Loading audio…</p>
			{/if}
		</div>
	</header>

	<section class="content">
		<div class="panel">
			<Minimap map={data.map} {selectedHotspotId} onSelect={onSelect} />
		</div>

		<aside class="side">
			<div class="panel controls">
				<div class="control-row">
					<div>
						<p class="label">Volume</p>
						<p class="sub">Adjust the audio gain (client-side).</p>
					</div>
					<div class="volume">
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={volume}
							on:input={(event) => onVolumeChange(Number((event.target as HTMLInputElement).value))}
						/>
						<span>{Math.round(volume * 100)}%</span>
					</div>
				</div>

				<button class="ghost" on:click={onStop}>Stop playback</button>
			</div>

			<div class="panel list">
				<p class="label">Hotspots</p>
				<ul>
					{#each data.map.hotspots as hotspot}
						<li class:selected={hotspot.id === selectedHotspotId}>
							<button on:click={() => onSelect(hotspot)}>
								<span>{hotspot.label}</span>
								<small>{data.tracksById[hotspot.trackId]?.title ?? hotspot.trackId}</small>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</aside>
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
		padding: 2rem clamp(1rem, 3vw, 2rem) 3rem;
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.eyebrow {
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #67e8f9;
		font-weight: 700;
		font-size: 0.8rem;
		margin: 0.25rem 0 0;
	}

	.back {
		display: inline-flex;
		color: #cbd5e1;
		text-decoration: none;
		font-size: 0.95rem;
		margin-bottom: 0.25rem;
		transition: color 120ms ease;
	}

	.back:hover {
		color: #67e8f9;
	}

	h1 {
		margin: 0;
		font-weight: 800;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
	}

	.sub {
		margin: 0.2rem 0 0;
		color: #cbd5e1;
	}

	.status {
		padding: 0.9rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		min-width: 220px;
	}

	.label {
		margin: 0;
		font-weight: 700;
		color: #94a3b8;
		text-transform: uppercase;
		font-size: 0.8rem;
		letter-spacing: 0.05em;
	}

	.track {
		margin: 0.3rem 0 0;
		font-size: 1.2rem;
		font-weight: 700;
		color: #e2e8f0;
	}

	.error {
		margin: 0.35rem 0 0;
		color: #f87171;
		font-size: 0.95rem;
	}

	.content {
		display: grid;
		grid-template-columns: 3fr 1fr;
		gap: 1rem;
		align-items: start;
	}

	.panel {
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.03);
		padding: 1rem;
		box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.control-row {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	.volume {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.volume input[type='range'] {
		accent-color: #67e8f9;
	}

	button.ghost {
		padding: 0.65rem 0.9rem;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.06);
		color: #e2e8f0;
		border: 1px solid rgba(255, 255, 255, 0.12);
		cursor: pointer;
	}

	button.ghost:hover {
		border-color: rgba(103, 232, 249, 0.9);
	}

	.list ul {
		list-style: none;
		margin: 0.6rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.list li button {
		width: 100%;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		color: #e2e8f0;
		padding: 0.6rem 0.75rem;
		text-align: left;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.list li button:hover {
		border-color: rgba(103, 232, 249, 0.9);
	}

	.list li.selected button {
		border-color: rgba(103, 232, 249, 0.9);
		box-shadow: 0 0 0 2px rgba(103, 232, 249, 0.15);
	}

	.list span {
		font-weight: 700;
	}

	.list small {
		color: #94a3b8;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 960px) {
		.content {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.page {
			padding: 1.5rem 1rem 2rem;
		}
	}
</style>
