import {StreetviewResponse} from '../google/streetview';
import {promises as fs} from 'fs';
import Logger from '../log';
import path from 'path';

const logger = new Logger('DropsCSV');

export type Drop = [
    lat: number,
    lng: number,
    countryCode: string,
    wikipediaPageId: string,
    title: string,
    heading: number,
    pitch: number,
    zoom: number,
    panoramaId: string
];

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

function getDateTimeString(): string {
    const now = new Date();

    const yr = now.getFullYear();
    const mth = now.getMonth().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hrs = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');

    return `${yr}${mth}${day}_${hrs}${min}`;
}

export async function exportDropsCSV(
    drops: Drop[],
    options: {
        name: string;
        outputFilepath?: string;
    }
): Promise<void> {
    const dirname = options.outputFilepath ? path.dirname(options.outputFilepath) : './output';
    try {
        await fs.mkdir(dirname, {
            recursive: true,
        });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    const csvString = drops.map((drop) => drop.join(',')).join('\n');

    const filename = options.outputFilepath
        ? path.basename(options.outputFilepath)
        : `${getDateTimeString()}-${options.name || 'drops'}.csv`;
    const filePath = path.join(dirname, filename);
    await fs.writeFile(filePath, csvString, 'utf-8');

    logger.info(`Wrote ${drops.length} drops to '${filePath}'`);
}
