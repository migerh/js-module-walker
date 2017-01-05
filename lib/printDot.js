function processFile({file, imports}, stream) {
    imports.forEach(dep => {
        stream.write(`  "${file}" -> "${dep}"\n`, 'utf8');
    })
}

export const printDot = async (imports, stream) => {
    return new Promise((resolve, reject) => {
        stream.write('digraph dependencies {\n', 'utf8');
        imports.forEach(v => processFile(v, stream));
        stream.write('}\n', 'utf8');

        stream.on('finish', () => {
            resolve();
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
};