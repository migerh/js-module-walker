import test from 'ava';
import _ from 'lodash/fp';

import {printDot} from '../lib/printDot';

test.beforeEach(t => {
    let buf = '';
    t.context = _.merge(t.context, {
        buffer: {
            getBuffer: () => buf,
            write: input => buf += input,
            on: (e, handler) => e === 'finish' ? handler() : ''
        }
    });
});

test('converts the dependency list into a directed graph in graphviz dot format', async t => {
    t.plan(1);

    const input = [{file: 'file.js', imports: ['import1.js', 'import2.js']}],
        expectedOutput = `digraph dependencies {
  "file.js" -> "import1.js"
  "file.js" -> "import2.js"
}
`;

    await printDot(input, t.context.buffer);

    t.is(t.context.buffer.getBuffer(), expectedOutput);
});

test('appends a property if an edge formatter is provided', async t => {
    t.plan(1);

    const inputGraph = [{file: 'file.js', imports: ['import1.js', 'import2.js']}],
        inputFormatters = [{
            formatEdge: ([from, to]) => to === 'import1.js' ? 'color=black' : ''
        }],
        expectedOutput = `digraph dependencies {
  "file.js" -> "import1.js" [color=black]
  "file.js" -> "import2.js"
}
`;

    await printDot(inputGraph, t.context.buffer, inputFormatters);

    t.is(t.context.buffer.getBuffer(), expectedOutput);
});