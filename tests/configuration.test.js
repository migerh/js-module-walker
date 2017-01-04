import test from 'ava';
import _ from 'lodash/fp';

import {loadConfigFromCLI} from '../lib/configuration';

test.beforeEach(t => {
    t.context = _.merge(t.context, {
        cliArgs: {
            args: ['somePath']
        }
    });
});

test('#fromCLI returns an object', t => {
    t.plan(1);

    const result = loadConfigFromCLI();

    t.true(_.isObject(result));
});

test('#fromCLI result contains the path if one is given', t => {
    t.plan(2);

    const expectedPath = ['somePath'],
        result = loadConfigFromCLI(t.context.cliArgs);

    t.true(_.has('paths', result));
    t.deepEqual(result.paths, expectedPath)
});