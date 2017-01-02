import test from 'ava';
import sinon from 'sinon';
import _ from 'lodash/fp';

import main from '../lib/main';

test.beforeEach(t => {
    const Configuration = {
            path: 'somePath'
        },
        walkSyncResult = ['file1.js', 'file2.js'],
        parseImportsResult = [{file: 'file1.js', imports: ['file2.js']}, {file: 'file2.js', imports: []}];

    t.context = _.merge(t.context, {
        ConfigurationLoader: {
            fromCLI: sinon.stub().returns(Configuration)
        },
        Configuration,
        walkSync: sinon.stub().returns(walkSyncResult),
        walkSyncResult,
        parseImports: sinon.stub().returns([{file: 'file1.js', imports: ['file2.js']}, {file: 'file2.js', imports: []}]),
        parseImportsResult,
        printDot: sinon.stub().returns()
    });
});

test('loads configuration with ConfigurationLoader', t => {
    t.plan(2);

    const cliArgs = {args: ['somePath']};

    main(cliArgs, t.context);

    const ConfigurationLoader = t.context.ConfigurationLoader;
    t.true(ConfigurationLoader.fromCLI.calledWith(cliArgs));
    t.true(ConfigurationLoader.fromCLI.calledOnce);
});

test('throws an exception if no path is returned by the ConfigurationLoader', t => {
    t.plan(1);

    const cliArgs = {};
    t.context.ConfigurationLoader.fromCLI.returns({});

    t.throws(() => main(cliArgs, t.context), Error, 'No path given.');
});

test('uses walkSync to collect source files', t => {
    t.plan(2);

    const cliArgs = {};

    main(cliArgs, t.context);

    const walkSync = t.context.walkSync;
    t.true(walkSync.calledWith(sinon.match(t.context.Configuration.path)));
    t.true(walkSync.calledOnce);
});

test('uses import parser to collect imports', t => {
    t.plan(2);

    const cliArgs = {};

    main(cliArgs, t.context);

    const parseImports = t.context.parseImports;
    t.true(parseImports.calledWith(t.context.walkSyncResult));
    t.true(parseImports.calledOnce);
});

test('uses printDot to emit the dependency graph', t => {
    t.plan(2);

    const cliArgs = {};

    main(cliArgs, t.context);

    const printDot = t.context.printDot;
    t.true(printDot.calledWith(t.context.parseImportsResult));
    t.true(printDot.calledOnce);
});