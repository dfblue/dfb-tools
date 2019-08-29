#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '.env')})
const program = require('commander');

program
    .version('1.0.0')
    .command('extract', 'Extract faces from source video')
    .command('new', 'Scaffold a workspace')
    .parse(process.argv);