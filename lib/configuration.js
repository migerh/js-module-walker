import _ from 'lodash/fp';

export const loadConfigFromCLI = function (cliArguments) {
    return {
        paths: _.get('args', cliArguments),
        output: _.get('output', cliArguments, undefined),
        findCycles: _.get('findCycles', cliArguments, false),
        ignorePackages: _.get('ignorePackages', cliArguments, false)
    };
};