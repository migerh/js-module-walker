function processFile({file, imports}, emitter) {
    imports.forEach(dep => {
        emitter(`  "${file}" -> "${dep}"`);
    })
}

export const printDot = (imports, emitter) => {
    emitter('digraph dependencies {');
    imports.forEach(v => processFile(v, emitter));
    emitter('}');
};