export type Track = {
	id: string;
	title: string;
	src: string;
	loop?: boolean;
	loopStart?: number;
	loopEnd?: number;
};

export type Hotspot = {
	id: string;
	label: string;
	x: number;
	y: number;
	r: number;
	trackId: string;
};

export type GameMap = {
	id: string;
	name: string;
	image: string;
	width: number;
	height: number;
	hotspots: Hotspot[];
};
