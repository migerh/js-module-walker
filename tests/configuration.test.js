const test = require('ava'),
    _ = require('lodash/fp'),
    {loadConfigFromCLI} = require('../lib/configuration');

test.beforeEach(t => {
    t.context = _.merge(t.context, {
        cliArgs: {
            args: ['somePath']
        }
    });
});

test('#fromCLI returns an object', t => {
    const result = loadConfigFromCLI();

    t.true(_.isObject(result));
});

test('#fromCLI result contains the path if one is given', t => {
    const expectedPath = ['somePath'],
        result = loadConfigFromCLI(t.context.cliArgs);

    t.true(_.has('paths', result));
    t.deepEqual(result.paths, expectedPath)
});

test('#fromCLI result contains an output file if one is given', t => {
    const expectedOutput = './target/out.dot',
        cliArgs = {...t.context.cliArgs, output: './target/out.dot'},
        result = loadConfigFromCLI(cliArgs);

    t.true(_.has('output', result));
    t.deepEqual(result.output, expectedOutput)
});

test('#fromCLI result contain undefined output file if none is given', t => {
    const result = loadConfigFromCLI(t.context.cliArgs);

    t.true(_.has('output', result));
    t.is(result.output, undefined);
});

test('#fromCLI accepts the --find-cycles flag', t => {
    const expectedOutput = true,
        cliArgs = {...t.context.cliArgs, findCycles: true},
        result = loadConfigFromCLI(cliArgs);

    t.true(_.has('findCycles', result));
    t.is(result.findCycles, expectedOutput);
});