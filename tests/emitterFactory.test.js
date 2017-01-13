import test from 'ava';
import _ from 'lodash/fp';
import sinon from 'sinon';
import uuid from 'uuid/v4';

import fs from 'fs';
import {createEmitter} from '../lib/emitterFactory';

let streams = {};

test.before(() => {
    sinon.stub(fs, 'createWriteStream', filename => streams[filename]);
});

test.beforeEach(t => {
    t.context = _.merge(t.context, {
        fakeStream: {
            type: 'fakeStream',
            on: sinon.stub()
        },
        filename: uuid()
    });

    streams[t.context.filename] = t.context.fakeStream;
});

test.afterEach(t => {
    delete streams[t.context.filename];
});

test('returns stdout stream if no output file is configured', async t => {
    const outFile = undefined,
        // process.stdout stream has file descriptor equal to 1
        stdoutFileDescriptor = 1;

    const output = await createEmitter(outFile);

    // it has a stream with a file descriptor identical to stdout
    t.true(_.has('stream', output));
    t.is(output.stream.fd, stdoutFileDescriptor);

    // it has a close method
    t.true(_.has('close', output));
});

test('returns file stream if output file is configured', async t => {
    t.context.fakeStream.on.withArgs('open').callsArg(1);

    const output = await createEmitter(t.context.filename);

    t.is(output.stream, t.context.fakeStream);
    // it has a close method
    t.true(_.has('close', output));
});

test('throws if an error occurs during file creation', async t => {
    t.plan(1);

    t.context.fakeStream.on.withArgs('error').callsArg(1);

    try {
        await createEmitter(t.context.filename);
        t.fail();
    } catch (e) {
        t.pass();
    }
});