import {BoundingBox} from '../lib/geometry/common';
import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {generateGridPoints} from '../lib/geometry/bounds_grid';

const logger = new Logger('Bounds');

async function loadBoundsFromJSON(path: string): Promise<BoundingBox> {
    const rawBoundsJSON = await fs.readFile(path, 'utf8');
    const bounds: BoundingBox = JSON.parse(rawBoundsJSON);

    logger.info(`Loaded bounding box.`);

    return bounds;
}

async function generateForBox(path: string, pointDistance: number): Promise<void> {
    try {
        const bounds = await loadBoundsFromJSON(path);
        const points = generateGridPoints(bounds, pointDistance);

        generateDrops(points);
    } catch (e) {
        logger.exception(e);
        return;
    }
}

export default generateForBox;
