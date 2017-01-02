import _ from 'lodash/fp';

export class ConfigurationLoader {
    static fromCLI(cliArguments) {
        return {
            path: _.get('args[0]', cliArguments)
        };
    }
}