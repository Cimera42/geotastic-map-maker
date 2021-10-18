/**
 * Constants used in various parts of the application
 */

// Size of batches to fetch from Street View API, to prevent hitting rate limit
export const batchSize = 50;

// Maximum distance to find street view near each point
export const streetviewDistance = 50;

// Default gap between generated grid points
export const defaultGap = 500;

// Source types for CLI
export const sourceTypes = ['box', 'polygon', 'osmarea', 'osmnodes'] as const;
export const sourceTypesString = sourceTypes.map((v) => `'${v}'`).join(', ');
export type SourceType = typeof sourceTypes[number];
