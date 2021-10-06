import {Point} from '../geometry/common';
import axios from 'axios';
import settings from '../../../settings.json'; // TODO move me up

// copyright	"© Google"
// date	"2020-11"
// location
// lat	-33.69424896768029
// lng	150.8840044588816
// pano_id	"QERs5iaa6q4xmIkP-QAemw"
// status	"OK"

// ?location=-33.694393184522525,150.88371401485148&radius=2000&key=AIzaSyDL0PpDsfWrJ7T34IhDgX_XXr4khvTDPjM

export interface StreetviewResponse {
    copyright: string;
    date: string;
    location: Point;
    pano_id: string;
    status: string; // OK | ZERO_RESULTS | REQUEST_DENIED
}

export async function getPanorama(location: Point, radius: number): Promise<StreetviewResponse> {
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
