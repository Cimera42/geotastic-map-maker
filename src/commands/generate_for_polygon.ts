import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {Point} from '../lib/geometry/common';
import {getBounds, insideComplex} from '../lib/geometry/point_inside';
import {generateGridPoints} from '../lib/geometry/bounds_grid';
import {exportDropsCSV} from '../lib/geotastic/drops_csv';

const logger = new Logger('Polygon');

// const polygon: Point[] = [
//     {lng: 150.2600098, lat: -33.7757229},
//     {lng: 150.5662537, lat: -33.7974088},
//     {lng: 150.629425, lat: -34.1197632},
//     {lng: 150.8127594, lat: -34.1453397},
//     {lng: 150.8972168, lat: -34.0680184},
//     {lng: 150.9294891, lat: -33.9812322},
//     {lng: 150.9813309, lat: -33.9880645},
//     {lng: 150.9469986, lat: -34.048677},
//     {lng: 150.9734344, lat: -34.0717155},
//     {lng: 150.9919739, lat: -34.1015709},
//     {lng: 151.2034607, lat: -34.1004337},
//     {lng: 151.3435364, lat: -33.9650033},
//     {lng: 151.54953, lat: -33.3368387},
//     {lng: 151.2680054, lat: -33.2622309},
//     {lng: 151.1416626, lat: -33.285194},
//     {lng: 150.6678772, lat: -33.3867329},
//     {lng: 150.308075, lat: -33.4784176},
//     {lng: 150.2545166, lat: -33.5871673},
//     {lng: 150.2558899, lat: -33.7722983},
// ];

async function loadPolygonFromCSV(path: string): Promise<Point[]> {
    const rawPolygonPoints = await fs.readFile(path, 'utf8');
    // TODO optional CSV headers
    const parsedPolygonPoints = rawPolygonPoints
        .split('\n')
        .filter((v) => v)
        .slice(1)
        .map((line): Point => {
            const parts = line.split(',');
            return {
                lat: parseFloat(parts[0]),
                lng: parseFloat(parts[1]),
            };
        });

    logger.info(`Loaded polygon with ${parsedPolygonPoints.length} points.`);

    return parsedPolygonPoints;
}

interface Args {
    inputPath: string;
    outputFilepath?: string;
    gap: number;
    name: string;
}

async function generateForPolygon(args: Args): Promise<void> {
    try {
        const polygon = await loadPolygonFromCSV(args.inputPath);
        const bounds = getBounds(polygon);

        const points = generateGridPoints(bounds, args.gap);
        const filteredPoints = points.filter((p) => insideComplex(polygon, p));

        const drops = await generateDrops(filteredPoints);
        await exportDropsCSV(drops, {
            name: args.name,
            outputFilepath: args.outputFilepath,
        });
    } catch (e) {
        logger.exception(e);
        return;
    }
}

export default generateForPolygon;
