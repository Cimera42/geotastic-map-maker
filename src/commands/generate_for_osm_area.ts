import generateDrops from './generate_drops';
import {promises as fs} from 'fs';
import Logger from '../lib/log';
import {Point} from '../lib/geometry/common';
import {getBounds, insideComplex} from '../lib/geometry/point_inside';
import {generateGridPoints} from '../lib/geometry/bounds_grid';
import {exportDropsCSV} from '../lib/geotastic/drops_csv';
import {caughtQuery, Overpass} from '../lib/overpass/overpass';
import mergeLoops from '../lib/overpass/merge_loops';
import {digitCount, plural} from '../lib/utils';

const logger = new Logger('OSMArea');

async function loadPolygonsFromOSM(filepath: string): Promise<Point[][]> {
    logger.info(`Querying Overpass for areas with ${filepath}`);

    const rawQuery = await fs.readFile(filepath, 'utf8');

    const response = await caughtQuery(rawQuery);
    const boundaries = response.data.elements.filter(
        (element): element is Overpass.RelationElement<Overpass.Way> => element.type === 'relation'
    );
    if (!boundaries) {
        throw new Error(`No boundaries found in results of '${filepath}' query.`);
    }

    const boundariesWays = boundaries.map((boundary) =>
        boundary.members.filter(
            (member): member is Overpass.Way => member.type === 'way' && member.role === 'outer'
        )
    );

    const mergedBoundaries = boundariesWays.map((boundaryWays) => mergeLoops(boundaryWays));
    const polygons = mergedBoundaries.map((merged) =>
        merged.map((loop): Point[] => loop.map((v): Point => ({lat: v.lat, lng: v.lon})))
    );

    const sortedPolygons = polygons.flatMap((v) => v).sort((a, b) => b.length - a.length);

    const polyCnt = sortedPolygons.length;
    const digitLength = digitCount(polyCnt);
    logger.info(
        `Loaded ${polyCnt} polygon${plural(polyCnt)} from OSM area.${sortedPolygons
            .map(
                (p, i) =>
                    `\n\t${(i + 1).toString().padStart(digitLength, ' ')}: ${
                        p.length
                    } point${plural(p.length)}`
            )
            .join('')}`
    );

    return sortedPolygons;
}

interface OSMAreaArgs {
    inputPath: string;
    outputFilepath?: string;
    gap: number;
    name?: string;
}

async function generateForOSMArea(args: OSMAreaArgs): Promise<void> {
    try {
        const polygons = await loadPolygonsFromOSM(args.inputPath);

        const generatedPoints = polygons.reduce((prevPoints, polygon) => {
            const bounds = getBounds(polygon);

            const points = generateGridPoints(bounds, args.gap);
            const filteredPoints = points.filter((p) => insideComplex(polygon, p));
            logger.info(
                `Filtered ${points.length} to ${filteredPoints.length} point${plural(
                    filteredPoints.length
                )} with polygon shape.`
            );
            return [...prevPoints, ...filteredPoints];
        }, []);
        logger.info(
            `Overall there are ${generatedPoints.length} point${plural(generatedPoints.length)}`
        );

        const drops = await generateDrops(generatedPoints);
        await exportDropsCSV(drops, {
            name: args.name,
            outputFilepath: args.outputFilepath,
        });
    } catch (e) {
        logger.exception(e);
        return;
    }
}

export default generateForOSMArea;
