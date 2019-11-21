// const buble = require('rollup-plugin-buble')
const babel = require("rollup-plugin-babel")
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/request.js',
    name: 'request',
    format: 'umd'
  },
  plugins: [
    commonjs(),
    nodeResolve({jsnext: true, preferBuiltins: true, browser: true}),
    babel({
      exclude: ["node_modules/**"],
      runtimeHelpers: true
    }),
    json()
  ]
}