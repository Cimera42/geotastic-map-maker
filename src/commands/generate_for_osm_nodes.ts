import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {Point} from '../lib/geometry/common';
import {exportDropsCSV} from '../lib/geotastic/drops_csv';
import {caughtQuery, Overpass} from '../lib/overpass/overpass';
import {plural} from '../lib/utils';

const logger = new Logger('OSMNodes');

async function loadPointsFromOSM(filepath: string): Promise<Point[]> {
    logger.info(`Querying Overpass for nodes with ${filepath}`);

    const rawQuery = await fs.readFile(filepath, 'utf8');

    const response = await caughtQuery(rawQuery);
    const nodes = response.data.elements.filter(
        (element): element is Overpass.Node => element.type === 'node'
    );
    if (!nodes) {
        throw new Error(`No nodes found in results of '${filepath}' query.`);
    }

    const points = nodes.map((v): Point => ({lat: v.lat, lng: v.lon}));

    logger.info(`Loaded ${points.length} point${plural(points.length)} from OSM nodes.`);

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
