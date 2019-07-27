# DeepFakeBlue Tools
> Improve deepfake community by publishing tools to automate deepfake related tasks

## Format API
![dfl-notes screenshot](https://i.imgur.com/4CGBx7ih.jpg)

`/format` takes DFL training output like:

```
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
```

...and converts it to JSON.

### API Submissions
Soon there will be a web page to submit DFL runs with resulting video and notes.

### API Development
You will need the `now` cli (https://github.com/zeit/now-cli) to develop. `npx now` will work.

`npm run api-dev`

### API Deployment
Hosted on now.sh as a lambda using the @now/node builder. 

dfblue org (https://zeit.co/dfblue/dfl-notes)

`npm run api-deploy`

## Testing
Testing is done with jest.

`npm run test`