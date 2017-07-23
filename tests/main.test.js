const test = require('ava'),
    sinon = require('sinon'),
    _ = require('lodash/fp'),
    main = require('../lib/main'),
    {Cycles} = require('../lib/cycles');

test.beforeEach(t => {
    const configuration = {
            paths: ['somePath']
        },
        collectResult = ['file1.js', 'file2.js'],
        findBaseDirResult = 'somePath',
        parseImportsResult = [{file: 'file1.js', imports: ['file2.js']}, {file: 'file2.js', imports: []}];

    t.context = _.merge(t.context, {
        loadConfigFromCLI: sinon.stub().returns(configuration),
        configuration,
        collect: sinon.stub().returns(collectResult),
        collectResult,
        findBaseDir: sinon.stub().returns(findBaseDirResult),
        findBaseDirResult,
        parseImports: sinon.stub().returns([{file: 'file1.js', imports: ['file2.js']}, {file: 'file2.js', imports: []}]),
        parseImportsResult,
        printDot: sinon.stub().returns()
    });
});

test('loads configuration with ConfigurationLoader', async t => {
    const cliArgs = {args: ['somePath']};

    await main(cliArgs, t.context);

    const loadConfigFromCLI = t.context.loadConfigFromCLI;
    t.true(loadConfigFromCLI.calledWith(cliArgs));
    t.true(loadConfigFromCLI.calledOnce);
});

test('throws an exception if no path is returned by the ConfigurationLoader', async t => {
    t.plan(1);

    const cliArgs = {};
    t.context.loadConfigFromCLI.returns({paths: []});

    try {
        await main(cliArgs, t.context);
        t.fail();
    } catch (error) {
        t.true(error.message.indexOf('No input given') > -1);
    }
});

test('uses collect to collect source files', async t => {
    const cliArgs = {};

    await main(cliArgs, t.context);

    const walkSync = t.context.collect;
    t.true(walkSync.calledWith(t.context.configuration.paths));
    t.true(walkSync.calledOnce);
});

test('uses import parser to collect imports', async t => {
    const cliArgs = {};

    await main(cliArgs, t.context);

    const parseImports = t.context.parseImports;
    t.true(parseImports.calledWith(t.context.collectResult));
    t.true(parseImports.calledOnce);
});

test('uses printDot to emit the dependency graph', async t => {
    const cliArgs = {};

    await main(cliArgs, t.context);

    const printDot = t.context.printDot;
    t.true(printDot.calledWith(t.context.parseImportsResult));
    t.true(printDot.calledOnce);
});

test('uses Cycles to detect cycles if --find-cycles is set', async t => {
    const cliArgs = {};
    t.context.loadConfigFromCLI.returns({paths: ['some-path'], findCycles: true});

    await main(cliArgs, t.context);

    const printDot = t.context.printDot,
        spyCall = printDot.getCall(0),
        cyclesEmitter = spyCall.args[2][0];

    t.true(cyclesEmitter instanceof Cycles);
    t.true(printDot.calledOnce);
});