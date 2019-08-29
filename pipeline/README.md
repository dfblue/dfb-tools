# Pipeline for deepfaking

## .env

```bash
DFB_PIPELINE_WORKSPACE="./test-workspace"
# interactive|automated, interactive uses cli prompts to gather info, automated reads from env|.env
DFB_PIPELINE_MODE=interactive
```

```
chmod -R 754 pipeline
```

## deploy

```
npx pkg --out-path pipeline/build --targets node12-macos-x64,node12-linux-x64,node12-win-x64 package.json
```