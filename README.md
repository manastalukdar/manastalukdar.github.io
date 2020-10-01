# GitHub pages website source

## Continuous Integration

| Platform | Provider | Operations | Status |
|----------|----------|------------|--------|
| Linux | GitHub CI | Build, Deploy to master | [![build-deploy](https://github.com/manastalukdar/manastalukdar.github.io/workflows/build-deploy/badge.svg)](https://github.com/manastalukdar/manastalukdar.github.io/actions) |
| Linux | Circle CI | Build | [![CircleCI](https://circleci.com/gh/manastalukdar/manastalukdar.github.io/tree/source.svg?style=svg)](https://circleci.com/gh/manastalukdar/manastalukdar.github.io/tree/source) |
| N/A | david-dm | Check node.js dependency status | [![Dependency Status](https://david-dm.org/manastalukdar/manastalukdar.github.io.svg)](https://david-dm.org/manastalukdar/manastalukdar.github.io?path=website) |
| N/A | david-dm | Check node.js dev dependency status | [![devDependencies Status](https://david-dm.org/manastalukdar/manastalukdar.github.io/dev-status.svg?path=website)](https://david-dm.org/manastalukdar/manastalukdar.github.io?path=website&type=dev) |

## Misc

`node node_modules/eslint/bin/eslint.js --fix ./pages/**`
