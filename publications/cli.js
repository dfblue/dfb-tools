var program = require('commander');

program
    .version('1.0.0')
    .command('gather', 'Gather new deepfakes', { isDefault: true })
    .parse(process.argv);