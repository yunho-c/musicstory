import { error } from '@sveltejs/kit';
import { mapsById } from '$lib/data/maps';
import { tracksById } from '$lib/data/tracks';

export const load = ({ params }: { params: { id: string } }) => {
	const map = mapsById[params.id];
	if (!map) {
		throw error(404, 'Map not found');
	}

	return { map, tracksById };
};
