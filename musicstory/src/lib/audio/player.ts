import { browser } from '$app/environment';
import type { Track } from '$lib/data/types';

type CachedTrack = {
	buffer: AudioBuffer;
};

export class AudioPlayer {
	private ctx: AudioContext | null = null;
	private master: GainNode | null = null;

	private currentSource: AudioBufferSourceNode | null = null;
	private currentGain: GainNode | null = null;

	private cache = new Map<string, CachedTrack>();

	volume = 0.8;

	private ensureContext = async () => {
		if (!browser) return;
		if (this.ctx) return;

		this.ctx = new AudioContext();
		this.master = this.ctx.createGain();
		this.master.gain.value = this.volume;
		this.master.connect(this.ctx.destination);

		if (this.ctx.state === 'suspended') {
			await this.ctx.resume();
		}
	};

	setVolume(value: number) {
		this.volume = Math.max(0, Math.min(1, value));
		if (this.master) {
			this.master.gain.value = this.volume;
		}
	}

	private async load(track: Track) {
		if (!this.ctx) throw new Error('Audio context not initialized');

		const cached = this.cache.get(track.id);
		if (cached) return cached.buffer;

		const response = await fetch(track.src);
		const arr = await response.arrayBuffer();
		const buffer = await this.ctx.decodeAudioData(arr);

		this.cache.set(track.id, { buffer });
		return buffer;
	}

	async play(track: Track, fadeSeconds = 0.6) {
		await this.ensureContext();
		if (!this.ctx || !this.master) return;

		const buffer = await this.load(track);

		const source = this.ctx.createBufferSource();
		source.buffer = buffer;

		if (track.loop) {
			source.loop = true;
			if (track.loopStart != null) source.loopStart = track.loopStart;
			if (track.loopEnd != null) source.loopEnd = track.loopEnd;
		}

		const gain = this.ctx.createGain();
		gain.gain.value = 0;

		source.connect(gain);
		gain.connect(this.master);

		const now = this.ctx.currentTime;

		if (this.currentGain && this.currentSource) {
			this.currentGain.gain.cancelScheduledValues(now);
			this.currentGain.gain.setValueAtTime(this.currentGain.gain.value, now);
			this.currentGain.gain.linearRampToValueAtTime(0, now + fadeSeconds);

			const previous = this.currentSource;
			setTimeout(() => {
				try {
					previous.stop();
				} catch (error) {
					console.error('Failed to stop previous track', error);
				}
			}, Math.ceil(fadeSeconds * 1000) + 50);
		}

		gain.gain.setValueAtTime(0, now);
		gain.gain.linearRampToValueAtTime(1, now + fadeSeconds);

		source.start();

		this.currentSource = source;
		this.currentGain = gain;
	}

	stop(fadeSeconds = 0.4) {
		if (!this.ctx || !this.currentGain || !this.currentSource) return;

		const now = this.ctx.currentTime;
		this.currentGain.gain.cancelScheduledValues(now);
		this.currentGain.gain.setValueAtTime(this.currentGain.gain.value, now);
		this.currentGain.gain.linearRampToValueAtTime(0, now + fadeSeconds);

		const source = this.currentSource;
		setTimeout(() => {
			try {
				source.stop();
			} catch (error) {
				console.error('Failed to stop track', error);
			}
		}, Math.ceil(fadeSeconds * 1000) + 50);

		this.currentSource = null;
		this.currentGain = null;
	}
}
