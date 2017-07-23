#!/usr/bin/env node

// reason: this is the main entry to the module walker. if something
// goes wrong it has to decide what exit code to return. hence, it
// has to be able to use process.exit()
/* eslint no-process-exit: 0 */

const cli = require('commander'),
    main = require('./lib/main'),
    {loadConfigFromCLI} = require('./lib/configuration'),
    {collect,findBaseDir} = require('./lib/collectInput'),
    {parseImports} = require('./lib/parseImports'),
    {printDot} = require('./lib/printDot');

cli.arguments('<files>', 'Files or folders containing files of the project to analyze')
    .option('-o, --output [file]', 'save output in file')
    .option('--find-cycles', 'detect and highlight cyclic dependencies')
    .option('--ignore-packages', 'ignore dependencies into packages from e.g. node modules')
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
