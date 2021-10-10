import arg, {ArgError} from 'arg';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import generateForBox from './commands/generate_for_box';
import generateForPolygon from './commands/generate_for_polygon';
import {defaultGap} from './lib/consts';
import Logger from './lib/log';

const logger = new Logger('Index');

const shapeTypes = ['box', 'polygon'] as const;
const shapeTypesString = shapeTypes.map((v) => `'${v}'`).join(', ');
type ShapeType = typeof shapeTypes[number];

function alignToSides(left: string, right: string, fullWidth = 80) {
    const leftWidth = left.length;
    const rightWidth = right.length;

    if (leftWidth + rightWidth + 1 > fullWidth) {
        return `${left}\n${' '.repeat(fullWidth - rightWidth)}${right}`;
    }
    return `${left}${' '.repeat(fullWidth - leftWidth - rightWidth)}${right}`;
}

const helpMessage = [
    '',
    'Usage: geotastic-map-maker --shape <shape> --file <file> [--gap <gap>]',
    '',
    'Generate Geotastic drops CSV from a shape',
    '',
    'Options:',
    alignToSides('  -s, --shape    Boundary shape to use', `[${shapeTypesString}] [required]`),
    alignToSides('  -i, --input    Path to shape input file', '[string] [required]'),
    alignToSides('  -o, --output   Path to output file', '[string] [optional]'),
    alignToSides(
        '  -g, --gap      Gap between grid points in metres',
        `[number] [default: ${defaultGap}]`
    ),
    '',
].join('\n');

function showHelp() {
    console.log(helpMessage);
}

function validateShape(value: string): ShapeType {
    if (value === shapeTypes[0] || value === shapeTypes[1]) {
        return value;
    }
    throw new ArgError(`Shape must be one of [${shapeTypesString}].`, 'ARG_INVALID_CHOICE');
}

function validateFile(value: string): string {
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

async function main() {
    const [args, argErrors] = arg(
        {
            '--help': Boolean,
            '--version': Boolean,
            '--shape': validateShape,
            '--input': validateFile,
            '--gap': Number,

            '-h': '--help',
            '-g': '--gap',
            '-s': '--shape',
            '-i': '--input',
        },
        {
            argv: process.argv.slice(2),
            onlyThrowDevExceptions: true,
        }
    );

    if (args['--version']) {
        console.log('1.0.0');
        return;
    }

    if (args['--help']) {
        showHelp();
        return;
    }

    const errors = [
        // Add errors from arg validation
        ...Object.values(argErrors).map(
            (e) => `${e.message.slice(0, 1).toUpperCase()}${e.message.slice(1)}`
        ),
    ];

    if (!argErrors['--shape'] && !args['--shape']) {
        errors.push('Must specify a shape (--shape).');
    }
    if (!argErrors['--input'] && !args['--input']) {
        errors.push('Must specify a shape input file (--input).');
    }
    if (errors.length) {
        errors.forEach((e) => {
            console.error(chalk.red(e));
        });
        showHelp();
        return;
    }

    const gap = args['--gap'] || defaultGap;
    const shape = args['--shape'];
    const filepath = args['--input'];

    switch (shape) {
        case 'box':
            generateForBox(filepath, gap);
            break;

        case 'polygon':
            generateForPolygon(filepath, gap);
            break;
    }
}
main();
