const typescript = require('@rollup/plugin-typescript');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');

const input = 'src/index.ts';
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.name} Contributors
 * Released under the MIT License
 */`;

module.exports = [
  // UMD builds (excluding Chart)
  // dist/chartjs-gauge.js
  // dist/chartjs-gauge.min.js
  {
    input,
    plugins: [
      json(),
      typescript(),
      resolve({
        mainFields: ['module', 'main'],
        extensions: ['.mjs', '.cjs', '.js', '.jsx', '.json', '.node'],
        modulesOnly: true,
      }),
    ],
    output: {
      name: 'Gauge',
      file: 'dist/chartjs-gauge.js',
      banner,
      format: 'umd',
      indent: false,
      globals: {
        'chart.js': 'Chart',
        'chart.js/helpers': 'Chart.helpers',
      },
    },
    external: [
      'chart.js',
      'chart.js/helpers',
    ],
  },
  {
    input,
    plugins: [
      json(),
      typescript(),
      resolve({
        mainFields: ['module', 'main'],
        extensions: ['.mjs', '.cjs', '.js', '.jsx', '.json', '.node'],
        modulesOnly: true,
      }),
      terser({
        output: {
          preamble: banner,
        },
      }),
    ],
    output: {
      name: 'Gauge',
      file: 'dist/chartjs-gauge.min.js',
      format: 'umd',
      indent: false,
      globals: {
        'chart.js': 'Chart',
        'chart.js/helpers': 'Chart.helpers',
      },
    },
    external: [
      'chart.js',
      'chart.js/helpers',
    ],
  },
];
