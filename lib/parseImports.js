import fs from 'fs';
import path from 'path';
import _ from 'lodash/fp';

const encoding = 'utf-8';
const regex = /import .* from ['"](.*?)['"]/;
const isLocalImport = dep => dep[0] === '.' || dep[0] === '/';

function collectImports(file) {
    const contents = fs.readFileSync(file, {encoding}),
        lines = contents.split('\n'),
        importLines = lines.filter(line => {
            return line.match(regex);
        }),
        relativeImports = importLines.map(line => line.match(regex)[1]);

    return relativeImports.map(dep => {
        if (isLocalImport(dep)) {
            const baseDir = path.dirname(file);
            return path.resolve(path.join(baseDir, dep));
        }

        return dep;
    });
}

function normalizeImports(baseDir, imports) {
    return imports.map(dep => {
        if (isLocalImport(dep)) {
            return path.relative(baseDir, dep) + '.js';
        }

        return dep;
    })
}

export const parseImports = (files, absolutePath) => {
    const importLists = files.map(collectImports).map(dep => normalizeImports(absolutePath, dep));
    const relativeFiles = files.map(file => path.relative(absolutePath, file));

    return _.zipWith(relativeFiles, importLists, (file, imports) => {
        return [file, imports];
    }).map(dep => ({file: dep[1], imports: dep[0]}));
};