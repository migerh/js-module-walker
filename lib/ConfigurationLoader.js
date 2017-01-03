import _ from 'lodash/fp';

export class ConfigurationLoader {
    static fromCLI(cliArguments) {
        return {
            paths: _.get('args', cliArguments)
        };
    }
}