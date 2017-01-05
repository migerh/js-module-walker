function processFile({file, imports}, stream) {
    imports.forEach(dep => {
        stream.write(`  "${file}" -> "${dep}"\n`, 'utf8');
    })
}

export const printDot = (imports, stream) => {
    stream.write('digraph dependencies {\n', 'utf8');
    imports.forEach(v => processFile(v, stream));
    stream.write('}\n', 'utf8');
};