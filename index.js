#!/usr/bin/env node

import cli from 'commander';
import main from './lib/main';
import {loadConfigFromCLI} from './lib/configuration';
import {collect,findBaseDir} from './lib/collectInput';
import {parseImports} from './lib/parseImports';
import {printDot} from './lib/printDot';

cli.arguments('<files>', 'Files or folders containing files of the project to analyze', )
    .parse(process.argv);

try {
    main(cli, {loadConfigFromCLI, collect, findBaseDir, parseImports, printDot});
} catch (e) {
    console.error(`An error occurred: ${e}`);

    cli.outputHelp((helpText) => {
        console.log(helpText);
        process.exit(1);
    });
}