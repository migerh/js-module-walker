import _ from 'lodash/fp';
import {createEmitter} from "./emitterFactory";
import {Cycles} from './cycles';

export default async function main(args, context) {
    const config = context.loadConfigFromCLI(args);

    if (config.paths.length === 0) {
        return Promise.reject(new Error('No input given.'));
    }

    const files = _.flattenDeep(context.collect(config.paths));
    const baseDir = context.findBaseDir(files);
    const imports = context.parseImports(files, baseDir, config.ignorePackages);

    let formatters = [];
    if (config.findCycles) {
        const cycles = new Cycles(imports);
        cycles.find();
        formatters.push(cycles);
    }

    const emitter = await createEmitter(config.output);
    await context.printDot(imports, emitter.stream, formatters);
    emitter.close();
}
