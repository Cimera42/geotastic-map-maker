import {generateGridPoints} from './lib/geometry/bounds_grid';
import {exportDropsCSV, streetviewToDrop} from './lib/geotastic/drops_csv';
import {getStreetview, StreetviewResponse} from './lib/google/streetview';

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
                        return await getStreetview(point, 50);
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

    const filtered = streetViews.filter((sv) => sv.status === 'OK');
    const drops = filtered.map(streetviewToDrop);
    // TODO could do incremental output
    await exportDropsCSV(drops);
}

main();
