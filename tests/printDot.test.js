import test from 'ava';
import _ from 'lodash/fp';
import {WritableStreamBuffer} from 'stream-buffers';

import {printDot} from '../lib/printDot';

test.beforeEach(t => {
    t.context = _.merge(t.context, {
        buffer: new WritableStreamBuffer()
    });
});

test('converts the dependency list into a directed graph in graphviz dot format', t => {
    t.plan(1);

    const input = [{file: 'file.js', imports: ['import1.js', 'import2.js']}],
        expectedOutput = `digraph dependencies {
  "file.js" -> "import1.js"
  "file.js" -> "import2.js"
}
`;

    printDot(input, t.context.buffer);

    t.is(t.context.buffer.getContentsAsString('utf8'), expectedOutput);
});