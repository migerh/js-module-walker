import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';
import _ from 'lodash/fp';

import {collect, findBaseDir} from '../lib/collectInput';

test.before(() => {
    sinon.stub(fs, 'statSync', item => {
        const isFile = item.indexOf('file') > -1,
            statFile = {isDirectory: () => false, isFile: () => true},
            statDirectory = {isDirectory: () => true, isFile: () => false};

        return isFile ? statFile : statDirectory;
    });

    sinon.stub(fs, 'readdirSync', dir => {
        if (dir.indexOf('sub') > -1) {
            return ['file2.js', 'file3.js'];
        }

        return ['some-sub-dir', 'file1.js'];
    });

    sinon.stub(fs, 'existsSync', item => item.indexOf('invalid') === -1);
});

test('#collect lets files pass through', t => {
    const input = ['some-file'],
        expectedOutput = input;

    const output = collect(input);

    t.deepEqual(output, expectedOutput);
});

test('#collect discards non-existing files or folders', t => {
    const input = ['invalid'],
        expectedOutput = [];

    const output = collect(input);

    t.deepEqual(output, expectedOutput);
});

test('#collect result contains all files fs#readdir returns for the input folder', t => {
    const input = ['some-dir'],
        expectedOutput = 'some-dir/file1.js';

    const output = collect(input);

    t.true(_.includes(expectedOutput, output));
});

test('#collect recursively collects all files fs#readdir returns', t => {
    const input = ['some-dir'],
        expectedOutput = ['some-dir/some-sub-dir/file2.js', 'some-dir/some-sub-dir/file3.js', 'some-dir/file1.js'];

    const output = collect(input);

    const expectedResultLength = 3;
    t.is(output.length, expectedResultLength);
    t.true(_.includes(expectedOutput[0], output));
    t.true(_.includes(expectedOutput[1], output));
    t.true(_.includes(expectedOutput[2], output));
});

test('#collect returns nothing if nothing is provided', t => {
    const input = [],
        expectedOutput = input;

    const output = collect(input);

    t.deepEqual(output, expectedOutput);
});

test('#findBaseDir finds the common base directory of all the given files', t => {
    const input = ['/some/dir/file1.js', '/some/dir/sub/file2.js'],
        expectedOutput = '/some/dir';

    const output = findBaseDir(input);

    t.is(output, expectedOutput);
});

test('#findBaseDir returns "/" if no files are given', t => {
    const input = [],
        expectedOutput = '/';

    const output = findBaseDir(input);

    t.is(output, expectedOutput);
});

test('#findBaseDir returns the directory of a single file', t => {
    const input = ['/some/source/file.js'],
        expectedOutput = '/some/source';

    const output = findBaseDir(input);

    t.is(output, expectedOutput);
});