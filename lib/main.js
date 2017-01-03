import path from 'path';
import _ from 'lodash/fp';

export default function main(args, context) {
    const config = context.ConfigurationLoader.fromCLI(args);

    if (config.path === undefined) {
        throw new Error('No input given.');
    }

    const absolutePath = path.resolve(config.path);
    const files = _.flattenDeep(context.walkSync(absolutePath));
    const imports = context.parseImports(files, absolutePath);

    context.printDot(imports);
}
