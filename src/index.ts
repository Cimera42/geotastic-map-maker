function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function coordinateToTile(lat, lng, zoom) {
    const latRad = toRadians(lat);
    const n = 2.0 ** zoom;
    const xTile = Math.floor(((lng + 180.0) / 360.0) * n);
    const yTile = Math.floor(
        ((1.0 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2.0) * n
    );
    return {x: xTile, y: yTile, zoom};
}

function main() {
    const tile = coordinateToTile(-33.694393184522525, 150.88371401485148, 17);
    console.log(tile);
}

main();
