import {BoundingBox} from '../lib/geometry/common';
import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {generateGridPoints} from '../lib/geometry/bounds_grid';
import {exportDropsCSV} from '../lib/geotastic/drops_csv';
import path from 'path';

const logger = new Logger('Bounds');

async function loadBoundsFromJSON(filepath: string): Promise<BoundingBox> {
    const rawBoundsJSON = await fs.readFile(filepath, 'utf8');
    try {
        const bounds: BoundingBox = JSON.parse(rawBoundsJSON);

        logger.info(`Loaded bounding box.`);

        return bounds;
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new Error(
                `Malformed JSON ('${path.basename(
                    filepath
                )}'), see 'bounds.template.json' or README.md for the correct format.`
            );
        } else {
            throw e;
        }
    }
}

interface BoxArgs {
    inputPath: string;
    outputFilepath?: string;
    gap: number;
    name?: string;
}

async function generateForBox(args: BoxArgs): Promise<void> {
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
