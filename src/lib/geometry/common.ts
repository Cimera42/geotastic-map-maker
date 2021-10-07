export type Point = {
    lat: number;
    lng: number;
};
export type SmallPoint = [lat: number, lng: number];

export type BoundingBox = {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
};

export enum CrossingDirection {
    DOWNWARD = 1,
    UPWARD = -1,
    NOT_CROSSING = 0,
}

export type BoundsFile = Record<string, CountryBoundary>;

export interface CountryBoundary {
    country: string;
    loops: {
        bb: BoundingBox;
        p: SmallPoint[];
    }[];
}
