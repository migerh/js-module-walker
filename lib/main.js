import _ from 'lodash/fp';

export default function main(args, context) {
    const config = context.loadConfigFromCLI(args);

    if (config.paths.length === 0) {
        throw new Error('No input given.');
    }

    const files = _.flattenDeep(context.collect(config.paths));
    const baseDir = context.findBaseDir(files);
    const imports = context.parseImports(files, baseDir);

    context.printDot(imports);
}
