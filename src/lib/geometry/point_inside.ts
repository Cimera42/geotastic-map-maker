import {BoundingBox, CrossingDirection, Point} from './common';

const sideOfLine = (p0: Point, p1: Point, point: Point) => {
    return (point.lat - p0.lat) * (p1.lng - p0.lng) - (point.lng - p0.lng) * (p1.lat - p0.lat);
};

export const insideConvex = (convex: Point[], point: Point): boolean => {
    let overallSide = false;
    convex.forEach((p, i) => {
        const side = sideOfLine(p, convex[(i + 1) % convex.length], point);

        if (side == 0) {
            return true;
        }

        if (i == 0) {
            overallSide = side > 0;
        } else if (side > 0 != overallSide) {
            return false;
        }
    });

    return true;
};

const crossingDirection = (p0: Point, p1: Point, point: Point): CrossingDirection => {
    if (point.lat >= p0.lat && point.lat < p1.lat) {
        return CrossingDirection.UPWARD;
    }
    if (point.lat >= p1.lat && point.lat < p0.lat) {
        return CrossingDirection.DOWNWARD;
    }
    return CrossingDirection.NOT_CROSSING;
};

export const insideComplex = (polygon: Point[], point: Point): boolean => {
    let windingOrder = 0;
    polygon.forEach((p, i) => {
        const side = sideOfLine(p, polygon[(i + 1) % polygon.length], point);
        if (side == 0) {
            return true;
        }

        const crossing = crossingDirection(p, polygon[(i + 1) % polygon.length], point);
        if (crossing != 0)
            if (crossing == CrossingDirection.DOWNWARD && side > 0) {
                windingOrder = windingOrder + 1;
            } else if (crossing == CrossingDirection.UPWARD && side < 0) {
                windingOrder = windingOrder - 1;
            }
    });

    return windingOrder != 0;
};

export const getBounds = (loop: Point[]): BoundingBox => {
    let minLat = loop[0].lat;
    let minLon = loop[0].lng;
    let maxLat = loop[0].lat;
    let maxLon = loop[0].lng;

    for (const p of loop) {
        if (p.lat < minLat) minLat = p.lat;
        if (p.lat > maxLat) maxLat = p.lat;
        if (p.lng < minLon) minLon = p.lng;
        if (p.lng > maxLon) maxLon = p.lng;
    }

    return {minLat, maxLat, minLon, maxLon};
};

export const pointInsideBounds = (bounds: BoundingBox, point: Point): boolean => {
    return (
        point.lat >= bounds.minLat &&
        point.lat <= bounds.maxLat &&
        point.lng >= bounds.minLon &&
        point.lng <= bounds.maxLon
    );
};
