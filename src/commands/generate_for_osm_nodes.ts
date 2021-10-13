import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {Point} from '../lib/geometry/common';
import {getBounds, insideComplex} from '../lib/geometry/point_inside';
import {generateGridPoints} from '../lib/geometry/bounds_grid';
import {exportDropsCSV} from '../lib/geotastic/drops_csv';
import {Overpass, query} from '../lib/overpass/overpass';

const logger = new Logger('OSMArea');

async function loadPointsFromOSM(filepath: string): Promise<Point[]> {
    const rawQuery = await fs.readFile(filepath, 'utf8');

    const response = await query(rawQuery);
    const nodes = response.data.elements.filter(
        (element): element is Overpass.Node => element.type === 'node'
    );
    if (!nodes) {
        throw new Error(`No boundary found in results of '${filepath}' query.`);
    }

    const points = nodes.map((v): Point => ({lat: v.lat, lng: v.lon}));

    logger.info(`Loaded ${points.length} point${points.length === 1 ? '' : 's'} from OSM nodes.`);

    return points;
}

interface OSMAreaArgs {
    inputPath: string;
    outputFilepath?: string;
    gap: number;
    name?: string;
}

async function generateForOSMNodes(args: OSMAreaArgs): Promise<void> {
    try {
        const points = await loadPointsFromOSM(args.inputPath);

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

export default generateForOSMNodes;
