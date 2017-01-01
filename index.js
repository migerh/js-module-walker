#!/usr/bin/env node

import path from 'path';
import _ from 'lodash/fp';
import cli from 'commander';

import { walkSync } from './lib/collectInput';
import { parseImports } from './lib/parseImports';
import { printDot } from "./lib/printDot";

function main(root) {
    if (root === undefined) {
        console.error(`No path given.`);
        cli.outputHelp((helpText) => {
            console.log(helpText);
            process.exit(1);
        });
    }

    const absolutePath = path.resolve(root);
    const files = _.flattenDeep(walkSync(absolutePath));
    const imports = parseImports(files, absolutePath);

    printDot(imports);
}

cli.arguments('<path>', 'Path to the project to analyze', )
    .parse(process.argv);

main(cli.args[0]);