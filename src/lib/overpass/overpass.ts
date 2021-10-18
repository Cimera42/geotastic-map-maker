import axios, {AxiosResponse, AxiosError} from 'axios';

const api = 'https://lz4.overpass-api.de/api/interpreter';

export namespace Overpass {
    export interface OverpassBaseResponse {
        version: number;
        generator: string;
        osm3s: {
            timestamp_osm_base: string;
            copyright: string;
        };
    }

    export interface OverpassResponse<T> extends OverpassBaseResponse {
        elements: T[];
    }

    export interface RelationElement<T> {
        type: 'relation';
        id: number;
        bounds: {
            minlat: number;
            minlon: number;
            maxlat: number;
            maxlon: number;
        };
        members: T[];
        tags: Tags;
    }

    export interface Geometry {
        lat: number;
        lon: number;
    }

    export interface Node {
        type: 'node';
        ref: number;
        role: string;
        lat: number;
        lon: number;
    }

    export interface Way {
        type: 'way';
        ref: number;
        role: string;
        geometry: Geometry[];
    }

    export interface Relation {
        type: 'relation';
        ref: number;
        role: string;
    }

    export interface Tags {
        type: string;
        [key: string]: string;
    }
}

export const query = async (
    overpassQL: string
): Promise<
    AxiosResponse<
        Overpass.OverpassResponse<
            Overpass.Node | Overpass.Way | Overpass.RelationElement<Overpass.Way>
        >
    >
> => {
    return await axios.post<
        string,
        AxiosResponse<
            Overpass.OverpassResponse<
                Overpass.Node | Overpass.Way | Overpass.RelationElement<Overpass.Way>
            >
        >
    >(api, `data=${encodeURIComponent('[out:json];' + overpassQL)}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;',
        },
    });
};

export const caughtQuery: typeof query = async (overpassQL) => {
    try {
        return await query(overpassQL);
    } catch (e) {
        if (e.isAxiosError) {
            const error: AxiosError = e;
            throw new Error(
                `Overpass query failed with status ${
                    error.response?.status ?? '<No Status>'
                }\nResponse: ${error.response?.data ?? '<No Response>'}`
            );
        } else {
            throw e;
        }
    }
};
