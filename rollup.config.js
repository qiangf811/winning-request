// const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/request.js',
    name: 'win-request',
    format: 'umd'
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    json()
  ]
}