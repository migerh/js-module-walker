import test from 'ava';
import _ from 'lodash/fp';

import {Cycles} from '../lib/cycles';

test.beforeEach('simple input graph', t => {
    t.context = _.merge(t.context, {
        trivialCycle: [{
            file: 'file1.js',
            imports: ['file2.js']
        }, {
            file: 'file2.js',
            imports: ['file1.js']
        }],
        cycleOverMultipleHops: [{
            file: 'file1.js',
            imports: ['file2.js']
        }, {
            file: 'file2.js',
            imports: ['file3.js']
        }, {
            file: 'file3.js',
            imports: ['file4.js']
        }, {
            file: 'file4.js',
            imports: ['file1.js']
        }],
        nonLocalPackage: [{
            file: 'file1.js',
            imports: ['file2.js', 'fs']
        }, {
            file: 'file2.js',
            imports: ['file1.js']
        }]
    });
});

test('#find detects trivial cycles', t => {
    const expectedOutput = [['file1.js', 'file2.js'], ['file2.js', 'file1.js']];

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.find();

    t.deepEqual(output, expectedOutput);
});

test('#find detects nontrivial cycles', t => {
    const expectedOutput = [['file1.js', 'file2.js', 'file3.js', 'file4.js'],
        ['file2.js', 'file3.js', 'file4.js', 'file1.js'],
        ['file3.js', 'file4.js', 'file1.js', 'file2.js'],
        ['file4.js', 'file1.js', 'file2.js', 'file3.js']];

    const cycles = new Cycles(t.context.cycleOverMultipleHops),
        output = cycles.find();

    t.deepEqual(output, expectedOutput);
});

test('#find determines a flattened list of cyclic edges', t => {
    const expectedOutput = [
        ['file1.js', 'file2.js'], ['file2.js', 'file3.js'],
        ['file3.js', 'file4.js'], ['file4.js', 'file1.js']];

    const cycles = new Cycles(t.context.cycleOverMultipleHops);
    cycles.find();

    t.deepEqual(cycles._cyclicEdges, expectedOutput);
});

test('#find ignores non-local imports', t => {
    const expectedOutput = [['file1.js', 'file2.js'], ['file2.js', 'file1.js']];

    const cycles = new Cycles(t.context.nonLocalPackage),
        output = cycles.find();

    t.deepEqual(output, expectedOutput);
});

test('#find is not broken by cycles that do not involve the top level file', t => {
    const deps = [{
            file: 'file1.js',
            imports: ['file2.js']
        }, {
            file: 'file2.js',
            imports: ['file3.js']
        }, {
            file: 'file3.js',
            imports: ['file2.js']
        }],
        expectedOutput = [['file2.js','file3.js'], ['file2.js','file3.js'], ['file3.js','file2.js']];

    const cycles = new Cycles(deps),
        output = cycles.find();

    t.deepEqual(output, expectedOutput);
});

test('#filenameToIndex finds the correct index in the dependencies list to a given file', t => {
    const input = 'file2.js',
        expectedOutput = 1;

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.filenameToIndex(input);

    t.is(output, expectedOutput);
});

test('#filenameToIndex returns -1 if there is no imports list for this file', t => {
    const input = 'not-a-source-file.js',
        expectedOutput = -1;

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.filenameToIndex(input);

    t.is(output, expectedOutput);
});

test('#isSourceFile returns true if there is an entry for the given file name', t => {
    const input = 'file2.js',
        expectedOutput = true;

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.isSourceFile(input);

    t.is(output, expectedOutput);
});

test('#isSourceFile returns false if there is no entry for the given file', t => {
    const input = 'not-a-source-file.js',
        expectedOutput = false;

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.isSourceFile(input);

    t.is(output, expectedOutput);
});

test('#importsOf returns the list of imports of a given file', t => {
    const input = 'file2.js',
        expectedOutput = ['file1.js'];

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.importsOf(input);

    t.deepEqual(output, expectedOutput);
});

test('#importsOf returns an empty array if there are no imports for the given file', t => {
    const input = 'not-a-source-file.js',
        expectedOutput = [];

    const cycles = new Cycles(t.context.trivialCycle),
        output = cycles.importsOf(input);

    t.deepEqual(output, expectedOutput);
});

test('#formatEdge returns red color for edges that are part of a cycle', t => {
    const input = ['file1.js', 'file2.js'],
        expectedOutput = 'color=red';

    const cycles = new Cycles(t.context.trivialCycle);
    cycles.find();

    const output = cycles.formatEdge(input);

    t.is(output, expectedOutput);
});

test('#formatEdge returns an empty string for edges that are not part of a cycle', t => {
    const input = ['file1.js', 'fs'],
        expectedOutput = '';

    const cycles = new Cycles(t.context.nonLocalPackage);
    cycles.find();

    const output = cycles.formatEdge(input);

    t.is(output, expectedOutput);
});