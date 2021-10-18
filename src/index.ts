import arg from 'arg';
import chalk from 'chalk';
import generateForBox from './commands/generate_for_box';
import generateForPolygon from './commands/generate_for_polygon';
import {validateCanCreateFile, validateFileExists, validateSourceType} from './lib/arg_validation';
import {defaultGap, sourceTypesString} from './lib/consts';
import Logger from './lib/log';
import packageJson from '../package.json';
import generateForOSMArea from './commands/generate_for_osm_area';
import generateForOSMNodes from './commands/generate_for_osm_nodes';

const logger = new Logger('Index');

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
    'Usage: geotastic-map-maker --source <source type> --file <file> [--gap <gap>]',
    '',
    'Generate Geotastic drops CSV from a data souce',
    '',
    'Options:',
    alignToSides('  -s, --source   Source type to use', `[${sourceTypesString}] [required]`),
    alignToSides('  -i, --input    Path to input source file', '[string] [required]'),
    alignToSides('  -o, --output   Path to output file', '[string] [optional]'),
    alignToSides('  -n, --name     Filename suffix if output not specified', '[string] [optional]'),
    alignToSides(
        '  -g, --gap      Gap between grid points in metres',
        `[number] [default: ${defaultGap}]`
    ),
    '',
].join('\n');

function showHelp() {
    console.log(helpMessage);
}

async function main() {
    const [args, argErrors] = arg(
        {
            '--help': Boolean,
            '--version': Boolean,
            '--source': validateSourceType,
            '--input': validateFileExists,
            '--output': validateCanCreateFile,
            '--gap': Number,
            '--name': String,

            '-h': '--help',
            '-g': '--gap',
            '-s': '--source',
            '-i': '--input',
            '-o': '--output',
            '-n': '--name',
        },
        {
            argv: process.argv.slice(2),
            onlyThrowDevExceptions: true,
        }
    );

    if (args['--version']) {
        console.log(packageJson.version);
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

    if (!argErrors['--source'] && !args['--source']) {
        errors.push('Must specify a source type (--source).');
    }
    if (!argErrors['--input'] && !args['--input']) {
        errors.push('Must specify an input source file (--input).');
    }
    if (errors.length) {
        errors.forEach((e) => {
            console.error(chalk.red(e));
        });
        showHelp();
        return;
    }

    const gap = args['--gap'] || defaultGap;
    const sourceType = args['--source'];
    const filepath = args['--input'];
    const outputFilepath = args['--output'];
    const name = args['--name'];

    if (gap < 100) {
        logger.warn(
            'Using a small gap can create an extremely large number of points, which will take a long time to process.'
        );
    }

    switch (sourceType) {
        case 'box':
            await generateForBox({inputPath: filepath, outputFilepath, gap, name});
            break;

        case 'polygon':
            await generateForPolygon({inputPath: filepath, outputFilepath, gap, name});
            break;

        case 'osmarea':
            await generateForOSMArea({inputPath: filepath, outputFilepath, gap, name});
            break;

        case 'osmnodes':
            await generateForOSMNodes({inputPath: filepath, outputFilepath, gap, name});
            break;
    }
}
main();
