#!/usr/bin/env node

// reason: this is the main entry to the module walker. if something
// goes wrong it has to decide what exit code to return. hence, it
// has to be able to use process.exit()
/* eslint no-process-exit: 0 */

import cli from 'commander';
import main from './lib/main';
import {loadConfigFromCLI} from './lib/configuration';
import {collect,findBaseDir} from './lib/collectInput';
import {parseImports} from './lib/parseImports';
import {printDot} from './lib/printDot';

cli.arguments('<files>', 'Files or folders containing files of the project to analyze')
    .option('-o, --output [file]', 'save output in file')
    .parse(process.argv);

function handleError(error) {
    console.error(`An error occurred: ${error}`);

    cli.outputHelp((helpText) => {
        console.log(helpText);
        process.exit(1);
    });
}

main(cli, {loadConfigFromCLI, collect, findBaseDir, parseImports, printDot})
    .then(() => {})
    .catch(handleError);
