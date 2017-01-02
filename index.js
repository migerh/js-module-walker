#!/usr/bin/env node

import cli from 'commander';
import main from './lib/main';
import {ConfigurationLoader} from './lib/ConfigurationLoader';
import {walkSync} from './lib/collectInput';
import {parseImports} from './lib/parseImports';
import {printDot} from './lib/printDot';

cli.arguments('<path>', 'Path to the project to analyze', )
    .parse(process.argv);

try {
    main(cli, {ConfigurationLoader, walkSync, parseImports, printDot});
} catch (e) {
    console.error(`An error occurred: ${e}`);

    cli.outputHelp((helpText) => {
        console.log(helpText);
        process.exit(1);
    });
}