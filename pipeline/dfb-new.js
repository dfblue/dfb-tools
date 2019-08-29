const fs = require('fs').promises;
const path = require('path')
const inquirer = require('inquirer');
const _ = require('lodash')
const uuidv4 = require('uuid/v4');
const { characterReplacement, normalizeString } = require('../util/format');

const createWorkspace = async (config) => {
    const {
        DFB_PIPELINE_NEW_PERSON_A: faceA,
        DFB_PIPELINE_NEW_PERSON_B: faceB
    } = config;
    
    const workspaceDir = path.join(__dirname, `${process.env.DFB_PIPELINE_WORKSPACE}${characterReplacement}${uuidv4()}`);

    const faceADir = path.join(workspaceDir, faceA);
    const faceASrcDir = path.join(faceADir, 'src');
    const faceAFacesDir = path.join(faceADir, 'faces');
    const faceAOutputDir = path.join(faceADir, 'output');
    
    const faceBDir = path.join(workspaceDir, faceB);
    const faceBSrcDir = path.join(faceBDir, 'src');
    const faceBFacesDir = path.join(faceBDir, 'faces');
    const faceBOutputDir = path.join(faceBDir, 'output');

    await fs.mkdir(workspaceDir);

    await fs.mkdir(faceADir)
    await fs.mkdir(faceASrcDir)
    await fs.mkdir(faceAFacesDir)
    await fs.mkdir(faceAOutputDir)

    await fs.mkdir(faceBDir)
    await fs.mkdir(faceBSrcDir)
    await fs.mkdir(faceBFacesDir)
    await fs.mkdir(faceBOutputDir)

    const faceCombinedDir = path.join(workspaceDir, `${faceA}${characterReplacement}${faceB}`)
    const faceCombinedModelDir = path.join(faceCombinedDir, 'model');
    const faceCombinedConvertedDir = path.join(faceCombinedDir, 'converted');
    const faceCombinedTimelapseDir = path.join(faceCombinedDir, 'timelapse');
    
    await fs.mkdir(faceCombinedDir)
    await fs.mkdir(faceCombinedModelDir)
    await fs.mkdir(faceCombinedConvertedDir)
    await fs.mkdir(faceCombinedTimelapseDir)

    await fs.writeFile(path.resolve(workspaceDir, 'workspace.json'), JSON.stringify({
        a: {
            root: faceADir,
            src: faceASrcDir,
            faces: faceAFacesDir,
            output: faceAOutputDir,
        },
        b: {
            root: faceBDir,
            src: faceBSrcDir,
            faces: faceBFacesDir,
            output: faceBOutputDir,
        },
        combined: {
            root: faceCombinedDir,
            model: faceCombinedModelDir,
            converted: faceCombinedConvertedDir,
            timelapse: faceCombinedTimelapseDir,
        },
    }));
}

const main = async () => {
    if (process.env.DFB_PIPELINE_MODE === 'interactive') {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'DFB_PIPELINE_NEW_PERSON_B',
                    message: 'Who is the person you want to swap to?',
                    default: 'person b',
                    filter: normalizeString,
                },
                {
                    type: 'input',
                    name: 'DFB_PIPELINE_NEW_PERSON_A',
                    message: 'Who is the person you want to replace?',
                    default: 'person a',
                    filter: normalizeString,
                },
            ])
            .then(async answers => {
                await createWorkspace(answers);
            });
    } else if (process.env.DFB_PIPELINE_MODE === 'automated') {
        const config = _.pickBy(process.env, (value, key) => {
            return key.includes('DFB_PIPELINE_NEW');
        })
        await createWorkspace(config);
    }
}

try {
    main();
} catch (err) {
    console.error(err.message);
}