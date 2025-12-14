import type { GameMap } from './types';

export const maps: GameMap[] = [
	{
		id: 'henesys',
		name: 'Henesys',
		image: '/maps/henesys.svg',
		width: 512,
		height: 384,
		hotspots: [
			{ id: 'henesys-market', label: 'Market', x: 210, y: 160, r: 14, trackId: 'bgm_henesys' },
			{ id: 'henesys-park', label: 'Park', x: 90, y: 240, r: 12, trackId: 'bgm_ellinia' },
			{ id: 'henesys-stable', label: 'Pet Stable', x: 360, y: 210, r: 10, trackId: 'bgm_kerning' }
		]
	},
	{
		id: 'kerning',
		name: 'Kerning City',
		image: '/maps/kerning.svg',
		width: 480,
		height: 320,
		hotspots: [
			{ id: 'kerning-taxi', label: 'Taxi', x: 120, y: 230, r: 12, trackId: 'bgm_kerning' },
			{ id: 'kerning-sewers', label: 'Sewers', x: 280, y: 260, r: 14, trackId: 'bgm_ellinia' },
			{ id: 'kerning-hideout', label: "Thieves' Hideout", x: 380, y: 120, r: 11, trackId: 'bgm_henesys' }
		]
	}
];

export const mapsById: Record<string, GameMap> = Object.fromEntries(
	maps.map((map): [string, GameMap] => [map.id, map])
);
