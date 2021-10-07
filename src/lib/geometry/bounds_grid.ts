import {BoundingBox, Point} from './common';

const SYDNEY_BOUNDS: BoundingBox = {
    minLat: -34.083175,
    minLon: 150.686692,
    maxLat: -33.671119,
    maxLon: 151.160498,
};

const GRID_POINT_COUNT = 100;

export function generateGridPoints(bounds = SYDNEY_BOUNDS, pointCount = GRID_POINT_COUNT): Point[] {
    // Use longitude to calculate spacing interval for points
    // TODO: Maybe use a fixed interval distance than a dynamic one
    const interval = (bounds.maxLon - bounds.minLon) / pointCount;

    // Starting from { lat: minLat, lng: minLon }, generate approximately GRID_POINT_COUNT * GRID_POINT_COUNT points
    const points: Point[] = [];
    for (let curLon = bounds.minLon; curLon <= bounds.maxLon; curLon += interval) {
        for (let curLat = bounds.minLat; curLat <= bounds.maxLat; curLat += interval) {
            points.push({lat: curLat, lng: curLon});
        }
    }

    return points;
}
