import fs from 'fs';
import path from 'path';
import _ from 'lodash/fp';

const excludedDirectories = ['node_modules', '.idea', '.meteor', 'test', 'tests', 'server', 'programs', 'private'];
const includedFiles = ['.js'];

export const walkSync = function (dir) {
    const files = fs.readdirSync(dir);

    return files.map(file => {
        const fullPath = path.join(dir, file),
            stats = fs.statSync(fullPath);

        if (_.includes(file, excludedDirectories)) {
            return [];
        }

        if (stats.isDirectory()) {
            return walkSync(fullPath);
        }

        if (_.includes(path.extname(file), includedFiles)) {
            return [fullPath];
        }

        return [];
    });
};