import {promises as fs} from 'fs';
import Logger from '../log';
import path from 'path';
import {getFormattedDate} from '../utils';

const logger = new Logger('DropsCSV');

type BoolInt = 0 | 1;
export type Drop = [
    id: number,
    lat: number,
    lng: number,
    countryCode: string,
    subCode: string,
    wikipediaPageId: string,
    title: string,
    pitch: number,
    heading: number,
    zoom: number,
    panoramaId: string,
    hideCompass: BoolInt,
    isLandmarkTip: BoolInt,
    active: BoolInt
];
const CsvHeaders = [
    'id',
    'lat',
    'lng',
    'code',
    'subCode',
    'wikiId',
    'title',
    'pitch',
    'heading',
    'zoom',
    'panoId',
    'hideCompass',
    'isLandmarkTip',
    'active',
];

function getFilenameDatetime(): string {
    return getFormattedDate(new Date(), 'YMD_hm');
}

/**
 * Export list of Geotastic drops to CSV
 * @param drops List of drops
 * @param options Options for output file
 */
export async function exportDropsCSV(
    drops: Drop[],
    options: {
        name?: string;
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

    const csvString = `${CsvHeaders.join(',')}\n${drops.map((drop) => drop.join(',')).join('\n')}`;

    const filename = options.outputFilepath
        ? path.basename(options.outputFilepath)
        : `${getFilenameDatetime()}-${options.name || 'drops'}.csv`;
    const filePath = path.join(dirname, filename);
    await fs.writeFile(filePath, csvString, 'utf-8');

    logger.info(`Wrote ${drops.length} drops to '${filePath}'`);
}
