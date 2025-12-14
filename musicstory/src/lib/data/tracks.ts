import type { Track } from './types';

export const tracks: Track[] = [
	{
		id: 'bgm_henesys',
		title: 'Henesys',
		src: '/audio/henesys.wav',
		loop: true
	},
	{
		id: 'bgm_ellinia',
		title: 'Ellinia',
		src: '/audio/ellinia.wav',
		loop: true
	},
	{
		id: 'bgm_kerning',
		title: 'Kerning City',
		src: '/audio/kerning.wav',
		loop: true
	}
];

export const tracksById: Record<string, Track> = Object.fromEntries(
	tracks.map((track): [string, Track] => [track.id, track])
);
