const _ = require('lodash');
const { Parser } = require('json2csv');

const formatDFLModelParams = (dflOutput, format = 'json') => {
    /*
    == Model options:
    == |== autobackup : True
    == |== batch_size : 8
    == |== sort_by_yaw : False
    == |== random_flip : False
    == |== resolution : 128
    == |== face_type : f
    == |== learn_mask : True
    == |== optimizer_mode : 1
    == |== archi : df
    == |== ae_dims : 256
    == |== e_ch_dims : 30
    == |== d_ch_dims : 15
    == |== multiscale_decoder : False
    == |== ca_weights : False
    == |== pixel_loss : False
    == |== face_style_power : 0.0
    == |== bg_style_power : 1.0
    == |== apply_random_ct : False
    == |== clipgrad : False
    == Running on:
    == |== [0 : GeForce GTX 1080]
    */

    const sections = String(dflOutput).split('== Running on:');

    const modelOptionsRaw = sections[0];
    const gpusRaw = sections[1];

    const modelOptionsRegex = /== \|== (.+?) : (.+)/g;
    const gpusRegex = /== \|== \[(.+?) : (.+)\]/g;

    const modelOptions = matchHelper(modelOptionsRegex, modelOptionsRaw);
    const gpus = matchHelper(gpusRegex, gpusRaw, (m) => `gpu${m}`);

    const json = _.merge({}, modelOptions, gpus);
    
    switch (format) {
        case 'json':
            return json;
        case 'csv': {
            const json2csvParser = new Parser({ fields: Object.keys(json) });
            const parsed = json2csvParser.parse(json);
            console.log(parsed);
            return parsed;
        }
    }
}

const matchHelper = (regex, string, transformMatch = (m) => m) => {
    let match;
    let converted = {};
    while ((match = regex.exec(string)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        converted[`${transformMatch(match[1])}`] = match[2];
    }
    return converted;
}

const characterReplacement = '-';

const normalizeString = (string) => {
    return string.replace(' ', characterReplacement).toLowerCase();
}

module.exports = { formatDFLModelParams, characterReplacement, normalizeString };