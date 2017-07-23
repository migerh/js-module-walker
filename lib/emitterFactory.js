const fs = require('fs');

const createEmitter = async output => {
    return new Promise((resolve, reject) => {
        if (output) {
            let stream = fs.createWriteStream(output, {flags: 'w', defaultEncoding: 'utf8'});

            stream.on('error', error => {
                reject(error);
            });

            stream.on('open', () => {
                resolve({
                    stream,
                    close: () => stream.close()
                });
            });

            return;
        }

        resolve({
            stream: process.stdout,
            close: () => {}
        });
    });
};

module.exports = {createEmitter};