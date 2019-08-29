const fs = require('fs').promises;
const path = require('path')
const inquirer = require('inquirer');
const _ = require('lodash')

inquirer.registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'))

const extract = async (config) => {
    console.log('Starting extraction...');
    const {
        DFB_PIPELINE_EXTRACT_PERSON: person,
        DFB_PIPELINE_EXTRACT_WORKSPACE: workspace,
    } = config;

    const workspaceConfig = JSON.parse(String(await fs.readFile(workspace)));
    console.log(`Reading faces from ${workspaceConfig[person].faces}`);
}

const main = async () => {
    if (process.env.DFB_PIPELINE_MODE === 'interactive') {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'DFB_PIPELINE_EXTRACT_PERSON',
                    message: 'Which person do you want to extract for?',
                    choices: ['a', 'b'],
                },
                {
                    type: 'file-tree-selection',
                    name: 'DFB_PIPELINE_EXTRACT_WORKSPACE',
                    message: 'Choose the workspace config file created with `dfb new`. (Space opens directories)',
                    validate: (input) => {
                        // TODO: properly validate the workspace file
                        return (path.extname(input) === '.json' || 'Choose a .json file');
                    },
                },
                {
                    type: 'confirm',
                    name: 'DFB_PIPELINE_EXTRACT_SRC_CONFIRM',
                    message: 'Have you put the person\'s source files in /src folder?',
                    validate: (input) => {
                        return (input || 'Please put those source files there now');
                    },
                    default: true,
                },
            ])
            .then(async answers => {
                extract(answers);
            });
    } else if (process.env.DFB_PIPELINE_MODE === 'automated') {
        const config = _.pickBy(process.env, (value, key) => {
            return key.includes('DFB_PIPELINE_EXTRACT');
        });
        extract(config);
    }
}

try {
    main();
} catch (err) {
    console.error(err.message);
}