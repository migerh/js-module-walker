const fs = require('fs'),
    path = require('path'),
    _ = require('lodash/fp');

const excludedDirectories = ['node_modules', '.idea', '.meteor', 'test', 'tests', 'server', 'programs', 'private'];

function collectFileOrDirectory(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const statInput = fs.statSync(dir);
    if (statInput.isFile()) {
        return dir;
    }

    const files = fs.readdirSync(dir);

    return files.map(file => {
        if (_.includes(file, excludedDirectories)) {
            return [];
        }

        const fullPath = path.join(dir, file);

        return collectFileOrDirectory(fullPath);
    });
}

const collect = function (paths) {
    const files = _.map(collectFileOrDirectory, paths);
    return _.flattenDeep(files);
};

const findBaseDir = function (files) {
    const splits = _.map(_.split(path.sep), files),
        shortestPath = _.min(_.map(_.size, splits));

    if (splits.length === 0) {
        return '/';
    }

    if (splits.length === 1) {
        return path.dirname(files[0]);
    }

    for (let i = 0; i < shortestPath; ++i) {
        const dir = splits[0][i];
        const allTheSame = _.reduce((acc, val) => acc && dir === val[i], true, splits);

        if (!allTheSame) {
            return _.join(path.sep, splits[0].slice(0, i));
        }
    }

    return '/';
};

module.exports = {collect, findBaseDir};