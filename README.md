# geotastic-map-maker

A script to generate maps files for importing into [Geotastic](https://geotastic.de/).

|Table of Contents|
|-|
|[Installation](#installation)|
|[Usage](#usage)|
|[Import into Geotastic](#import-into-geotastic)|
|[Theory of operation](#theory-of-operation)|

## Installation

1. Install [Node.js](https://nodejs.org)
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install)
3. Run `yarn install` in this project
4. Copy `settings.template.json` and name it `settings.json`
5. Add your Google API key in `settings.json`
   - Google Street View Static API must be enabled

## Usage

### Creating a boundary shape

Before running, a boundary shape must be created. The supported shapes are currently rectangular bounding box, and polygons.

Follow the below instructions to create your desired shape.

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
This file lists all the points of the polygon in order (clockwise / anti-clockwise both work).

An online tool such as https://www.keene.edu/campus/maps/tool/ can be used to create this list of points.

```csv
Longitude,Latitude
<longitude>, <latitude>
<longitude>, <latitude>
<longitude>, <latitude>
<longitude>, <latitude>
```

### Run script

Follow the above [instructions](#creating-a-boundary-shape) to create the shape file for map generation.

Run the script by specifying the shape and shape file:

```bash
yarn start --shape <box or polygon> --input <path to shape file>
```

There are a number of additional options that can be specified when running the script, found below.

**Script options**
| Option | Description | Required |
|--------|-|-|
| `--help`, `-h` | Shows the help message | No |
| `--version`, `-v` | Shows the script version | No |
| `--shape`, `-s` | Shape type to use<br/>`'box'` or `'polygon'` | Yes |
| `--input`, `-i` | Path to input shape file | Yes |
| `--output`, `-o` | Path to output drops CSV | No</br>*default:* `output/<date>_<time>-drops.csv` |
| `--name`, `-n` | Name to append to auto-generated output filename | No</br>*default:* `drops` |
| `--gap`, `-g` | Gap between grid points in metres | No</br>*default:* `100` (metres) |

**Examples:**

Create with a bounding box
```bash
# creates output/20211012_2246-Sydney.csv
yarn start --shape box --input ./input/box.template.json --gap 1000 --name Sydney
```

Create with a polygon
```bash
# creates output/custom_map.csv
yarn start --shape polygon --input ./input/polygon.template.csv --output ./output/custom_map.csv
```

## Import into Geotastic

*Creating custom maps is restricted to supporters of Geotastic.*

To create a custom map and import drop data:

1. Login to [Geotastic](https://geotastic.de)
2. Click on your profile in the top-right, and choose ["Custom Map Editor"](https://geotastic.de/custom-map-editor)
3. Click "CREATE NEW MAP" and enter the desired details
   - The overall size of the map is printed when the script runs. I'd recommended setting the `Default Distance Threshold` to half that size.
4. Right click the new map and select "Import drop data"
5. Choose the script-generated `.csv` file
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
