const emit = console.log;

function processFile({file, imports}) {
    imports.forEach(dep => {
        emit(`  "${file}" -> "${dep}"`);
    })
}

export const printDot = imports => {
    emit('digraph fourminitz {');
    imports.forEach(processFile);
    emit('}');
};