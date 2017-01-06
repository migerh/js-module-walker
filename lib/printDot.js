function processFile({file, imports}, stream, edgeFormatters) {
    imports.forEach(dep => {
        const formats = edgeFormatters.map(f => f.formatEdge([file, dep]));
        let property = formats.join(',');

        if (property.length > 0) {
            property = ` [${property}]`;
        }

        stream.write(`  "${file}" -> "${dep}"${property}\n`, 'utf8');
    });
}

export const printDot = async (imports, stream, edgeFormatters = []) => {
    return new Promise((resolve, reject) => {
        stream.write('digraph dependencies {\n', 'utf8');
        imports.forEach(v => processFile(v, stream, edgeFormatters));
        stream.write('}\n', 'utf8');

        stream.on('finish', () => {
            resolve();
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
};