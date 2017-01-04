import test from 'ava';
import sinon from 'sinon';
import _ from 'lodash/fp';

import fs from 'fs';
import {parseImports} from '../lib/parseImports';

const localTestFiles = {
    "./file-local-import-from-default.js": `import stuff from './local/file';`,
    "./file-import-multiple-whitespaces.js": `import   stuff  from    './local/file';`,
    "./file-local-import.js": `import './local/file'`,
    "./file-local-import-from-as-default.js": `import stuff as s from './local/file'`,
    "./file-local-import-from-named.js": `import {stuff} from './local/file'`,
    "./file-local-import-from-named-as.js": `import {stuff as s} from './local/file'`
};

const testPackages = {
    "./file-package-import-from-default.js": `import fs from 'fs'`,
    "./file-package-import.js": `import 'fs';`
};

test.before(() => {
    sinon.stub(fs, 'readFileSync', filename => localTestFiles[filename] || testPackages[filename] || '');
});

_.keys(localTestFiles).map(file => {
    test(`finds imports of ${file}`, t => {
        t.plan(1);

        const input = [file],
            baseDir = './',
            outputFilename = file.slice(2),
            expectedOutput = [{file: outputFilename, imports: ['local/file.js']}];

        const output = parseImports(input, baseDir);

        t.deepEqual(output, expectedOutput);
    });
});

test('returns an array with objects for every input file with imports', t => {
    t.plan(2);

    const input = _.keys(testPackages),
        baseDir = './';
    const output = parseImports(input, baseDir);

    for (const file of input) {
        t.true(output[0].file === file.slice(2) || output[1].file === file.slice(2));
    }
});
