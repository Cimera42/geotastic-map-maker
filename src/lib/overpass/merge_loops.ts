import {Overpass} from './overpass';

const compareLatLng = (a: Overpass.Geometry, b: Overpass.Geometry) =>
    a.lat === b.lat && a.lon === b.lon;

const mergeLoops = (members: Overpass.Way[]): Overpass.Geometry[][] => {
    const merged: Overpass.Geometry[][] = [];
    const processed: number[] = [];

    for (let i = 0; i < members.length; i++) {
        const list: Overpass.Geometry[] = [];
        let next = i;
        let invert = false;

        if (processed.indexOf(next) !== -1) {
            continue;
        }
        while (1) {
            let geom = members[next].geometry;
            if (invert) {
                geom = geom.reverse();
            }

            list.push(...geom.slice(next === i ? 0 : 1));
            processed.push(next);

            let toBeNext = members.findIndex(
                (_, otherIndex) =>
                    otherIndex !== next &&
                    compareLatLng(
                        members[next].geometry[members[next].geometry.length - 1],
                        members[otherIndex].geometry[0]
                    )
            );
            invert = false;
            if (toBeNext === -1) {
                toBeNext = members.findIndex(
                    (_, otherIndex) =>
                        otherIndex !== next &&
                        compareLatLng(
                            members[next].geometry[members[next].geometry.length - 1],
                            members[otherIndex].geometry[members[otherIndex].geometry.length - 1]
                        )
                );
                invert = true;
            }

            if (toBeNext === -1 || toBeNext === i) {
                break;
            }
            next = toBeNext;
        }
        if (list.length) {
            if (list.length > 1 && compareLatLng(list[0], list[list.length - 1])) {
                merged.push(list.slice(1));
            } else {
                merged.push(list);
            }
        }
    }

    return merged;
};

export default mergeLoops;
