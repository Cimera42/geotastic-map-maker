import {batchSize, streetviewDistance} from '../lib/consts';
import {Point} from '../lib/geometry/common';
import {Drop} from '../lib/geotastic/drops_csv';
import {getStreetview, StreetviewResponse} from '../lib/google/streetview';
import Logger from '../lib/log';
import {arrayChunks} from '../lib/utils';

const logger = new Logger('GenerateDrops');

/**
 * Convert Street View data into a Geotastic Drop CSV row
 * @param streetview Response from Street View Metadata API
 * @returns Formatted drop
 */
export function streetviewToDrop(streetview: StreetviewResponse): Drop {
    // TODO dont hardcode country
    return [
        streetview.location.lat,
        streetview.location.lng,
        'au',
        '0',
        '',
        0,
        0,
        0,
        streetview.pano_id,
    ];
}

/**
 * Locate Street Views for a list of points and convert into Geotastic Drops
 * @param dropPoints List of points to find Street Views for
 * @returns List of Geotastic Drops
 */
export default async function generateDrops(dropPoints: Point[]): Promise<Drop[]> {
    let streetViews: StreetviewResponse[] = [];
    const batches = arrayChunks(batchSize, dropPoints);

    for (let i = 0; i < batches.length; i++) {
        try {
            const batch = batches[i];

            const lower = i * batchSize;
            const upper = lower + batch.length - 1;
            logger.info(`Getting batch ${i} (${lower} - ${upper})`);

            const batchResult = await Promise.all(
                batch.map(async (point, i) => {
                    try {
                        return await getStreetview(point, streetviewDistance);
                    } catch (e) {
                        logger.error(`Problem fetching point ${i}`);
                        throw e;
                    }
                })
            );
            streetViews = streetViews.concat(batchResult);
        } catch (e) {
            logger.exception(e);
            i--;
        }
    }

    const filtered = streetViews.filter((sv) => sv.status === 'OK');
    const drops = filtered.map(streetviewToDrop);

    return drops;
}
