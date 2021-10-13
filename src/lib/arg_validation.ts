import {ArgError} from 'arg';
import fs from 'fs';
import path from 'path';
import pathValidation from 'path-validation';
import {ShapeType, shapeTypes, shapeTypesString} from './consts';

/**
 * Validate argument is a valid shape
 * @param value Shape name to validate
 * @returns Valid shape
 */
export function validateShape(value: string): ShapeType {
    for (let i = 0; i < shapeTypes.length; i++) {
        if (value === shapeTypes[i]) {
            return value;
        }
    }
    throw new ArgError(`Shape must be one of [${shapeTypesString}].`, 'ARG_INVALID_CHOICE');
}

/**
 * Validate a given file exists and can be read
 * @param value File path to check
 * @returns Valid file path
 */
export function validateFileExists(value: string): string {
    const filepath = path.resolve(value);

    try {
        fs.accessSync(filepath, fs.constants.R_OK);
    } catch (e) {
        if (e.code === 'ENOENT') {
            throw new ArgError(`File '${value}' does not exist.`, 'ARG_INVALID_FILE');
        } else {
            throw new ArgError(`Cannot read file '${value}'.`, 'ARG_INVALID_FILE');
        }
    }

    try {
        const stats = fs.statSync(filepath);
        if (!stats.isFile()) {
            throw new ArgError(`'${value}' is a directory, not a file.`, 'ARG_PROVIDED_DIRECTORY');
        }
    } catch (e) {
        throw e;
    }

    return filepath;
}

/**
 * Validate that the filepath is valid
 * @param value File path to check
 * @returns Valid file path
 */
export function validateCanCreateFile(value: string): string {
    const absolute = path.resolve(value);

    const isValidPath = pathValidation.isAbsolutePath(absolute, path.sep);
    if (!isValidPath) {
        throw new ArgError(`Invalid path to create file: '${value}'.`, 'ARG_INVALID_PATH');
    }

    return absolute;
}
