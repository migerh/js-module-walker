const fs = require('fs'),
    path = require('path'),
    _ = require('lodash/fp'),
    R = require('ramda'),
    babylon = require('@babel/parser');

const encoding = 'utf-8';
const isLocalImport = dep => dep[0] === '.' || dep[0] === '/';

function parse(source) {
    return babylon.parse(source, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: [
            'jsx',
            'objectRestSpread',
            'classProperties',
            'exportExtensions',
            'asyncGenerators',
            'functionBind',
            'functionSend',
            'dynamicImport'
        ]
    });
}

function findImportStatements(ast) {
    let imports = [];

    if (!ast) {
        return imports;
    }

    if (ast.type === 'ImportDeclaration' && ast.source.type === 'StringLiteral') {
        imports = [...imports, ast.source.value];
    }

    if (ast.body) {
        const body = Array.isArray(ast.body) ? ast.body : [ast.body];
        imports = [...imports, ...body.map(sub => findImportStatements(sub))];
    }

    return imports;
}

function findRequireStatements(ast) {
    let imports = [];

    if (!ast) {
        return imports;
    }

    const isRequireCall = node => {
        return node.type === 'CallExpression' &&
            ast.callee && ast.callee.type === 'Identifier' &&
            ast.callee.name === 'require';
    };
    const getRequireParameters = args => {
        if (!args && !args[0]) {
            return [];
        }

        const firstArgument = args[0];
        if (firstArgument.type === 'StringLiteral') {
            return [firstArgument.value];
        }
    };

    if (isRequireCall(ast)) {
        return getRequireParameters(ast['arguments']);
    }

    const subtreesToFollow = ['alternate', 'argument', 'block', 'body', 'callee',
        'cases', 'consequent', 'declarations', 'elements', 'expression', 'expressions', 'finalizer',
        'handler', 'init', 'left', 'object', 'properties', 'right', 'test', 'update', 'value'],
        collectSubtrees = R.pipe(R.props(subtreesToFollow), R.reject(R.isNil), R.flatten),
        subtrees = collectSubtrees(ast);
    imports = [...imports, ...subtrees.map(sub => findRequireStatements(sub))];

    return imports;
}

function collectImports(file) {
    const contents = fs.readFileSync(file, {encoding}),
        ast = parse(contents),
        importStatements = findImportStatements(ast.program),
        importsViaImport = _.filter(l => l.length, _.flattenDeep(importStatements)),
        requireStatements = findRequireStatements(ast.program),
        requires = _.filter(l => l.length, _.flattenDeep(requireStatements)),
        imports = importsViaImport.concat(requires);

    return imports.map(dep => {
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
            const relativePath = path.relative(baseDir, dep);
            if (fs.existsSync(dep + '.jsx')) {
                return relativePath + '.jsx';
            }
            return relativePath + '.js';
        }

        return dep;
    })
}

const parseImports = (files, absolutePath, ignorePackages = false) => {
    const importLists = files.map(collectImports).map(dep => normalizeImports(absolutePath, dep, ignorePackages));
    const relativeFiles = files.map(file => path.relative(absolutePath, file));

    return _.zipWith(relativeFiles, importLists, (file, imports) => {
        return [file, imports];
    }).map(dep => ({file: dep[1], imports: dep[0]}));
};

module.exports = {parseImports};