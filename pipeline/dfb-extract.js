const fs = require('fs').promises;
const path = require('path')
const inquirer = require('inquirer');
const _ = require('lodash')
const shell = require('shelljs');

inquirer.registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'))

const extract = async (config) => {
    console.log('Starting extraction...');
    const {
        DFB_PIPELINE_EXTRACT_PERSON: person,
        DFB_PIPELINE_EXTRACT_WORKSPACE: workspaceFile,
    } = config;

    const workspaceConfig = JSON.parse(String(await fs.readFile(workspaceFile)));
    const workspace = workspaceConfig[person];
    console.log(`Working in workspace\n\n${JSON.stringify(workspace, null, 2)}`);


    const sourceVideos = shell.ls(path.join(workspace.src));
    const videoList = path.join(workspace.src, 'videos.txt')
    var videoFileNames = '';
    sourceVideos.forEach((fileName) => {
        videoFileNames = `${videoFileNames} file ${fileName}\n`
    });
    await fs.writeFile(videoList, videoFileNames);

    const combinedFileName = `${person}.mp4`;
    shell.exec(`ffmpeg -f concat -i ${videoList} -c copy ${combinedFileName}`)

    var filterFace = '';
    if (shell.ls(workspace.filter).length > 0) {
        const filterFiles = shell.find(workspace.filter).join(' ')
        filterFace = `-f ${filterFiles}`
    }

    // C:\Users\paperspace\MiniConda3\envs\faceswap\python.exe C:\Users\paperspace\dfb\faceswap\faceswap.py extract -i D:/dfb/celebrity/barack_obama/src/barack2.mp4 -o D:/dfb/celebrity/barack_obama/faces --serializer json -D s3fd -A fan -nm hist -min 240 -f C:/Users/paperspace/dfb/deepfakes/barack_obama/faces/barack2_003330_0.png -l 0.22 -bt 12.0 -een 10 -sz 256 -si 0 -L INFO
    const faceSwapExtract = shell.exec(`${workspaceConfig.python} ${workspaceConfig.faceswap} extract -i ${combinedFileName} -o ${workspace.faces} --serializer json -D s3fd -A fan -nm hist -min 180 ${filterFace} -l 0.22 -bt 12.0 -een 10 -sz 256 -si 0 -L INFO`, {async: true});
    faceSwapExtract.stdout.on('data', (data) => {
        console.log(data);
    });
}

const main = async () => {
    if (process.env.DFB_PIPELINE_MODE === 'interactive') {
        inquirer
            .prompt([
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
                    type: 'list',
                    name: 'DFB_PIPELINE_EXTRACT_PERSON',
                    message: 'Which person do you want to extract for?',
                    choices: ['a', 'b'],
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