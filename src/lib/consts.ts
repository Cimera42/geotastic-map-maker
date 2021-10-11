export const batchSize = 50;
export const streetviewDistance = 50;
export const defaultGap = 500;

export const shapeTypes = ['box', 'polygon'] as const;
export const shapeTypesString = shapeTypes.map((v) => `'${v}'`).join(', ');
export type ShapeType = typeof shapeTypes[number];
