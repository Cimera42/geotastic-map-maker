import {ArgError} from 'arg';
import fs from 'fs';
import path from 'path';
import pathValidation from 'path-validation';
import {ShapeType, shapeTypes, shapeTypesString} from './consts';

/**
 * Validate argument is a valid shape
 * @param value
 * @returns
 */
export function validateShape(value: string): ShapeType {
    if (value === shapeTypes[0] || value === shapeTypes[1]) {
        return value;
    }
    throw new ArgError(`Shape must be one of [${shapeTypesString}].`, 'ARG_INVALID_CHOICE');
}

export function validateFileExists(value: string): string {
    const filepath = path.resolve(value);
    try {
        fs.accessSync(filepath, fs.constants.F_OK);
        try {
            fs.accessSync(filepath, fs.constants.R_OK);
        } catch (e) {
            throw new ArgError(`Cannot read file '${value}'.`, 'ARG_INVALID_FILE');
        }
    } catch (e) {
        throw new ArgError(`File '${value}' does not exist.`, 'ARG_INVALID_FILE');
    }
    return filepath;
}

export function validateCanCreateFile(value: string): string {
    const absolute = path.resolve(value);

    const isValidPath = pathValidation.isAbsolutePath(absolute, path.sep);
    if (!isValidPath) {
        throw new ArgError(`Invalid path to create file: '${value}'.`, 'ARG_INVALID_PATH');
    }

    return absolute;
}
