const _ = require('lodash/fp');

class Cycles {
    constructor(dependencies) {
        this._deps = dependencies;
        this._entries = _.flatten(_.map(_.props('file'), this._deps));
        this._cycles = [];
        this._cyclicEdges = [];
    }

    filenameToIndex(file) {
        return _.indexOf(file, this._entries);
    }

    isSourceFile(file) {
        return this.filenameToIndex(file) > -1;
    }

    importsOf(file) {
        const index = this.filenameToIndex(file);

        if (index === -1) {
            return [];
        }

        return this._deps[index].imports;
    }

    traverse(entry, path) {
        const imports = this.importsOf(entry);

        for (let i = 0; i < imports.length; ++i) {
            const currentFile = imports[i],
                index = _.indexOf(currentFile, path);

            if (index > -1) {
                const cycle = path.slice(index);
                this._cycles.push(cycle);
                continue;
            }

            if (!this.isSourceFile(currentFile, this._deps)) {
                continue;
            }

            this.traverse(currentFile, [...path, currentFile]);
        }
    }

    edgeIsCyclic(file, importedFile) {
        return _.findIndex(v => v[0] === file && v[1] === importedFile, this._cyclicEdges) > -1;
    }

    extractEdgesFromCycle(cycle) {
        for (let i = 0; i < cycle.length - 1; ++i) {
            if (!this.edgeIsCyclic(cycle[i], cycle[i + 1])) {
                this._cyclicEdges.push([cycle[i], cycle[i + 1]]);
            }
        }
    }

    extractCyclicEdges() {
        for (const entry of this._cycles) {
            this.extractEdgesFromCycle(entry);
        }
    }

    find() {
        for (const entry of this._deps) {
            let path = [entry.file];
            this.traverse(entry.file, path);
        }

        this.extractCyclicEdges();

        return this._cycles;
    }

    formatEdge([from, to]) {
        const isCyclic = this.edgeIsCyclic(from, to);
        return isCyclic ? 'color=red' : '';
    }
}

module.exports = {Cycles};