import Logger from '../log';
import {BoundingBox, Point} from './common';
import {haversine_distance} from './distance';

const logger = new Logger('GridGen');

export function generateGridPoints(bounds: BoundingBox, gap: number): Point[] {
    const height = haversine_distance(
        {
            lat: bounds.minLat,
            lng: bounds.minLon,
        },
        {
            lat: bounds.maxLat,
            lng: bounds.minLon,
        }
    );
    const width = haversine_distance(
        {
            lat: bounds.minLat,
            lng: bounds.minLon,
        },
        {
            lat: bounds.minLat,
            lng: bounds.maxLon,
        }
    );

    const horizontalCount = Math.ceil(width / gap);
    const horizontalInterval = (bounds.maxLon - bounds.minLon) / horizontalCount;
    const verticalCount = Math.ceil(height / gap);
    const verticalInterval = (bounds.maxLat - bounds.minLat) / verticalCount;

    logger.info(
        `Generating grid points with ${gap}m gap:` +
            `\n\tDistance: ${Math.floor(width)}m x ${Math.floor(height)}m` +
            `\n\tCount: ${horizontalCount} x ${verticalCount} (${horizontalCount * verticalCount})`
    );

    // Starting from { lat: minLat, lng: minLon }, generate points with <gap> metres between them
    const points: Point[] = [];
    for (let i = 0; i < horizontalCount; i++) {
        for (let j = 0; j < verticalCount; j++) {
            points.push({
                lat: bounds.minLat + verticalInterval * j,
                lng: bounds.minLon + horizontalInterval * i,
            });
        }
    }

    return points;
}
