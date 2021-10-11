import {StreetviewResponse} from '../google/streetview';
import {promises as fs} from 'fs';
import Logger from '../log';

const logger = new Logger('DropsCSV');

type Drop = [
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
    // TODO dont hardcode country, work out what 0's are
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

export async function exportDropsCSV(drops: Drop[]): Promise<void> {
    try {
        await fs.mkdir('./output', {recursive: true});
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    const csvString = drops.map((drop) => drop.join(',')).join('\n');

    const filename = `${getDateTimeString()}-drops.csv`;
    const filePath = `./output/${filename}`;
    await fs.writeFile(filePath, csvString, 'utf-8');

    logger.info(`Wrote ${drops.length} drops to '${filePath}'`);
}
