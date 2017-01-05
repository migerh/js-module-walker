import _ from 'lodash/fp';
import {createEmitter} from "./emitterFactory";

export default async function main(args, context) {
    const config = context.loadConfigFromCLI(args);

    if (config.paths.length === 0) {
        return Promise.reject(new Error('No input given.'));
    }

    const files = _.flattenDeep(context.collect(config.paths));
    const baseDir = context.findBaseDir(files);
    const imports = context.parseImports(files, baseDir);

    try {
        const emitter = await createEmitter(config.output);
        await context.printDot(imports, emitter.stream);
        emitter.close();
    } catch (error) {
        return Promise.reject(error);
    }
}
