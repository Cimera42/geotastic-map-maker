import {Point} from './common';

/**
 * Calculate the haversine distance between two points on the globe
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the two points in metres
 */
export function haversine_distance(p1: Point, p2: Point): number {
    const R = 6378.137; // Radius of earth in KM
    const dLat = (p2.lat * Math.PI) / 180 - (p1.lat * Math.PI) / 180;
    const dLon = (p2.lng * Math.PI) / 180 - (p1.lng * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.lat * Math.PI) / 180) *
            Math.cos((p2.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // meters
}
