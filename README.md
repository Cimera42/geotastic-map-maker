# geotastic-map-maker

A script to generate maps files for importing into [Geotastic](https://geotastic.net/).

|Table of Contents|
|-|
|[Installation](#installation)|
|[Usage](#usage)|
|[Import into Geotastic](#import-into-geotastic)|
|[Theory of operation](#theory-of-operation)|
|[Attribution](#attribution)|

## ⚠️ Geotastic costs

To help Geotastic with reducing their Google API expenses, please set up a personal API key on your account. See the help page for more details and instructions: https://geotastic.net/help-out/own-api-key

Also consider [donating](https://geotastic.net/help-out/donations) to help out and get additional player slots for your games.

## Installation

1. Install [Node.js](https://nodejs.org)
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install)
3. Run `yarn install` in this project
4. Copy `settings.template.json` and name it `settings.json`
5. Add your Google API key in `settings.json`
   - Google Street View Static API must be enabled

## Usage

### Creating a data source

Before running, a data source must be created. The supported sources are:
- [Rectangular bounding box](#bounding-box)
- [Polygon](#polygon)
- [OpenStreetMap sources](#openstreetmap-sources)

Follow the below instructions to create your desired source.

#### Bounding Box

A sample bounding box file can be found in the `input` folder named `box.template.json`.
This file defines the top, bottom, left, and right of the bounding box in latitude and longitude.

```
{
    "minLat": <latitude of bottom of box>,
    "minLon": <longitude of left of box>,
    "maxLat": <latitude of top of box>,
    "maxLon": <longitude of right of box>
}
```

#### Polygon

A sample polygon file can be found in the `input` folder named `polygon.template.json`.
This file lists all the points of the polygon in order.

An online tool such as https://www.keene.edu/campus/maps/tool/ can be used to create this list of points.

```csv
Longitude,Latitude
<longitude>, <latitude>
<longitude>, <latitude>
<longitude>, <latitude>
<longitude>, <latitude>
```

#### OpenStreetMap sources

OpenStreetMap data is retrieved through the [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) and OverpassQL. The query is loaded from the input file, run and the results are parsed based on the configured source (area or nodes).

An online interpreter such as https://overpass-turbo.eu/ can be used to create and test queries.

##### Areas

A sample OSM areas query file can be found in the `input` folder named `osm_area.template.txt`.

The query used for input should return a one or more `relations`, each with a continuous boundary of `ways`.

##### Nodes

A sample OSM nodes query file can be found in the `input` folder named `osm_nodes.template.txt`.

The query used for input should return a one or more `nodes`.

### Run script

Follow the above [instructions](#creating-a-data-source) to create the source file for map generation.

Run the script by specifying the source type and source file:

```bash
yarn start --source <source type> --input <path to source file>
```

There are a number of additional options that can be specified when running the script, found below.

**Script options**
| Option | Description | Required |
|--------|-|-|
| `--help`, `-h` | Shows the help message | No |
| `--version`, `-v` | Shows the script version | No |
| `--source`, `-s` | Source type to use<br/>`'box'`, `'polygon'`, `'osmarea'` or `'osmnodes'` | Yes |
| `--input`, `-i` | Path to input source file | Yes |
| `--output`, `-o` | Path to output drops CSV | No</br>*default:* `output/<date>_<time>-drops.csv` |
| `--name`, `-n` | Name to append to auto-generated output filename | No</br>*default:* `drops` |
| `--gap`, `-g` | Gap between grid points in metres | No</br>*default:* `100` (metres) |

**Examples:**

Create with a bounding box
```bash
# creates output/20211012_2246-Sydney.csv
yarn start --source box --input ./input/box.template.json --gap 1000 --name Sydney
```

Create with a polygon
```bash
# creates output/custom_map.csv
yarn start --source polygon --input ./input/polygon.template.csv --output ./output/custom_map.csv
```

## Import into Geotastic

*Creating custom maps is restricted to supporters of Geotastic.*

To create a custom map and import drop data:

1. Login to [Geotastic](https://geotastic.net)
2. Click on your profile in the top-right, and choose ["Map Editor"](https://geotastic.net/map-editor/maps)
3. Click "CREATE NEW MAP" and enter the desired details
   - The overall size of the map is printed when the script runs. I'd recommended setting the `Default Distance Threshold` to half that size.
4. Right click the new map and select "Import drop data"
5. Choose the script-generated output `.csv` file
6. Choose to merge with or override the existing drops
   - Only matters if modifying an existing map
7. Due to a bug in Geotastic, the map needs to be manually updated by adding a new drop and deleting it
   - For whatever reason, the bounding box of a custom map is not updated after importing


## Theory of operation

1. Generate a grid of points within the specified region
2. For each point, use the Google Street View Static Metadata API to find the nearest street view within a distance
   - For rate-limiting reasons, these are split into batches
   - This Metadata API currently has no usage costs or limits
3. Remove all points with no nearby street view
4. Export points to a `.csv` in Geotastic Drop format

## Attribution

#### OpenStreetMap data
[© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

#### Google Street View Metadata
© Google
