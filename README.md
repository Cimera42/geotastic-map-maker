# geotastic-map-maker
Scripts to generate maps for Geotastic.

# Instructions

1. Copy `settings.template.json` and name it `settings.json`
1. Add your Google API key in `settings.json`
   - Google Street View Static API must be enabled
1. Set your desired map boundary in `src/lib/geometry/bounds_grid.ts`
   - Top-left and bottom-right corner
1. Set your grid division count in `src/lib/geometry/bounds_grid.ts`
   - For a large map boundary, this should be increased to provide a good resolution of points
   - For a small map boundary, this should be reduced to prevent excessive points
   - Be aware, this number is squared so the total point count gets high quickly
1. Run with `yarn start`
1. Resulting `.csv` will be put into the `output` folder
1. This `.csv` can then be imported into Geotastic as a custom map (Supporter only)
   - Create a new map and right click -> Import
   
# Theory of operation

1. Generate a grid of points within the specified region
1. For each point, use the Google Street View Static Metadata API to find the nearest street view within a distance
   - For rate-limiting reasons, these are split into batches of 25
   - Documenation states this metadata API has no associated costs, but this has not been tested
1. Remove all points with no nearby street view
1. Export points to a `.csv` in Geotastic Drop format
