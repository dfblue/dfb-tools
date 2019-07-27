var program = require('commander');

program
    .command('reddit', 'Source from Reddit', { isDefault: true })
    .command('youtube', 'Source from YouTube')
    .parse(process.argv);