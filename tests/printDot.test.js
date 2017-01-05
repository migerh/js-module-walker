import test from 'ava';
import _ from 'lodash/fp';

import {printDot} from '../lib/printDot';

test.beforeEach(t => {
    let buffer = '';
    const emitter = v => buffer += v + '\n';

    t.context = _.merge(t.context, {
        getBuffer: () => buffer,
        emitter
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

    printDot(input, t.context.emitter);

    t.is(t.context.getBuffer(), expectedOutput);
});