import test from 'ava';
import _ from 'lodash/fp';

import {ConfigurationLoader} from '../lib/ConfigurationLoader';

test.beforeEach(t => {
    t.context = _.merge(t.context, {
        cliArgs: {
            args: ['somePath']
        }
    });
});

test('#fromCLI returns an object', t => {
    t.plan(1);

    const result = ConfigurationLoader.fromCLI();

    t.true(_.isObject(result));
});

test('#fromCLI result contains the path if one is given', t => {
    t.plan(2);

    const expectedPath = 'somePath',
        result = ConfigurationLoader.fromCLI(t.context.cliArgs);

    t.true(_.has('path', result));
    t.is(result.path, expectedPath)
});