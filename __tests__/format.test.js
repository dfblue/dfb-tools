const { formatDFLModelParams } = require('../util/format');

test('converts DFL model params', () => {
    const DFLOutput = `    == Model options:
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
    == |== [0 : GeForce GTX 1080]`;

    const converted = formatDFLModelParams(DFLOutput);

    expect(converted).toEqual({ "gpu0": "GeForce GTX 1080", "ae_dims": "256", "apply_random_ct": "False", "archi": "df", "autobackup": "True", "batch_size": "8", "bg_style_power": "1.0", "ca_weights": "False", "clipgrad": "False", "d_ch_dims": "15", "e_ch_dims": "30", "face_style_power": "0.0", "face_type": "f", "learn_mask": "True", "multiscale_decoder": "False", "optimizer_mode": "1", "pixel_loss": "False", "random_flip": "False", "resolution": "128", "sort_by_yaw": "False" })
})