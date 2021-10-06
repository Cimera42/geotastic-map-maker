import {generateGridPoints} from './lib/geometry/bounds_grid';
import {exportDropsCSV, streetviewToDrop} from './lib/geotastic/drops_csv';
import {getPanorama, StreetviewResponse} from './lib/google/streetview';

function nowString(date: Date) {
    return '[' + date.toLocaleString('en-au', {hour12: false}) + ']';
}

function arrayChunks<T>(chunkSize: number, array: T[]): T[][] {
    const chunks: T[][] = [];
    let i: number;
    let j: number;
    for (i = 0, j = array.length; i < j; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function main() {
    // const tile = coordinateToTile(-33.694393184522525, 150.88371401485148, 17);
    // console.log(tile);,
    // const response = await getPanorama({lat: -33.694993, lng: 150.882269}, 50);
    // console.log(response);

    const points = generateGridPoints();

    let streetViews: StreetviewResponse[] = [];
    const batches = arrayChunks(20, points);

    for (let i = 0; i < batches.length; i++) {
        try {
            console.log(`${nowString(new Date())} Getting batch ${i}`);
            const batch = batches[i];
            const batchResult = await Promise.all(
                batch.map(async (point, i) => {
                    try {
                        return await getPanorama(point, 50);
                    } catch (e) {
                        console.error(`Problem fetching point ${i}`);
                        throw e;
                    }
                })
            );
            streetViews = streetViews.concat(batchResult);
        } catch (e) {
            i--;
        }
    }

    // const streetViews = await Promise.all(
    //     points.map(async (point, i) => {
    //         if (i % 25 === 0) {
    //             console.log(`${nowString(new Date())} Getting point ${i}`);
    //         }
    //         try {
    //             return await getPanorama(point, 50);
    //         } catch (e) {
    //             console.error(`Problem fetching point ${i}`);
    //         }
    //     })
    // );
    const filtered = streetViews.filter((sv) => sv.status === 'OK');
    const drops = filtered.map(streetviewToDrop);
    // TODO could do incremental output
    await exportDropsCSV(drops);
}

main();
