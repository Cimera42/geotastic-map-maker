import Logger from '../log';
import {BoundingBox, Point} from './common';
import {haversine_distance} from './distance';

const logger = new Logger('GridGen');

export function generateGridPoints(bounds: BoundingBox, pointDistance: number): Point[] {
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

    const horizontalCount = Math.floor(width / pointDistance);
    const horizontalInterval = (bounds.maxLon - bounds.minLon) / horizontalCount;
    const verticalCount = Math.floor(height / pointDistance);
    const verticalInterval = (bounds.maxLat - bounds.minLat) / verticalCount;

    logger.info(
        `Generating grid points with ${pointDistance}m gap:` +
            `\n\tDistance: ${Math.floor(width)}m x ${Math.floor(height)}m` +
            `\n\tCount: ${horizontalCount} x ${verticalCount} (${horizontalCount * verticalCount})`
    );

    // Starting from { lat: minLat, lng: minLon }, generate approximately points with pointDistance metres between them
    const points: Point[] = [];
    for (let curLon = bounds.minLon; curLon <= bounds.maxLon; curLon += horizontalInterval) {
        for (let curLat = bounds.minLat; curLat <= bounds.maxLat; curLat += verticalInterval) {
            points.push({lat: curLat, lng: curLon});
        }
    }

    return points;
}
