import {StreetviewResponse} from '../google/streetview';
import {promises as fs} from 'fs';

type Drop = [
    lat: number,
    lng: number,
    countryCode: string,
    unknown1: 0,
    unknown2: '',
    unknown3: 0,
    unknown4: 0,
    panoramaId: string
];

export function streetviewToDrop(streetview: StreetviewResponse): Drop {
    // TODO dont hardcode country, work out what 0's are
    return [
        streetview.location.lat,
        streetview.location.lng,
        'au',
        0,
        '',
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

function nowString(date: Date) {
    return '[' + date.toLocaleString('en-au', {hour12: false}) + ']';
}

export async function exportDropsCSV(drops: Drop[]): Promise<void> {
    try {
        await fs.mkdir('./output');
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    const csvString = drops.map((drop) => drop.join(',')).join('\n');

    const filename = `${getDateTimeString()}-drops.csv`;
    const filePath = `./output/${filename}`;
    await fs.writeFile(filePath, csvString, 'utf-8');

    console.log(`${nowString(new Date())} Wrote drops to '${filePath}'`);
}
