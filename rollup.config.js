const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');

const input = 'src/index.js';
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
      babel({
        exclude: 'node_modules/**',
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
      babel({
        exclude: 'node_modules/**',
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
