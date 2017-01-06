import fs from 'fs';
import path from 'path';
import _ from 'lodash/fp';

const encoding = 'utf-8';
const regex = /import\s+(.*\s+from\s+)?['"](.*?)['"]/;
const isLocalImport = dep => dep[0] === '.' || dep[0] === '/';

function collectImports(file) {
    const contents = fs.readFileSync(file, {encoding}),
        lines = contents.split('\n'),
        importLines = lines.filter(line => {
            return line.match(regex);
        }),
        relativeImports = importLines.map(line => line.match(regex)[2]);

    return relativeImports.map(dep => {
        if (isLocalImport(dep)) {
            const baseDir = path.dirname(file);
            return path.resolve(path.join(baseDir, dep));
        }

        return dep;
    });
}

function normalizeImports(baseDir, imports, ignorePackages) {
    let importsToConsider = imports;

    if (ignorePackages) {
        importsToConsider = imports.filter(isLocalImport);
    }

    return importsToConsider.map(dep => {
        if (isLocalImport(dep)) {
            return path.relative(baseDir, dep) + '.js';
        }

        return dep;
    })
}

export const parseImports = (files, absolutePath, ignorePackages = false) => {
    const importLists = files.map(collectImports).map(dep => normalizeImports(absolutePath, dep, ignorePackages));
    const relativeFiles = files.map(file => path.relative(absolutePath, file));

    return _.zipWith(relativeFiles, importLists, (file, imports) => {
        return [file, imports];
    }).map(dep => ({file: dep[1], imports: dep[0]}));
};