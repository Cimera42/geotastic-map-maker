import {BoundingBox} from '../lib/geometry/common';
import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {generateGridPoints} from '../lib/geometry/bounds_grid';
import {exportDropsCSV} from '../lib/geotastic/drops_csv';

const logger = new Logger('Bounds');

async function loadBoundsFromJSON(path: string): Promise<BoundingBox> {
    const rawBoundsJSON = await fs.readFile(path, 'utf8');
    const bounds: BoundingBox = JSON.parse(rawBoundsJSON);

    logger.info(`Loaded bounding box.`);

    return bounds;
}

interface Args {
    inputPath: string;
    outputFilepath?: string;
    gap: number;
    name?: string;
}

async function generateForBox(args: Args): Promise<void> {
    try {
        const bounds = await loadBoundsFromJSON(args.inputPath);
        const points = generateGridPoints(bounds, args.gap);

        const drops = await generateDrops(points);
        await exportDropsCSV(drops, {
            name: args.name,
            outputFilepath: args.outputFilepath,
        });
    } catch (e) {
        logger.exception(e);
        return;
    }
}

export default generateForBox;
