import {Point} from '../geometry/common';
import axios from 'axios';
import settings from '../../../settings.json'; // TODO move me up

/*
    Example request and response for finding the nearest streetview to a set of coordinates

    Example URL: https://maps.googleapis.com/maps/api/streetview/metadata?location=-33.694393184522525,150.88371401485148&radius=2000&key=<apikey>

    Example response:
    {
        "copyright": "© Google",
        "date": "2020-11",
        "location": {
            "lat": -33.69424896768029,
            "lng": 150.8840044588816
        },
        "pano_id": "QERs5iaa6q4xmIkP-QAemw",
        "status": "OK"
    }
*/

export interface StreetviewResponse {
    copyright: string;
    date: string;
    location: Point;
    pano_id: string;
    status: string; // OK | ZERO_RESULTS | REQUEST_DENIED
}

/**
 * Get nearest streetview to coordinates
 * @param location Coordinates to search
 * @param radius Distance streetview must be within
 * @returns Response from Streetview Static API
 */
export async function getStreetview(location: Point, radius: number): Promise<StreetviewResponse> {
    const params = {
        location: `${location.lat},${location.lng}`,
        radius,
        key: settings.apiKey,
        source: 'OUTDOOR',
        preference: 'NEAREST',
    };
    const response = await axios.get<StreetviewResponse>(
        'https://maps.googleapis.com/maps/api/streetview/metadata',
        {
            params,
        }
    );
    return response.data;
}
