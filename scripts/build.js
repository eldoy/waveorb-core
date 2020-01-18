// Build and distribute binaries
const x = require('child_process').execSync

// Package files
const pkg = x('pkg --out-path dist .')

// TODO(vidar): Need to make this more solid with versioning in file name
x('mv dist/waveorb-core-macos dist/server-macos')
x('mv dist/waveorb-core-win.exe dist/server-win.exe')
x('mv dist/waveorb-core-linux dist/server-linux')
